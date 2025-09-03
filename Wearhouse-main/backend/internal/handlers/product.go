package handlers

import (
	"fmt"
	"log"
	"strconv"
	"strings"
	"wearhouse/internal/database"
	"wearhouse/internal/models"
	"wearhouse/internal/types"
	"wearhouse/internal/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// CreateProduct handles the creation of a new product
func CreateProduct(c *fiber.Ctx) error {
	// Get user from context (set by auth middleware)
	claims := c.Locals("user").(*utils.JWTClaims)

	var title, description, category, size, brand, condition string
	var price float64
	var err error

	// Try to parse JSON first
	var req types.CreateProductRequest
	if err := c.BodyParser(&req); err == nil {
		title = req.Title
		description = req.Description
		category = req.Category
		size = req.Size
		brand = req.Brand
		condition = req.Condition
		price = req.Price
	} else {
		// If JSON parsing fails, try form data
		title = c.FormValue("title")
		description = c.FormValue("description")
		category = c.FormValue("category")
		size = c.FormValue("size")
		brand = c.FormValue("brand")
		condition = c.FormValue("condition")
		priceStr := c.FormValue("price")

		// Convert price to float64
		price, err = strconv.ParseFloat(priceStr, 64)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid price format",
			})
		}
	}

	log.Printf("Received request: title=%s, description=%s", title, description)

	// Create product
	product := models.Product{
		UserID:      claims.UserID,
		Title:       title,
		Description: description,
		Category:    category,
		Size:        size,
		Brand:       brand,
		Condition:   condition,
		Price:       price,
		IsAvailable: true,
	}

	// Handle image upload if present
	form, err := c.MultipartForm()
	if err == nil && form.File != nil {
		if files, ok := form.File["images[]"]; ok {
			log.Printf("Received %d files", len(files))

			// Validate file types and sizes
			for _, file := range files {
				log.Printf("Processing file: name=%s, size=%d, header=%v", file.Filename, file.Size, file.Header)

				// Check file size (5MB limit)
				if file.Size > 5*1024*1024 {
					return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
						"error": fmt.Sprintf("File %s is too large. Maximum size is 5MB", file.Filename),
					})
				}

				// Check file type
				contentType := file.Header.Get("Content-Type")
				log.Printf("File content type: %s", contentType)
				if !strings.HasPrefix(contentType, "image/") {
					return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
						"error": fmt.Sprintf("File %s is not an image", file.Filename),
					})
				}
			}

			// Upload images to Cloudinary
			log.Printf("Uploading %d images to Cloudinary...", len(files))
			imageURLs, err := utils.UploadImages(c.Context(), files)
			if err != nil {
				log.Printf("Error uploading images: %v", err)
				return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
					"error": "Failed to upload images",
				})
			}
			log.Printf("Successfully uploaded images: %v", imageURLs)
			product.Images = imageURLs
		}
	}

	// Save to database
	if err := database.DB.Create(&product).Error; err != nil {
		log.Printf("Error creating product: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create product",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(toProductResponse(&product))
}

// GetProduct retrieves a single product by ID
func GetProduct(c *fiber.Ctx) error {
	id := c.Params("id")
	productID, err := uuid.Parse(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid product ID",
		})
	}

	var product models.Product
	if err := database.DB.First(&product, "id = ?", productID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Product not found",
		})
	}

	return c.JSON(toProductResponse(&product))
}

