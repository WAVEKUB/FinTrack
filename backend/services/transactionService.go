package services

import (
	"errors"

	"github.com/WAVEKUB/fintrack-backend/initializers"
	"github.com/WAVEKUB/fintrack-backend/models"
)

// create transaction
func CreateTransaction(transaction *models.Transaction) error {
	result := initializers.DB.Create(&transaction)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

// Read All Transactions By User ID
func GetTransactionsByUserId(userId uint) ([]models.Transaction, error) {
	var transactions []models.Transaction
	result := initializers.DB.Where("user_id = ?", userId).Order("date desc").Find(&transactions)
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
