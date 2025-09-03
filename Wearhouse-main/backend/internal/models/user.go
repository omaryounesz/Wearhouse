package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type User struct {
	ID                uuid.UUID `gorm:"type:uuid;primary_key;default:uuid_generate_v4()"`
	Email             string    `gorm:"type:varchar(255);unique;not null"`
	Password          string    `gorm:"type:varchar(255);not null"`
	FirstName         string    `gorm:"type:varchar(100);not null"`
	LastName          string    `gorm:"type:varchar(100);not null"`
	University        string    `gorm:"type:varchar(255);not null"`
	IsVerified        bool      `gorm:"default:false"`
	VerificationToken string    `gorm:"type:varchar(255);unique"`
	TokenExpiresAt    time.Time
	CreatedAt         time.Time
	UpdatedAt         time.Time
	DeletedAt         gorm.DeletedAt `gorm:"index"`
}
