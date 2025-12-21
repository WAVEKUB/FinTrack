package initializers

import "github.com/WAVEKUB/fintrack-backend/models"

func SyncDatabase() {
	// Auto Migrate
	DB.AutoMigrate(
		&models.User{},
		&models.Wallet{},
		&models.Transaction{},
		&models.Category{},
		&models.Budget{},
	)
}
