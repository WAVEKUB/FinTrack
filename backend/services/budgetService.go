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
	if err != nil {
		return nil, err
	}
	for i := range budgets {
		if err := attachBudgetSpending(&budgets[i]); err != nil {
			return nil, err
		}
	}
	return budgets, err
}

func GetBudgetByID(id string, userID uint) (*models.Budget, error) {
	var budget models.Budget
	err := initializers.DB.Preload("Category").Preload("Wallet").Where("id = ? AND user_id = ?", id, userID).First(&budget).Error
	if err != nil {
		return &budget, err
	}
	err = attachBudgetSpending(&budget)
	return &budget, err
}

func attachBudgetSpending(budget *models.Budget) error {
	var spent float64
	query := initializers.DB.Model(&models.Transaction{}).
		Where("user_id = ? AND category_id = ? AND UPPER(type) = ? AND date >= ? AND date < ?",
			budget.UserID,
			budget.CategoryID,
			"EXPENSE",
			budget.StartDate,
			budget.EndDate.AddDate(0, 0, 1),
		)
	if budget.WalletID != nil {
		query = query.Where("wallet_id = ?", *budget.WalletID)
	}
	if err := query.Select("COALESCE(SUM(amount), 0)").Scan(&spent).Error; err != nil {
		return err
	}

	budget.SpentAmount = spent
	budget.RemainingAmount = budget.Amount - spent
	if budget.Amount > 0 {
		budget.Progress = (spent / budget.Amount) * 100
	}
	return nil
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
