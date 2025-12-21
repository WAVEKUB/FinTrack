package models

import (
	"time"

	"gorm.io/gorm"
)

type Budget struct {
	gorm.Model
	Name      string    `json:"name"`
	Amount    float64   `json:"amount" gorm:"not null"`
	Period    string    `json:"period" gorm:"not null"` // "MONTHLY", "WEEKLY", "ONE_TIME"
	StartDate time.Time `json:"start_date" gorm:"not null"`
	EndDate   time.Time `json:"end_date" gorm:"not null"`

	// Foreign Keys
	UserID     uint `json:"user_id" gorm:"not null"`
	CategoryID uint `json:"category_id" gorm:"not null"`
	WalletID   *uint `json:"wallet_id"` // Optional, if budget is specific to a wallet

	// Relationships
	User     User     `json:"user"`
	Category Category `json:"category"`
	Wallet   Wallet   `json:"wallet"`
}
