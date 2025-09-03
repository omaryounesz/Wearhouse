package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Payment struct {
	ID            uuid.UUID `gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	OrderID       uuid.UUID `gorm:"type:uuid;not null"`
	Amount        float64   `gorm:"type:decimal(10,2);not null"`
	Currency      string    `gorm:"type:varchar(3);not null"`
	Status        string    `gorm:"type:varchar(20);not null"`
	PaymentMethod string    `gorm:"type:varchar(50);not null"`
	StripeID      string    `gorm:"type:varchar(255);unique"`
	Error         string    `gorm:"type:text"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
	DeletedAt     gorm.DeletedAt `gorm:"index"`

	// Relationships
	Order Order `gorm:"foreignKey:OrderID"`
}

func (p *Payment) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
}
