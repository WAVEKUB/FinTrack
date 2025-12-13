package routes

import (
	"github.com/WAVEKUB/fintrack-backend/controllers"
	"github.com/WAVEKUB/fintrack-backend/middleware"
	"github.com/gin-gonic/gin"
)

func TransactionRoutes(router *gin.RouterGroup) {

	// Create Group that require authentication
	transaction := router.Group("/transactions")
	transaction.Use(middleware.RequireAuth)
	{
		// Create Transaction
		transaction.POST("/create", controllers.CreateTransaction)
		// Get Transactions
		transaction.GET("", controllers.GetTransactions)
		// Get Transaction By ID
		transaction.GET("/:id", controllers.GetTransactionById)
		// Update Transaction
		transaction.PUT("/:id", controllers.UpdateTransaction)
		// Delete Transaction
		transaction.DELETE("/:id", controllers.DeleteTransaction)
	}
}
