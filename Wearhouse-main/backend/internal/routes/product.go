package routes

import (
	"wearhouse/internal/handlers"
	"wearhouse/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

// SetupProductRoutes sets up all product-related routes
func SetupProductRoutes(app *fiber.App, config interface{}) {
	products := app.Group("/api/products")

	// Public routes
	products.Get("/", handlers.ListProducts)
	products.Get("/:id", handlers.GetProduct)

	// Protected routes (require authentication)
	admin := products.Group("/admin")
	admin.Use(middleware.AuthMiddleware())
	admin.Post("/", handlers.CreateProduct)
	admin.Put("/:id", handlers.UpdateProduct)
	admin.Delete("/:id", handlers.DeleteProduct)
}
