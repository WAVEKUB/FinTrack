package services

import (
	"errors"

	"github.com/WAVEKUB/fintrack-backend/initializers"
	"github.com/WAVEKUB/fintrack-backend/models"
)

func CreateCategory(category *models.Category) error {
	if category.Name == "" {
		return errors.New("name is required")
	}
	if category.Type != "INCOME" && category.Type != "EXPENSE" {
		return errors.New("invalid category type")
	}

	// Explicit check for duplicates (since unique index might fail on migration with dirty data)
	var count int64
	initializers.DB.Model(&models.Category{}).Where("name = ? AND user_id = ?", category.Name, category.UserID).Count(&count)
	if count > 0 {
		return errors.New("category name already exists")
	}
	return initializers.DB.Create(category).Error
}

func GetCategories(userID uint) ([]models.Category, error) {
	var categories []models.Category
	// Fetch categories that belong to the user OR are global (UserID is null)
	err := initializers.DB.Where("user_id = ? OR user_id IS NULL", userID).Find(&categories).Error
	return categories, err
}

func UpdateCategory(category *models.Category) error {
	if category.Name == "" {
		return errors.New("name is required")
	}
	// We usually don't allow changing Type of a category to avoid invalidating transactions, but keeping it simple for now
	return initializers.DB.Save(category).Error
}

func GetCategoryByID(id string, userID uint) (*models.Category, error) {
	var category models.Category
	// Only allow user to modify their own categories, so strict check here?
	// Or should we allow getting global categories too? For updates/deletes, strict check. for reading, maybe loose.
	// This helper is mostly for update/delete/get-one specific.
	// Let's assume strict ownership for update/delete.
	err := initializers.DB.Where("id = ? AND user_id = ?", id, userID).First(&category).Error
	return &category, err
}

func DeleteCategory(id string, userID uint) error {
	result := initializers.DB.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Category{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("category not found or not authorized")
	}
	return nil
}