// ListProducts retrieves a list of products with filters
func ListProducts(c *fiber.Ctx) error {
	var filters types.ProductFilters
	if err := c.QueryParser(&filters); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid query parameters",
		})
	}

	// Set defaults
	if filters.Page < 1 {
		filters.Page = 1
	}
	if filters.PerPage < 1 {
		filters.PerPage = 10
	}

	// Build query
	query := database.DB.Model(&models.Product{})

	// Apply filters
	if filters.Category != "" {
		query = query.Where("category = ?", filters.Category)
	}
	if filters.Size != "" {
		query = query.Where("size = ?", filters.Size)
	}
	if filters.Brand != "" {
		query = query.Where("brand = ?", filters.Brand)
	}
	if filters.Condition != "" {
		query = query.Where("condition = ?", filters.Condition)
	}
	if filters.MinPrice != nil {
		query = query.Where("price >= ?", filters.MinPrice)
	}
	if filters.MaxPrice != nil {
		query = query.Where("price <= ?", filters.MaxPrice)
	}
	if filters.Search != "" {
		search := "%" + filters.Search + "%"
		query = query.Where("title ILIKE ? OR description ILIKE ?", search, search)
	}
	if filters.IsAvailable != nil {
		query = query.Where("is_available = ?", filters.IsAvailable)
	}

	// Get total count
	var total int64
	if err := query.Count(&total).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to count products",
		})
	}

	// Apply pagination and sorting
	offset := (filters.Page - 1) * filters.PerPage
	query = query.Offset(offset).Limit(filters.PerPage)

	if filters.SortBy != "" {
		order := "asc"
		if filters.SortOrder == "desc" {
			order = "desc"
		}
		query = query.Order(filters.SortBy + " " + order)
	} else {
		query = query.Order("created_at desc")
	}

	// Execute query
	var products []models.Product
	if err := query.Find(&products).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch products",
		})
	}

	// Convert to response
	productResponses := make([]types.ProductResponse, len(products))
	for i, product := range products {
		productResponses[i] = *toProductResponse(&product)
	}

	return c.JSON(types.ProductListResponse{
		Products: productResponses,
		Total:    total,
		Page:     filters.Page,
		PerPage:  filters.PerPage,
	})
}

// UpdateProduct updates an existing product
func UpdateProduct(c *fiber.Ctx) error {
	// Get user from context (set by auth middleware)
	claims := c.Locals("user").(*utils.JWTClaims)

	// Get product ID from URL
	productID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid product ID",
		})
	}

	// Get existing product
	var product models.Product
	if err := database.DB.First(&product, "id = ?", productID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Product not found",
		})
	}

	// Check ownership
	if product.UserID != claims.UserID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "You don't have permission to update this product",
		})
	}

	// Parse multipart form
	var req types.UpdateProductRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Handle image uploads if provided
	if len(req.Images) > 0 {
		// Validate file types and sizes
		for _, file := range req.Images {
			// Check file size (5MB limit)
			if file.Size > 5*1024*1024 {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"error": fmt.Sprintf("File %s is too large. Maximum size is 5MB", file.Filename),
				})
			}

			// Check file type
			contentType := file.Header.Get("Content-Type")
			if !strings.HasPrefix(contentType, "image/") {
				return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
					"error": fmt.Sprintf("File %s is not an image", file.Filename),
				})
			}
		}

		// Upload new images to Cloudinary
		imageURLs, err := utils.UploadImages(c.Context(), req.Images)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to upload images",
			})
		}
		product.Images = imageURLs
	}

	// Update fields if provided
	if req.Title != nil {
		product.Title = *req.Title
	}
	if req.Description != nil {
		product.Description = *req.Description
	}
	if req.Category != nil {
		product.Category = *req.Category
	}
	if req.Size != nil {
		product.Size = *req.Size
	}
	if req.Brand != nil {
		product.Brand = *req.Brand
	}
	if req.Condition != nil {
		product.Condition = *req.Condition
	}
	if req.Price != nil {
		product.Price = *req.Price
	}

	// Save to database
	if err := database.DB.Save(&product).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update product",
		})
	}

	return c.JSON(toProductResponse(&product))
}

// DeleteProduct deletes a product
func DeleteProduct(c *fiber.Ctx) error {
	// Get user from context
	claims := c.Locals("user").(*utils.JWTClaims)

	// Get product ID from URL
	id := c.Params("id")
	productID, err := uuid.Parse(id)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid product ID",
		})
	}

	// Find product
	var product models.Product
	if err := database.DB.First(&product, "id = ?", productID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Product not found",
		})
	}

	// Verify ownership
	if product.UserID != claims.UserID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "You don't have permission to delete this product",
		})
	}

	// Delete product (soft delete)
	if err := database.DB.Delete(&product).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete product",
		})
	}

	return c.SendStatus(fiber.StatusNoContent)
}

// Helper function to convert Product model to ProductResponse
func toProductResponse(product *models.Product) *types.ProductResponse {
	return &types.ProductResponse{
		ID:          product.ID.String(),
		UserID:      product.UserID.String(),
		Title:       product.Title,
		Description: product.Description,
		Category:    product.Category,
		Size:        product.Size,
		Brand:       product.Brand,
		Condition:   product.Condition,
		Price:       product.Price,
		IsAvailable: product.IsAvailable,
		Images:      product.Images,
		CreatedAt:   product.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		UpdatedAt:   product.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
	}
}
