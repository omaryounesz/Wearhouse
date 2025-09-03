package handlers

import (
	"errors"
	"wearhouse/internal/database"
	"wearhouse/internal/models"
	"wearhouse/internal/types"
	"wearhouse/internal/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// CreateOrder converts the user's cart to an order
func CreateOrder(c *fiber.Ctx) error {
	// Get user from context (set by auth middleware)
	claims := c.Locals("user").(*utils.JWTClaims)
	user := &models.User{ID: claims.UserID}

	// Parse request body
	var req types.CreateOrderRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	// Validate request
	if req.ShippingAddr == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Shipping address is required")
	}
	if req.BillingAddr == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Billing address is required")
	}
	if req.PaymentMethod == "" {
		return fiber.NewError(fiber.StatusBadRequest, "Payment method is required")
	}
	if req.PaymentMethod != "credit_card" && req.PaymentMethod != "paypal" {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid payment method")
	}

	// Get user's cart
	var cart models.Cart
	if err := database.DB.Preload("Items.Product").Where("user_id = ?", user.ID).First(&cart).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Cart not found")
		}
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to get cart")
	}

	// Check if cart is empty
	if len(cart.Items) == 0 {
		return fiber.NewError(fiber.StatusBadRequest, "Cart is empty")
	}

	// Calculate cart total
	var total float64
	for _, item := range cart.Items {
		total += item.Product.Price * float64(item.Quantity)
	}

	// Start transaction
	tx := database.DB.Begin()
	if tx.Error != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to start transaction")
	}

	// Create order
	order := models.Order{
		UserID:        user.ID,
		Status:        models.OrderStatusPending,
		Total:         total,
		ShippingAddr:  req.ShippingAddr,
		BillingAddr:   req.BillingAddr,
		PaymentMethod: req.PaymentMethod,
	}

	if err := tx.Create(&order).Error; err != nil {
		tx.Rollback()
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to create order")
	}

	// Create order items
	for _, cartItem := range cart.Items {
		orderItem := models.OrderItem{
			OrderID:   order.ID,
			ProductID: cartItem.ProductID,
			Quantity:  cartItem.Quantity,
			Price:     cartItem.Product.Price,
		}
		if err := tx.Create(&orderItem).Error; err != nil {
			tx.Rollback()
			return fiber.NewError(fiber.StatusInternalServerError, "Failed to create order items")
		}
	}

	// Clear cart
	if err := tx.Delete(&cart.Items).Error; err != nil {
		tx.Rollback()
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to clear cart items")
	}

	// Commit transaction
	if err := tx.Commit().Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to commit transaction")
	}

	// Load order with items and products for response
	if err := database.DB.Preload("Items.Product").First(&order, order.ID).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to load order")
	}

	// Convert to response type
	return c.Status(fiber.StatusCreated).JSON(orderToResponse(&order))
}

// GetOrders returns all orders for the authenticated user
func GetOrders(c *fiber.Ctx) error {
	claims := c.Locals("user").(*utils.JWTClaims)
	user := &models.User{ID: claims.UserID}

	var orders []models.Order
	if err := database.DB.Preload("Items.Product").Where("user_id = ?", user.ID).Find(&orders).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to get orders")
	}

	// Convert to response type
	response := make([]types.OrderResponse, len(orders))
	for i, order := range orders {
		response[i] = *orderToResponse(&order)
	}

	return c.JSON(response)
}

// GetOrder returns a specific order by ID
func GetOrder(c *fiber.Ctx) error {
	claims := c.Locals("user").(*utils.JWTClaims)
	user := &models.User{ID: claims.UserID}

	orderID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid order ID")
	}

	var order models.Order
	if err := database.DB.Preload("Items.Product").Where("id = ? AND user_id = ?", orderID, user.ID).First(&order).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Order not found")
		}
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to get order")
	}

	return c.JSON(orderToResponse(&order))
}

// UpdateOrderStatus updates the status of an order
func UpdateOrderStatus(c *fiber.Ctx) error {
	claims := c.Locals("user").(*utils.JWTClaims)
	user := &models.User{ID: claims.UserID}

	orderID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid order ID")
	}

	var req types.UpdateOrderStatusRequest
	if err := c.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	// Validate status
	validStatuses := map[string]bool{
		"pending":   true,
		"paid":      true,
		"shipped":   true,
		"delivered": true,
		"cancelled": true,
	}
	if !validStatuses[req.Status] {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid order status")
	}

	var order models.Order
	if err := database.DB.Where("id = ? AND user_id = ?", orderID, user.ID).First(&order).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.NewError(fiber.StatusNotFound, "Order not found")
		}
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to get order")
	}

	// Update status
	order.Status = models.OrderStatus(req.Status)
	if err := database.DB.Save(&order).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to update order status")
	}

	// Load order with items and products for response
	if err := database.DB.Preload("Items.Product").First(&order, order.ID).Error; err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to load order")
	}

	return c.JSON(orderToResponse(&order))
}

// Helper function to convert Order model to OrderResponse
func orderToResponse(order *models.Order) *types.OrderResponse {
	items := make([]types.OrderItemResponse, len(order.Items))
	for i, item := range order.Items {
		items[i] = types.OrderItemResponse{
			ID:        item.ID,
			ProductID: item.ProductID,
			Product:   productToResponse(&item.Product),
			Quantity:  item.Quantity,
			Price:     item.Price,
			CreatedAt: item.CreatedAt,
			UpdatedAt: item.UpdatedAt,
		}
	}

	return &types.OrderResponse{
		ID:            order.ID,
		UserID:        order.UserID,
		Items:         items,
		Status:        string(order.Status),
		Total:         order.Total,
		ShippingAddr:  order.ShippingAddr,
		BillingAddr:   order.BillingAddr,
		PaymentMethod: order.PaymentMethod,
		CreatedAt:     order.CreatedAt,
		UpdatedAt:     order.UpdatedAt,
	}
}

// Helper function to convert Product model to ProductResponse
func productToResponse(product *models.Product) types.ProductResponse {
	return types.ProductResponse{
		ID:          product.ID.String(),
		UserID:      product.UserID.String(),
		Title:       product.Title,
		Description: product.Description,
		Category:    product.Category,
		Size:        product.Size,
		Brand:       product.Brand,
		Condition:   product.Condition,
		Price:       product.Price,
		IsAvailable: product.IsAvailable,
		Images:      product.Images,
		CreatedAt:   product.CreatedAt.String(),
		UpdatedAt:   product.UpdatedAt.String(),
	}
}
