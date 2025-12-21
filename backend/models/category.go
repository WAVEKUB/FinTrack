package models

import "gorm.io/gorm"

type Category struct {
	gorm.Model
	Name  string `gorm:"not null;uniqueIndex:idx_name_user" json:"name"`
	Type  string `gorm:"not null" json:"type"` // "INCOME", "EXPENSE"
	Icon  string `json:"icon"`
	Color string `json:"color"`

	// if UserID is null, it is a global category
	UserID *uint `gorm:"uniqueIndex:idx_name_user" json:"user_id"`
}
