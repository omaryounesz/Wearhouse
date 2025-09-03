package routes

import (
	"wearhouse/configs"
	"wearhouse/internal/middleware"

	"github.com/gofiber/fiber/v2"
)

// SetupUserRoutes sets up all user-related routes
func SetupUserRoutes(app *fiber.App, config *configs.Config) {
	users := app.Group("/api/users")

	// Protected routes (require authentication)
	users.Use(middleware.AuthMiddleware())
	users.Get("/me", func(c *fiber.Ctx) error {
		// Get user ID from context (set by middleware)
		userID := c.Locals("user_id").(string)
		return c.JSON(fiber.Map{
			"user_id": userID,
		})
	})
}
