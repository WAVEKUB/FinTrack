package services

import (
	"errors"
	"github.com/WAVEKUB/fintrack-backend/models"
	"github.com/WAVEKUB/fintrack-backend/initializers"
)


// create wallet
func CreateWallet(wallet *models.Wallet) error {
	return initializers.DB.Create(wallet).Error
}

// Get All Wallets
func GetAllWalletsByUserID(userID uint) (*[]models.Wallet, error) {
	var wallets []models.Wallet
	if err := initializers.DB.Where("user_id = ?", userID).Find(&wallets).Error; err != nil {
		return nil, err
	}
	return &wallets, nil
}

// Get Wallet By ID
func GetWalletByID(id string, userID uint) (*models.Wallet, error) {
	var wallet models.Wallet
	if err := initializers.DB.Where("id = ? AND user_id = ?", id, userID).First(&wallet).Error; err != nil {
		return nil, errors.New("wallet not found or access denied.")
	}
	return &wallet, nil
}

// Update Wallet
func UpdateWallet(id string, userID uint, updateData models.Wallet) (*models.Wallet, error) {
	var wallet models.Wallet
	if err := initializers.DB.Where("id = ? AND user_id = ?", id, userID).First(&wallet).Error; err != nil {
		return nil, errors.New("wallet not found or access denied.")
	}
	
	initializers.DB.Model(&wallet).Updates(updateData)
	
	return &wallet, nil
}

// Delete Wallet
func DeleteWallet(id string, userID uint) error {
	var wallet models.Wallet
	if err := initializers.DB.Where("id = ? AND user_id = ?", id, userID).First(&wallet).Error; err != nil {
		return errors.New("wallet not found or access denied.")
	}
	
	initializers.DB.Delete(&wallet)
	
	return nil
}
