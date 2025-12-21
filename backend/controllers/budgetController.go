package controllers

import (
	"net/http"

	"github.com/WAVEKUB/fintrack-backend/models"
	"github.com/WAVEKUB/fintrack-backend/services"
	"github.com/gin-gonic/gin"
)

func CreateBudget(c *gin.Context) {
	var budget models.Budget
	if err := c.ShouldBindJSON(&budget); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := user.(models.User).ID
	budget.UserID = userID

	if err := services.CreateBudget(&budget); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, budget)
}

func GetBudgets(c *gin.Context) {
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := user.(models.User).ID

	budgets, err := services.GetBudgets(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch budgets"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": budgets})
}

func UpdateBudget(c *gin.Context) {
	id := c.Param("id")
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := user.(models.User).ID

	// First check if budget exists and belongs to user
	existingBudget, err := services.GetBudgetByID(id, userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Budget not found"})
		return
	}

	var updateData models.Budget
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update fields
	existingBudget.Name = updateData.Name
	existingBudget.Amount = updateData.Amount
	existingBudget.Period = updateData.Period
	existingBudget.StartDate = updateData.StartDate
	existingBudget.EndDate = updateData.EndDate
	existingBudget.CategoryID = updateData.CategoryID
	existingBudget.WalletID = updateData.WalletID

	if err := services.UpdateBudget(existingBudget); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, existingBudget)
}

func DeleteBudget(c *gin.Context) {
	id := c.Param("id")
	user, exists := c.Get("user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userID := user.(models.User).ID

	if err := services.DeleteBudget(id, userID); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Budget deleted successfully"})
}
