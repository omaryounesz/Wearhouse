package main

import (
	"log"
	"wearhouse/configs"
	"wearhouse/internal/database"
	"wearhouse/internal/handlers"
	"wearhouse/internal/middleware"
	"wearhouse/internal/routes"
	"wearhouse/internal/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	// Load configuration
	log.Println("Loading configuration...")
	config, err := configs.LoadConfig()
	if err != nil {
		log.Fatalf("Error loading config: %v", err)
	}

	// Initialize Cloudinary first
	log.Println("Loading Cloudinary configuration...")
	log.Printf("Cloudinary Config - CloudName: %s, APIKey: %s, APISecret: %s",
		config.Cloudinary.CloudName,
		config.Cloudinary.APIKey,
		config.Cloudinary.APISecret)

	log.Println("Initializing Cloudinary client...")
	if err := utils.InitCloudinary(
		config.Cloudinary.CloudName,
		config.Cloudinary.APIKey,
		config.Cloudinary.APISecret,
	); err != nil {
		log.Fatalf("Error initializing Cloudinary: %v", err)
	}
	log.Println("Cloudinary client initialized successfully")

	// Initialize database
	log.Println("Connecting to database...")
	if err := database.Connect(config); err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}
	defer database.Close()

	// Create Fiber app
	log.Println("Creating Fiber app...")
	app := fiber.New(fiber.Config{
		BodyLimit: 10 * 1024 * 1024, // 10MB limit for file uploads
	})

	// Middleware
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE",
	}))

	// Initialize auth middleware
	middleware.InitAuth(config.JWTSecret)

	// Health check route
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})

	// Setup routes
	log.Println("Setting up routes...")
	routes.SetupAuthRoutes(app, config)
	routes.SetupProductRoutes(app, config)
	routes.SetupOrderRoutes(app, config)
	routes.SetupCartRoutes(app, config)

	// Initialize payment handler and routes
	paymentHandler := handlers.NewPaymentHandler(config.StripeSecretKey)
	routes.SetupPaymentRoutes(app, paymentHandler)

	// Start server
	log.Printf("Server starting on port %s", config.Port)
	if err := app.Listen(":" + config.Port); err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}
