package utils

import (
	"context"
	"fmt"
	"log"
	"mime/multipart"
	"sync"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

var (
	cld      *cloudinary.Cloudinary
	cldMutex sync.RWMutex
)

// InitCloudinary initializes the Cloudinary client
func InitCloudinary(cloudName, apiKey, apiSecret string) error {
	log.Printf("InitCloudinary called with: cloudName=%s, apiKey=%s, apiSecret=%s", cloudName, apiKey, apiSecret)

	// Validate credentials
	if cloudName == "" || apiKey == "" || apiSecret == "" {
		return fmt.Errorf("missing required Cloudinary credentials")
	}

	// Create new client
	log.Println("Creating new Cloudinary client...")
	newCld, err := cloudinary.NewFromParams(cloudName, apiKey, apiSecret)
	if err != nil {
		return fmt.Errorf("failed to create Cloudinary client: %w", err)
	}

	// Test the connection
	log.Println("Testing Cloudinary connection...")
	ctx := context.Background()
	_, err = newCld.Admin.Ping(ctx)
	if err != nil {
		return fmt.Errorf("failed to ping Cloudinary: %w", err)
	}

	// Set the client
	cldMutex.Lock()
	defer cldMutex.Unlock()

	cld = newCld
	log.Printf("Cloudinary client initialized successfully with cloud name: %s", cloudName)
	return nil
}

// UploadImage uploads an image to Cloudinary and returns the URL
func UploadImage(ctx context.Context, file *multipart.FileHeader) (string, error) {
	cldMutex.RLock()
	client := cld
	cldMutex.RUnlock()

	if client == nil {
		log.Printf("Cloudinary client not initialized in UploadImage (client is nil)")
		return "", fmt.Errorf("Cloudinary client not initialized")
	}

	log.Printf("Uploading file %s to Cloudinary...", file.Filename)

	// Open the file
	src, err := file.Open()
	if err != nil {
		log.Printf("Failed to open file: %v", err)
		return "", fmt.Errorf("failed to open file: %w", err)
	}
	defer src.Close()

	// Upload to cloudinary
	uploadResult, err := client.Upload.Upload(ctx, src, uploader.UploadParams{
		Folder: "wearhouse",
	})
	if err != nil {
		log.Printf("Failed to upload file to Cloudinary: %v", err)
		return "", fmt.Errorf("failed to upload file: %w", err)
	}

	log.Printf("File %s uploaded successfully to Cloudinary with URL: %s", file.Filename, uploadResult.SecureURL)
	return uploadResult.SecureURL, nil
}

// UploadImages uploads multiple images to Cloudinary and returns their URLs
func UploadImages(ctx context.Context, files []*multipart.FileHeader) ([]string, error) {
	cldMutex.RLock()
	client := cld
	cldMutex.RUnlock()

	if client == nil {
		log.Printf("Cloudinary client not initialized in UploadImages (client is nil)")
		return nil, fmt.Errorf("Cloudinary client not initialized")
	}

	log.Printf("Uploading %d files to Cloudinary...", len(files))
	urls := make([]string, 0, len(files))
	for _, file := range files {
		url, err := UploadImage(ctx, file)
		if err != nil {
			log.Printf("Failed to upload file %s: %v", file.Filename, err)
			return nil, fmt.Errorf("failed to upload image: %w", err)
		}
		urls = append(urls, url)
	}
	log.Printf("Successfully uploaded %d files to Cloudinary", len(files))
	return urls, nil
}
