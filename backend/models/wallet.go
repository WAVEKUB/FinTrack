package models

import "gorm.io/gorm"

type Wallet struct {
	gorm.Model
	Name    string  `gorm:"not null" json:"name"`
	Type    string  `json:"type"` // e.g., "CASH", "BANK", "CREDIT"
	Balance float64 `gorm:"default:0" json:"balance"`

	// 1 to 1
	UserID uint `json:"user_id"`
}
