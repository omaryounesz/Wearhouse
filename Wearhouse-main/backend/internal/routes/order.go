package routes

import (
	"wearhouse/internal/handlers"
	"wearhouse/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

// SetupOrderRoutes sets up all order-related routes
func SetupOrderRoutes(app *fiber.App, config interface{}) {
	orders := app.Group("/api/orders")

	// Protected routes (require authentication)
	orders.Use(middleware.AuthMiddleware())
	orders.Post("/", handlers.CreateOrder)
	orders.Get("/", handlers.GetOrders)
	orders.Get("/:id", handlers.GetOrder)
	orders.Put("/:id/status", handlers.UpdateOrderStatus)
}
