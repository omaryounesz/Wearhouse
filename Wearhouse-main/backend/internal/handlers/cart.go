package handlers

import (
	"log"
	"wearhouse/internal/database"
	"wearhouse/internal/models"
	"wearhouse/internal/types"
	"wearhouse/internal/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// GetCart retrieves the user's cart
func GetCart(c *fiber.Ctx) error {
	// Get user from context
	claims := c.Locals("user").(*utils.JWTClaims)

	// Get or create cart
	var cart models.Cart
	err := database.DB.Preload("Items.Product").FirstOrCreate(&cart, models.Cart{
		UserID: claims.UserID,
	}).Error
	if err != nil {
		log.Printf("Error getting cart: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get cart",
		})
	}

	// Calculate total
	var total float64
	for _, item := range cart.Items {
		total += item.Product.Price * float64(item.Quantity)
	}

	// Convert to response
	response := types.CartResponse{
		ID:        cart.ID,
		UserID:    cart.UserID,
		Items:     make([]types.CartItemResponse, len(cart.Items)),
		Total:     total,
		CreatedAt: cart.CreatedAt,
		UpdatedAt: cart.UpdatedAt,
	}

	for i, item := range cart.Items {
		response.Items[i] = types.CartItemResponse{
			ID:        item.ID,
			ProductID: item.ProductID,
			Product:   *toProductResponse(&item.Product),
			Quantity:  item.Quantity,
			CreatedAt: item.CreatedAt,
			UpdatedAt: item.UpdatedAt,
		}
	}

	return c.JSON(response)
}

// AddToCart adds a product to the cart
func AddToCart(c *fiber.Ctx) error {
	// Get user from context
	claims := c.Locals("user").(*utils.JWTClaims)

	// Parse request
	var req types.AddToCartRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validate product exists
	var product models.Product
	if err := database.DB.First(&product, "id = ?", req.ProductID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Product not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get product",
		})
	}

	// Check if product is available
	if !product.IsAvailable {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Product is not available",
		})
	}

	// Get or create cart
	var cart models.Cart
	err := database.DB.FirstOrCreate(&cart, models.Cart{
		UserID: claims.UserID,
	}).Error
	if err != nil {
		log.Printf("Error getting/creating cart: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get cart",
		})
	}

	// Check if item already exists in cart
	var cartItem models.CartItem
	err = database.DB.Where("cart_id = ? AND product_id = ?", cart.ID, req.ProductID).First(&cartItem).Error
	if err == nil {
		// Update quantity
		cartItem.Quantity += req.Quantity
		if err := database.DB.Save(&cartItem).Error; err != nil {
			log.Printf("Error updating cart item: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to update cart item",
			})
		}
	} else if err == gorm.ErrRecordNotFound {
		// Create new cart item
		cartItem = models.CartItem{
			CartID:    cart.ID,
			ProductID: req.ProductID,
			Quantity:  req.Quantity,
		}
		if err := database.DB.Create(&cartItem).Error; err != nil {
			log.Printf("Error creating cart item: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to create cart item",
			})
		}
	} else {
		log.Printf("Error checking cart item: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to check cart item",
		})
	}

	return GetCart(c)
}

// UpdateCartItem updates the quantity of an item in the cart
func UpdateCartItem(c *fiber.Ctx) error {
	// Get user from context
	claims := c.Locals("user").(*utils.JWTClaims)

	// Get item ID from URL
	itemID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid item ID",
		})
	}

	// Parse request
	var req types.UpdateCartItemRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Get cart item
	var cartItem models.CartItem
	err = database.DB.Joins("Cart").First(&cartItem, "cart_items.id = ?", itemID).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Cart item not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get cart item",
		})
	}

	// Check ownership
	if cartItem.Cart.UserID != claims.UserID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "You don't have permission to update this cart item",
		})
	}

	// Update or delete based on quantity
	if req.Quantity > 0 {
		cartItem.Quantity = req.Quantity
		if err := database.DB.Save(&cartItem).Error; err != nil {
			log.Printf("Error updating cart item: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to update cart item",
			})
		}
	} else {
		if err := database.DB.Delete(&cartItem).Error; err != nil {
			log.Printf("Error deleting cart item: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to delete cart item",
			})
		}
	}

	return GetCart(c)
}

// RemoveFromCart removes an item from the cart
func RemoveFromCart(c *fiber.Ctx) error {
	// Get user from context
	claims := c.Locals("user").(*utils.JWTClaims)

	// Get item ID from URL
	itemID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid item ID",
		})
	}

	// Get cart item
	var cartItem models.CartItem
	err = database.DB.Joins("Cart").First(&cartItem, "cart_items.id = ?", itemID).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Cart item not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get cart item",
		})
	}

	// Check ownership
	if cartItem.Cart.UserID != claims.UserID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "You don't have permission to remove this cart item",
		})
	}

	// Delete cart item
	if err := database.DB.Delete(&cartItem).Error; err != nil {
		log.Printf("Error deleting cart item: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete cart item",
		})
	}

	return GetCart(c)
}

// ClearCart removes all items from the cart
func ClearCart(c *fiber.Ctx) error {
	// Get user from context
	claims := c.Locals("user").(*utils.JWTClaims)

	// Get cart
	var cart models.Cart
	err := database.DB.Where("user_id = ?", claims.UserID).First(&cart).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Cart not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to get cart",
		})
	}

	// Delete all cart items
	if err := database.DB.Where("cart_id = ?", cart.ID).Delete(&models.CartItem{}).Error; err != nil {
		log.Printf("Error clearing cart: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to clear cart",
		})
	}

	return GetCart(c)
}
