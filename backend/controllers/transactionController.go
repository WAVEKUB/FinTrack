package controllers

import (
	"net/http"
	"time"
	"github.com/WAVEKUB/fintrack-backend/models"
	"github.com/WAVEKUB/fintrack-backend/services"
	"github.com/gin-gonic/gin"
)

// Helper Function: get UserID from context
func getUserID(c *gin.Context) (uint, error) {
	user, exists := c.Get("user")
	if !exists {
		return 0, http.ErrNoCookie
	}
	return user.(models.User).ID, nil
}

// Create Transaction
func CreateTransaction(c *gin.Context) {
	var transaction models.Transaction
	if err := c.ShouldBindJSON(&transaction); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := getUserID(c)
	transaction.UserID = userID

	if err := services.CreateTransaction(userID, &transaction); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create transaction"})
		return
	}

	// return success
	c.JSON(http.StatusCreated, transaction)
}

// Get Transactions
func GetTransactions(c *gin.Context) {
	userID, _ := getUserID(c)
	transactions, err := services.GetTransactionsByUserId(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get transactions"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": transactions})
}

// Get Transaction By ID
func GetTransactionById(c *gin.Context) {
	userID, _ := getUserID(c)
	id := c.Param("id")
	transaction, err := services.GetTransactionById(id, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, transaction)
}

// Update Transaction By ID
func UpdateTransaction(c *gin.Context) {
	userID, _ := getUserID(c)
	id := c.Param("id")
	var updateData models.Transaction
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedTransaction, err := services.UpdateTransaction(id, userID, updateData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, updatedTransaction)

}

// Delete Transaction By ID
func DeleteTransaction(c *gin.Context) {
	userID, _ := getUserID(c)
	id := c.Param("id")
	if err := services.DeleteTransaction(id, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Transaction deleted successfully"})
}

// GET Dashboard Summary
func GetSummary(c *gin.Context) {
	userID, _ := getUserID(c)
	summary, err := services.GetDashboardSummary(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to calculate summary"})
		return
	}

	c.JSON(http.StatusOK, summary)
}

// Delete Old Transactions
func DeleteOldTransactions(c *gin.Context) {
	userID, _ := getUserID(c)
	retentionPeriod := 12 * 30 * 24 * time.Hour // 12 months
	if err := services.DeleteOldTransactions(userID, retentionPeriod); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Old transactions deleted successfully"})
}
