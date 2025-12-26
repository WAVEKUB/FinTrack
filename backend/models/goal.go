package models

import (
	"time"

	"gorm.io/gorm"
)

type Goal struct {
	gorm.Model
	Name          string     `json:"name" gorm:"not null"`
	TargetAmount  float64    `json:"target_amount" gorm:"not null"`
	CurrentAmount float64    `json:"current_amount" gorm:"default:0"`
	Deadline      *time.Time `json:"deadline"`
	Notes         string     `json:"notes"`

	// Foreign Key
	UserID uint `json:"user_id" gorm:"not null"`

	// Relationships
	User User `json:"user" gorm:"foreignKey:UserID"`
}
