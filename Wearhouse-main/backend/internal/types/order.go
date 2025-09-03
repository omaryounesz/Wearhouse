package types

import (
	"time"

	"github.com/google/uuid"
)

// CreateOrderRequest represents the request to create a new order
type CreateOrderRequest struct {
	ShippingAddr  string `json:"shipping_addr" validate:"required"`
	BillingAddr   string `json:"billing_addr" validate:"required"`
	PaymentMethod string `json:"payment_method" validate:"required,oneof=credit_card paypal"`
}

// OrderItemResponse represents a single item in an order response
type OrderItemResponse struct {
	ID        uuid.UUID       `json:"id"`
	ProductID uuid.UUID       `json:"product_id"`
	Product   ProductResponse `json:"product"`
	Quantity  int             `json:"quantity"`
	Price     float64         `json:"price"`
	CreatedAt time.Time       `json:"created_at"`
	UpdatedAt time.Time       `json:"updated_at"`
}

// OrderResponse represents the response for order operations
type OrderResponse struct {
	ID            uuid.UUID           `json:"id"`
	UserID        uuid.UUID           `json:"user_id"`
	Items         []OrderItemResponse `json:"items"`
	Status        string              `json:"status"`
	Total         float64             `json:"total"`
	ShippingAddr  string              `json:"shipping_addr"`
	BillingAddr   string              `json:"billing_addr"`
	PaymentMethod string              `json:"payment_method"`
	CreatedAt     time.Time           `json:"created_at"`
	UpdatedAt     time.Time           `json:"updated_at"`
}

// UpdateOrderStatusRequest represents the request to update an order's status
type UpdateOrderStatusRequest struct {
	Status string `json:"status" validate:"required,oneof=pending paid shipped delivered cancelled"`
}
