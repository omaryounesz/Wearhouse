package routes

import (
	"wearhouse/internal/handlers"
	"wearhouse/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

func SetupPaymentRoutes(app *fiber.App, paymentHandler *handlers.PaymentHandler) {
	payments := app.Group("/api/payments")

	// Protected routes (require authentication)
	payments.Post("/create-intent", middleware.AuthMiddleware(), paymentHandler.CreatePaymentIntent)

	// Webhook route (no authentication required as it's called by Stripe)
	app.Post("/api/webhook/stripe", paymentHandler.HandleWebhook)
}
