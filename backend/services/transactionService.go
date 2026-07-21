package services

import (
	"errors"
	"strings"
	"time"

	"github.com/WAVEKUB/fintrack-backend/initializers"
	"github.com/WAVEKUB/fintrack-backend/models"
	"gorm.io/gorm"
)

const (
	transactionTypeIncome  = "INCOME"
	transactionTypeExpense = "EXPENSE"
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
		if strings.EqualFold(r.Type, transactionTypeIncome) {
			summary.Income = r.Total
		} else if strings.EqualFold(r.Type, transactionTypeExpense) {
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
		transaction.Type = normalizeTransactionType(transaction.Type)

		var wallet models.Wallet
		if err := tx.Where("id = ? AND user_id = ?", transaction.WalletID, userID).First(&wallet).Error; err != nil {
			return err
		}

		if err := tx.Create(&transaction).Error; err != nil {
			return err
		}

		return adjustWalletBalance(tx, transaction.WalletID, userID, transactionBalanceImpact(*transaction))
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

	err := initializers.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("id = ? AND user_id = ?", id, userId).First(&transaction).Error; err != nil {
			return errors.New("transaction not found or access denied")
		}

		original := transaction

		if updateData.Amount != 0 {
			transaction.Amount = updateData.Amount
		}
		if updateData.Type != "" {
			transaction.Type = normalizeTransactionType(updateData.Type)
		}
		if !updateData.Date.IsZero() {
			transaction.Date = updateData.Date
		}
		transaction.Note = updateData.Note
		if updateData.WalletID != 0 {
			transaction.WalletID = updateData.WalletID
		}
		if updateData.CategoryID != 0 {
			transaction.CategoryID = updateData.CategoryID
		}
		transaction.TargetWalletID = updateData.TargetWalletID

		var wallet models.Wallet
		if err := tx.Where("id = ? AND user_id = ?", transaction.WalletID, userId).First(&wallet).Error; err != nil {
			return errors.New("wallet not found or access denied")
		}

		if original.WalletID == transaction.WalletID {
			delta := transactionBalanceImpact(transaction) - transactionBalanceImpact(original)
			if err := adjustWalletBalance(tx, transaction.WalletID, userId, delta); err != nil {
				return err
			}
		} else {
			if err := adjustWalletBalance(tx, original.WalletID, userId, -transactionBalanceImpact(original)); err != nil {
				return err
			}
			if err := adjustWalletBalance(tx, transaction.WalletID, userId, transactionBalanceImpact(transaction)); err != nil {
				return err
			}
		}

		if err := tx.Save(&transaction).Error; err != nil {
			return err
		}

		return tx.Preload("Category").First(&transaction, transaction.ID).Error
	})
	if err != nil {
		return nil, err
	}
	return &transaction, nil
}

func normalizeTransactionType(transactionType string) string {
	return strings.ToUpper(strings.TrimSpace(transactionType))
}

func transactionBalanceImpact(transaction models.Transaction) float64 {
	switch normalizeTransactionType(transaction.Type) {
	case transactionTypeIncome:
		return transaction.Amount
	case transactionTypeExpense:
		return -transaction.Amount
	default:
		return 0
	}
}

func adjustWalletBalance(tx *gorm.DB, walletID uint, userID uint, delta float64) error {
	if delta == 0 {
		return nil
	}

	result := tx.Model(&models.Wallet{}).
		Where("id = ? AND user_id = ?", walletID, userID).
		Update("balance", gorm.Expr("balance + ?", delta))
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("wallet not found or access denied")
	}
	return nil
}

// Delete Transaction
func DeleteTransaction(id string, userId uint) error {
	return initializers.DB.Transaction(func(tx *gorm.DB) error {
		var transaction models.Transaction
		if err := tx.Where("id = ? AND user_id = ?", id, userId).First(&transaction).Error; err != nil {
			return errors.New("transaction not found or access denied")
		}
		if err := adjustWalletBalance(tx, transaction.WalletID, userId, -transactionBalanceImpact(transaction)); err != nil {
			return err
		}
		return tx.Delete(&transaction).Error
	})
}

// Delete Old Transactions
func DeleteOldTransactions(userId uint, retentionPeriod time.Duration) error {
	cutoff := time.Now().Add(-retentionPeriod)
	// Hard delete transactions older than cutoff
	result := initializers.DB.Unscoped().Where("user_id = ? AND date < ?", userId, cutoff).Delete(&models.Transaction{})
	return result.Error
}
