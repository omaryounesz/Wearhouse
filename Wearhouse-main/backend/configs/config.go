package configs

import (
	"log"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

type CloudinaryConfig struct {
	CloudName string
	APIKey    string
	APISecret string
}

type SMTPConfig struct {
	Host     string
	Port     int
	Username string
	Password string
}

type Config struct {
	DatabaseURL         string
	JWTSecret           string
	TokenExpiresIn      time.Duration
	Cloudinary          CloudinaryConfig
	SMTP                SMTPConfig
	AppURL              string
	StripeSecretKey     string
	StripeWebhookSecret string
	Port                string
}

func LoadConfig() (*Config, error) {
	// Load .env file if it exists
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .env file not found")
	}

	// Debug environment variables
	log.Printf("Environment variables:")
	for _, env := range os.Environ() {
		log.Printf("%s", env)
	}

	jwtExpiry, err := strconv.Atoi(getEnvOrDefault("JWT_EXPIRY", "24"))
	if err != nil {
		return nil, err
	}

	cloudName := getEnvOrDefault("CLOUDINARY_CLOUD_NAME", "")
	apiKey := getEnvOrDefault("CLOUDINARY_API_KEY", "")
	apiSecret := getEnvOrDefault("CLOUDINARY_API_SECRET", "")

	smtpPort, err := strconv.Atoi(getEnvOrDefault("SMTP_PORT", "587"))
	if err != nil {
		return nil, err
	}

	config := &Config{
		DatabaseURL:    getEnvOrDefault("DATABASE_URL", "postgresql://postgres:postgres@postgres:5432/wearhouse?sslmode=disable"),
		JWTSecret:      getEnvOrDefault("JWT_SECRET", "your-secret-key"),
		TokenExpiresIn: time.Duration(jwtExpiry) * time.Hour,
		Cloudinary: CloudinaryConfig{
			CloudName: cloudName,
			APIKey:    apiKey,
			APISecret: apiSecret,
		},
		SMTP: SMTPConfig{
			Host:     getEnvOrDefault("SMTP_HOST", "smtp.gmail.com"),
			Port:     smtpPort,
			Username: getEnvOrDefault("SMTP_USERNAME", ""),
			Password: getEnvOrDefault("SMTP_PASSWORD", ""),
		},
		AppURL:              getEnvOrDefault("APP_URL", "http://localhost:3000"),
		StripeSecretKey:     getEnvOrDefault("STRIPE_SECRET_KEY", ""),
		StripeWebhookSecret: getEnvOrDefault("STRIPE_WEBHOOK_SECRET", ""),
		Port:                getEnvOrDefault("PORT", "8080"),
	}

	return config, nil
}

func getEnvOrDefault(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	log.Printf("Environment variable %s not found, using default value", key)
	return defaultValue
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return defaultValue
}
