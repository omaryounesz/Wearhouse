package routes

import (
	"wearhouse/configs"
	"wearhouse/internal/handlers"

	"github.com/gofiber/fiber/v2"
)

// SetupAuthRoutes sets up all auth-related routes
func SetupAuthRoutes(app *fiber.App, config *configs.Config) {
	authHandler := handlers.NewAuthHandler(config)

	// Auth routes
	auth := app.Group("/auth")
	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)
	auth.Get("/verify-email", authHandler.VerifyEmail)
	auth.Post("/verify", authHandler.VerifyWithToken)
	auth.Post("/resend-verification", authHandler.ResendVerification)

	// Add health check endpoint
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})
}
