package routes

import (
	"wearhouse/internal/handlers"
	"wearhouse/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

// SetupCartRoutes sets up all the cart routes
func SetupCartRoutes(app *fiber.App, config interface{}) {
	cart := app.Group("/api/cart")

	// Protected routes (require authentication)
	cart.Use(middleware.AuthMiddleware())

	// Cart routes
	cart.Get("/", handlers.GetCart)
	cart.Post("/items", handlers.AddToCart)
	cart.Put("/items/:id", handlers.UpdateCartItem)
	cart.Delete("/items/:id", handlers.RemoveFromCart)
	cart.Delete("/", handlers.ClearCart)
}
