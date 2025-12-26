package services

import (
	"errors"

	"time"
	"github.com/WAVEKUB/fintrack-backend/initializers"
	"github.com/WAVEKUB/fintrack-backend/models"
	"gorm.io/gorm"
)

// Dashboard Structure
type DashboardSummary struct {
	TotalBalance float64 `json:"total_balance"`
	Income       float64 `json:"income"`
	Expense      float64 `json:"expense"`
}

// Get Dashboard Summary
func GetDashboardSummary(userID uint) (DashboardSummary, error) {
	var summary DashboardSummary

	// find total balance in every wallet using COALESCE to handle NULL values
	if err := initializers.DB.Model(&models.Wallet{}).
		Where("user_id = ?", userID).
		Select("COALESCE(SUM(balance), 0)").
		Scan(&summary.TotalBalance).Error; err != nil {
		return summary, err
	}

	// calculate Income and Expense
	now := time.Now()
	// find first day of month (e.g. 1 Oct 2023 00:00:00)
	startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

	// query group by type to find total income and expense
	type Result struct {
		Type  string
		Total float64
	}
	var results []Result

	if err := initializers.DB.Model(&models.Transaction{}).
		Select("type, COALESCE(SUM(amount), 0) as total").
		Where("user_id = ? AND date >= ?", userID, startOfMonth).
		Group("type").
		Scan(&results).Error; err != nil {
		return summary, err
	}

	// separate Income and Expense into Struct
	for _, r := range results {
		if r.Type == "INCOME" {
			summary.Income = r.Total
		} else if r.Type == "EXPENSE" {
			summary.Expense = r.Total
		}
	}

	return summary, nil
}

// create transaction
func CreateTransaction(userID uint, transaction *models.Transaction) error {
	return initializers.DB.Transaction(func(tx *gorm.DB) error {
		// Ensure user ID is set
		transaction.UserID = userID

		// 1. Create Transaction
		if err := tx.Create(&transaction).Error; err != nil {
			return err
		}

		// 2. Update Wallet Balance
		// Get Wallet
		var wallet models.Wallet
		if err := tx.First(&wallet, transaction.WalletID).Error; err != nil {
			return err
		}

		// Check ownership
		if wallet.UserID != userID {
			return errors.New("wallet does not belong to user")
		}

		// Calculate new balance
		if transaction.Type == "INCOME" {
			wallet.Balance += transaction.Amount
		} else if transaction.Type == "EXPENSE" {
			wallet.Balance -= transaction.Amount
		} else {
             // Handle other types if needed (e.g. TRANSFER)
             // For now we only handle simple INCOME/EXPENSE based on current logic context
        }

		// Save Wallet
		if err := tx.Save(&wallet).Error; err != nil {
			return err
		}

		return nil
	})
}

// Read All Transactions By User ID
func GetTransactionsByUserId(userId uint) ([]models.Transaction, error) {
	var transactions []models.Transaction
	result := initializers.DB.Preload("Category").Where("user_id = ?", userId).Order("date desc").Find(&transactions)
	return transactions, result.Error
}

// Read Single Transaction By ID
func GetTransactionById(id string, userId uint) (*models.Transaction, error) {
	var transaction models.Transaction
	result := initializers.DB.Where("id = ? AND user_id = ?", id, userId).First(&transaction)
	if result.Error != nil {
		return nil, errors.New("transaction not found or access denied")
	}
	return &transaction, nil
}

// Read All Transactions By Category
func GetTransactionsByCategory(categoryId string, userId uint) ([]models.Transaction, error) {
	var transactions []models.Transaction
	result := initializers.DB.Where("category_id = ? AND user_id = ?", categoryId, userId).Order("date desc").Find(&transactions)
	return transactions, result.Error
}

// Read All Transactions By Wallet ID
func GetTransactionsByWalletId(walletId string, userId uint) ([]models.Transaction, error) {
	var transactions []models.Transaction
	result := initializers.DB.Where("wallet_id = ? AND user_id = ?", walletId, userId).Order("date desc").Find(&transactions)
	return transactions, result.Error
}

// Update Transaction
func UpdateTransaction(id string, userId uint, updateData models.Transaction) (*models.Transaction, error) {
	var transaction models.Transaction
	result := initializers.DB.Where("id = ? AND user_id = ?", id, userId).First(&transaction)
	if result.Error != nil {
		return nil, errors.New("transaction not found or access denied")
	}

	initializers.DB.Model(&transaction).Updates(updateData)
	return &transaction, nil
}

// Delete Transaction
func DeleteTransaction(id string, userId uint) error {
	result := initializers.DB.Where("id = ? AND user_id = ?", id, userId).Delete(&models.Transaction{})
	if result.RowsAffected == 0 {
		return errors.New("transaction not found or access denied")
	}
	return nil
}

// Delete Old Transactions
func DeleteOldTransactions(userId uint, retentionPeriod time.Duration) error {
	cutoff := time.Now().Add(-retentionPeriod)
	// Hard delete transactions older than cutoff
	result := initializers.DB.Unscoped().Where("user_id = ? AND date < ?", userId, cutoff).Delete(&models.Transaction{})
	return result.Error
}
