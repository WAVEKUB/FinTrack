package services

import (
	"errors"

	"github.com/WAVEKUB/fintrack-backend/initializers"
	"github.com/WAVEKUB/fintrack-backend/models"
)

func ValidateBudget(budget *models.Budget) error {
	if budget.Amount <= 0 {
		return errors.New("amount must be greater than 0")
	}
	if budget.StartDate.After(budget.EndDate) {
		return errors.New("start date must be before end date")
	}
	if budget.Period != "MONTHLY" && budget.Period != "WEEKLY" && budget.Period != "ONE_TIME" {
		return errors.New("invalid period")
	}
	// Check if category exists
	var category models.Category
	if err := initializers.DB.First(&category, budget.CategoryID).Error; err != nil {
		return errors.New("category not found")
	}

	// Check if wallet exists and belongs to user (if provided)
	if budget.WalletID != nil {
		var wallet models.Wallet
		if err := initializers.DB.Where("id = ? AND user_id = ?", budget.WalletID, budget.UserID).First(&wallet).Error; err != nil {
			return errors.New("wallet not found or not authorized")
		}
	}

	return nil
}

func CreateBudget(budget *models.Budget) error {
	if err := ValidateBudget(budget); err != nil {
		return err
	}
	return initializers.DB.Create(budget).Error
}

func UpdateBudget(budget *models.Budget) error {
	if err := ValidateBudget(budget); err != nil {
		return err
	}
	return initializers.DB.Save(budget).Error
}

func GetBudgets(userID uint) ([]models.Budget, error) {
	var budgets []models.Budget
	err := initializers.DB.Preload("Category").Preload("Wallet").Where("user_id = ?", userID).Find(&budgets).Error
	return budgets, err
}

func GetBudgetByID(id string, userID uint) (*models.Budget, error) {
	var budget models.Budget
	err := initializers.DB.Preload("Category").Preload("Wallet").Where("id = ? AND user_id = ?", id, userID).First(&budget).Error
	return &budget, err
}

func DeleteBudget(id string, userID uint) error {
	result := initializers.DB.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Budget{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("budget not found")
	}
	return nil
}
