package database

import (
	"fmt"
	"log"
	"wearhouse/configs"
	"wearhouse/internal/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// Connect establishes a connection to the database
func Connect(config *configs.Config) error {
	log.Printf("Attempting to connect to database with DSN: %s", config.DatabaseURL)

	db, err := gorm.Open(postgres.Open(config.DatabaseURL), &gorm.Config{})
	if err != nil {
		log.Printf("Error connecting to database: %v", err)
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	DB = db

	// Enable UUID extension
	if err := DB.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";").Error; err != nil {
		log.Printf("Error enabling uuid-ossp extension: %v", err)
		return fmt.Errorf("failed to enable uuid-ossp extension: %w", err)
	}

	// Auto-migrate models
	if err := DB.AutoMigrate(
		&models.User{},
		&models.Product{},
		&models.Cart{},
		&models.CartItem{},
		&models.Order{},
		&models.OrderItem{},
		&models.Payment{},
	); err != nil {
		log.Printf("Error migrating database: %v", err)
		return fmt.Errorf("failed to migrate database: %w", err)
	}

	return nil
}

// Close closes the database connection
func Close() {
	if DB != nil {
		sqlDB, err := DB.DB()
		if err != nil {
			log.Printf("Error getting underlying *sql.DB: %v", err)
			return
		}
		if err := sqlDB.Close(); err != nil {
			log.Printf("Error closing database connection: %v", err)
		}
	}
}
