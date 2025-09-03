package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Cart represents a user's shopping cart
type Cart struct {
	ID        uuid.UUID      `gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	UserID    uuid.UUID      `gorm:"type:uuid;not null"`
	Items     []CartItem     `gorm:"foreignKey:CartID"`
	CreatedAt time.Time      `gorm:"not null;default:CURRENT_TIMESTAMP"`
	UpdatedAt time.Time      `gorm:"not null;default:CURRENT_TIMESTAMP"`
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

// CartItem represents an item in a user's cart
type CartItem struct {
	ID        uuid.UUID      `gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	CartID    uuid.UUID      `gorm:"type:uuid;not null"`
	Cart      Cart           `gorm:"foreignKey:CartID"`
	ProductID uuid.UUID      `gorm:"type:uuid;not null"`
	Product   Product        `gorm:"foreignKey:ProductID"`
	Quantity  int            `gorm:"not null;default:1"`
	CreatedAt time.Time      `gorm:"not null;default:CURRENT_TIMESTAMP"`
	UpdatedAt time.Time      `gorm:"not null;default:CURRENT_TIMESTAMP"`
	DeletedAt gorm.DeletedAt `gorm:"index"`
}

// BeforeCreate is called before creating a new cart
func (c *Cart) BeforeCreate(tx *gorm.DB) error {
	if c.ID == uuid.Nil {
		c.ID = uuid.New()
	}
	return nil
}

// BeforeCreate is called before creating a new cart item
func (ci *CartItem) BeforeCreate(tx *gorm.DB) error {
	if ci.ID == uuid.Nil {
		ci.ID = uuid.New()
	}
	return nil
}
