package main

import (
	"log"
	"wearhouse/configs"
	"wearhouse/internal/database"
	"wearhouse/internal/handlers"
	"wearhouse/internal/middleware"
	"wearhouse/internal/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	// Load configuration
	config, err := configs.LoadConfig()
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	// Connect to database
	if err := database.Connect(config); err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}
	defer database.Close()

	// Initialize Fiber app
	app := fiber.New()

	// Add CORS middleware
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE",
	}))

	// Initialize auth middleware
	middleware.InitAuth(config.JWTSecret)

	// Initialize payment handler
	paymentHandler := handlers.NewPaymentHandler(config.StripeSecretKey)

	// Setup routes
	routes.SetupAuthRoutes(app, config)
	routes.SetupUserRoutes(app, config)
	routes.SetupProductRoutes(app, config)
	routes.SetupCartRoutes(app, config)
	routes.SetupOrderRoutes(app, config)
	routes.SetupPaymentRoutes(app, paymentHandler)

	// Start server
	log.Printf("Server starting on port %s", config.Port)
	if err := app.Listen(":" + config.Port); err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}
