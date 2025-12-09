package main

import (
	"github.com/WAVEKUB/fintrack-backend/controllers"
	"github.com/WAVEKUB/fintrack-backend/initializers"
	"github.com/WAVEKUB/fintrack-backend/middleware"
	"github.com/WAVEKUB/fintrack-backend/models"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
}

func main() {
	initializers.DB.AutoMigrate(
		&models.User{},
		&models.Wallet{},
		&models.Transaction{},
		&models.Category{},
	)

	r := gin.Default()

	// Public Routes
	r.POST("/api/v1/signup", controllers.SignUp) // Sign up
	r.POST("/api/v1/login", controllers.Login)   // Login

	// Protected Routes
	authorized := r.Group("/")
	authorized.Use(middleware.RequireAuth)
	{
		authorized.GET("/api/v1/validate", controllers.Validate)    // Validate
		authorized.PUT("/api/v1/update", controllers.UpdateUser)    // Update user
		authorized.DELETE("/api/v1/delete", controllers.DeleteUser) // Delete user
	}

	r.Run(":8080")

}
