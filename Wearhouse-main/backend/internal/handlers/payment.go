package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"wearhouse/internal/database"
	"wearhouse/internal/models"
	"wearhouse/internal/types"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/stripe/stripe-go/v76"
	"github.com/stripe/stripe-go/v76/paymentintent"
	"github.com/stripe/stripe-go/v76/webhook"
)

var validate = validator.New()

type PaymentHandler struct {
	stripeKey string
}

func NewPaymentHandler(stripeKey string) *PaymentHandler {
	stripe.Key = stripeKey
	return &PaymentHandler{
		stripeKey: stripeKey,
	}
}

// CreatePaymentIntent creates a new payment intent with Stripe
func (h *PaymentHandler) CreatePaymentIntent(c *fiber.Ctx) error {
	var req types.CreatePaymentIntentRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	// Validate request
	if err := validate.Struct(req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request data")
	}

	// Get order from database
	orderID, err := uuid.Parse(req.OrderID)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid order ID")
	}

	var order models.Order
	if err := database.DB.First(&order, "id = ?", orderID).Error; err != nil {
		return fiber.NewError(fiber.StatusNotFound, "Order not found")
	}

	// Create payment intent
	params := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(int64(req.Amount * 100)), // Convert to cents
		Currency: stripe.String(req.Currency),
		Metadata: map[string]string{
			"order_id": req.OrderID,
		},
	}

	pi, err := paymentintent.New(params)
	if err != nil {
		log.Printf("Error creating payment intent: %v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to create payment intent")
	}

	// Create payment record in database
	payment := models.Payment{
		OrderID:       orderID,
		Amount:        req.Amount,
		Currency:      req.Currency,
		Status:        string(types.PaymentStatusPending),
		PaymentMethod: order.PaymentMethod,
		StripeID:      pi.ID,
	}

	if err := database.DB.Create(&payment).Error; err != nil {
		log.Printf("Error creating payment record: %v", err)
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to create payment record")
	}

	return c.JSON(types.CreatePaymentIntentResponse{
		ClientSecret: pi.ClientSecret,
		PaymentID:    payment.ID.String(),
	})
}

// HandleWebhook handles Stripe webhook events
func (h *PaymentHandler) HandleWebhook(c *fiber.Ctx) error {
	payload := c.Body()
	event, err := webhook.ConstructEvent(payload, c.Get("Stripe-Signature"), h.stripeKey)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid webhook signature")
	}

	switch event.Type {
	case "payment_intent.succeeded":
		var pi stripe.PaymentIntent
		err := json.Unmarshal(event.Data.Raw, &pi)
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Invalid payment intent data")
		}
		if err := h.handlePaymentSuccess(&pi); err != nil {
			log.Printf("Error handling payment success: %v", err)
			return fiber.NewError(fiber.StatusInternalServerError, "Failed to process payment success")
		}

	case "payment_intent.payment_failed":
		var pi stripe.PaymentIntent
		err := json.Unmarshal(event.Data.Raw, &pi)
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "Invalid payment intent data")
		}
		if err := h.handlePaymentFailure(&pi); err != nil {
			log.Printf("Error handling payment failure: %v", err)
			return fiber.NewError(fiber.StatusInternalServerError, "Failed to process payment failure")
		}
	}

	return c.SendStatus(fiber.StatusOK)
}

func (h *PaymentHandler) handlePaymentSuccess(pi *stripe.PaymentIntent) error {
	orderID := pi.Metadata["order_id"]
	var payment models.Payment
	if err := database.DB.Where("stripe_id = ?", pi.ID).First(&payment).Error; err != nil {
		return fmt.Errorf("payment not found: %w", err)
	}

	// Update payment status
	payment.Status = string(types.PaymentStatusSuccess)
	if err := database.DB.Save(&payment).Error; err != nil {
		return fmt.Errorf("failed to update payment: %w", err)
	}

	// Update order status
	var order models.Order
	if err := database.DB.First(&order, "id = ?", orderID).Error; err != nil {
		return fmt.Errorf("order not found: %w", err)
	}

	order.Status = "paid"
	if err := database.DB.Save(&order).Error; err != nil {
		return fmt.Errorf("failed to update order: %w", err)
	}

	return nil
}

func (h *PaymentHandler) handlePaymentFailure(pi *stripe.PaymentIntent) error {
	var payment models.Payment
	if err := database.DB.Where("stripe_id = ?", pi.ID).First(&payment).Error; err != nil {
		return fmt.Errorf("payment not found: %w", err)
	}

	// Update payment status
	payment.Status = string(types.PaymentStatusFailed)
	if pi.LastPaymentError != nil {
		payment.Error = pi.LastPaymentError.Error()
	}

	if err := database.DB.Save(&payment).Error; err != nil {
		return fmt.Errorf("failed to update payment: %w", err)
	}

	return nil
}
