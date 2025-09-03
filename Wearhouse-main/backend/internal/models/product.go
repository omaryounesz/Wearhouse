package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

type ListingType string

const (
	Sale  ListingType = "SALE"
	Trade ListingType = "TRADE"
	Free  ListingType = "FREE"
)

type ProductCondition string

const (
	New        ProductCondition = "NEW"
	LikeNew    ProductCondition = "LIKE_NEW"
	Good       ProductCondition = "GOOD"
	Fair       ProductCondition = "FAIR"
	Acceptable ProductCondition = "ACCEPTABLE"
)

type Product struct {
	ID          uuid.UUID      `json:"id" gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	UserID      uuid.UUID      `json:"user_id" gorm:"type:uuid;not null"`
	Title       string         `json:"title" gorm:"size:255;not null"`
	Description string         `json:"description" gorm:"type:text"`
	Size        string         `json:"size" gorm:"size:10;not null"`
	Brand       string         `json:"brand" gorm:"size:100"`
	Category    string         `json:"category" gorm:"size:50;not null"`
	Condition   string         `json:"condition" gorm:"size:50;not null"`
	ListingType ListingType    `json:"listing_type" gorm:"not null"`
	Price       float64        `json:"price" gorm:"not null"`
	IsAvailable bool           `json:"is_available" gorm:"default:true"`
	Images      pq.StringArray `json:"images" gorm:"type:text[]"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
	User        User           `json:"user" gorm:"foreignkey:UserID"`
}

// BeforeCreate will set a UUID rather than numeric ID
func (product *Product) BeforeCreate(tx *gorm.DB) error {
	if product.ID == uuid.Nil {
		product.ID = uuid.New()
	}
	return nil
}
