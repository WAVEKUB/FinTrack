package controllers

import (
	"net/http"

	"github.com/WAVEKUB/fintrack-backend/dto"
	"github.com/WAVEKUB/fintrack-backend/models"
	"github.com/WAVEKUB/fintrack-backend/services"
	"github.com/gin-gonic/gin"
)

// POST /wallets
func CreateWallet(c *gin.Context) {
	var wallet models.Wallet
	if err := c.ShouldBindJSON(&wallet); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := getUserID(c)
	wallet.UserID = userID

	if err := services.CreateWallet(&wallet); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create wallet"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"data": dto.ToWalletDTO(wallet)})
}

// GET /wallets
func GetWallets(c *gin.Context) {
	userID, _ := getUserID(c)
	
	wallets, err := services.GetAllWalletsByUserID(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch wallets"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": dto.ToWalletDTOs(*wallets)})
}

// GET /wallets/:id
func GetWalletByID(c *gin.Context) {
	userID, _ := getUserID(c)
	id := c.Param("id")

	wallet, err := services.GetWalletByID(id, userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": dto.ToWalletDTO(*wallet)})
}

// PUT /wallets/:id
func UpdateWallet(c *gin.Context) {
	userID, _ := getUserID(c)
	id := c.Param("id")
	
	var updateData models.Wallet
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedWallet, err := services.UpdateWallet(id, userID, updateData)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": dto.ToWalletDTO(*updatedWallet)})
}

// DELETE /wallets/:id
func DeleteWallet(c *gin.Context) {
	userID, _ := getUserID(c)
	id := c.Param("id")

	if err := services.DeleteWallet(id, userID); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Wallet deleted successfully"})
}