package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Email    string `gorm:"uniqueIndex; not null" json:"email"`
	Password string `form:"not null" json:"-"`
	Name     string `json:"name"`
	Avatar   string `json:"avatar"`

	// 1 to Many

	Wallets      []Wallet      `json:"wallets"`
	Transactions []Transaction `json:"transactions"`
}
