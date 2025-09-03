package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type OrderStatus string

const (
	OrderStatusPending   OrderStatus = "pending"
	OrderStatusPaid      OrderStatus = "paid"
	OrderStatusShipped   OrderStatus = "shipped"
	OrderStatusDelivered OrderStatus = "delivered"
	OrderStatusCancelled OrderStatus = "cancelled"
)

// OrderItem represents a single item in an order
type OrderItem struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	OrderID   uuid.UUID `gorm:"type:uuid;not null"`
	ProductID uuid.UUID `gorm:"type:uuid;not null"`
	Product   Product   `gorm:"foreignKey:ProductID"`
	Quantity  int       `gorm:"not null"`
	Price     float64   `gorm:"not null"` // Price at time of order
	CreatedAt time.Time
	UpdatedAt time.Time
}

// Order represents a customer order
type Order struct {
	ID            uuid.UUID   `gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	UserID        uuid.UUID   `gorm:"type:uuid;not null"`
	User          User        `gorm:"foreignKey:UserID"`
	Items         []OrderItem `gorm:"foreignKey:OrderID"`
	Status        OrderStatus `gorm:"type:varchar(20);not null;default:'pending'"`
	Total         float64     `gorm:"not null"`
	ShippingAddr  string      `gorm:"type:text;not null"`
	BillingAddr   string      `gorm:"type:text;not null"`
	PaymentMethod string      `gorm:"type:varchar(50);not null"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

// BeforeCreate is called before inserting a new order
func (o *Order) BeforeCreate(tx *gorm.DB) error {
	if o.ID == uuid.Nil {
		o.ID = uuid.New()
	}
	return nil
}

// BeforeCreate is called before inserting a new order item
func (oi *OrderItem) BeforeCreate(tx *gorm.DB) error {
	if oi.ID == uuid.Nil {
		oi.ID = uuid.New()
	}
	return nil
}
