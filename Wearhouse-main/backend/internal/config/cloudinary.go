package config

import (
	"context"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
)

type CloudinaryConfig struct {
	CloudName string
	APIKey    string
	APISecret string
}

func NewCloudinaryConfig() *CloudinaryConfig {
	return &CloudinaryConfig{
		CloudName: os.Getenv("CLOUDINARY_CLOUD_NAME"),
		APIKey:    os.Getenv("CLOUDINARY_API_KEY"),
		APISecret: os.Getenv("CLOUDINARY_API_SECRET"),
	}
}

func (c *CloudinaryConfig) InitCloudinary() (*cloudinary.Cloudinary, error) {
	cld, err := cloudinary.NewFromParams(c.CloudName, c.APIKey, c.APISecret)
	if err != nil {
		return nil, err
	}

	// Test the connection
	ctx := context.Background()
	_, err = cld.Admin.Ping(ctx)
	if err != nil {
		return nil, err
	}

	return cld, nil
}
