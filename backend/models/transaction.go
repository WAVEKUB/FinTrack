package models

import (
	"time"

	"gorm.io/gorm"
)

type Transaction struct {
	gorm.Model
	Amount float64   `json:"amount"`
	Type   string    `json:"type"`
	Date   time.Time `json:"date"`
	Note   string    `json:"note"`

	// Foreign Key
	UserID     uint `json:"user_id"`
	WalletID   uint `json:"wallet_id"`
	CategoryID uint `json:"category_id"`

	// Relation - preload for JSON response
	Category Category `gorm:"foreignKey:CategoryID" json:"category"`

	// Transfer
	TargetWalletID uint `json:"target_wallet_id"`
}
