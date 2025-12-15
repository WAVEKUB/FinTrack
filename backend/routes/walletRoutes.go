package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/WAVEKUB/fintrack-backend/controllers"
	"github.com/WAVEKUB/fintrack-backend/middleware"
)

func WalletRoutes(r *gin.RouterGroup) {
	walletGroup := r.Group("/wallets")
	walletGroup.Use(middleware.RequireAuth)
	{
		// Create Wallet
		walletGroup.POST("", controllers.CreateWallet)
		// Get Wallets
		walletGroup.GET("", controllers.GetWallets)
		// Get Wallet By ID
		walletGroup.GET("/:id", controllers.GetWalletByID)
		// Update Wallet
		walletGroup.PUT("/:id", controllers.UpdateWallet)
		// Delete Wallet
		walletGroup.DELETE("/:id", controllers.DeleteWallet)
	}
}