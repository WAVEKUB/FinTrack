package main

import (
	"github.com/WAVEKUB/fintrack-backend/controllers"
	"github.com/WAVEKUB/fintrack-backend/initializers"
	"github.com/WAVEKUB/fintrack-backend/middleware"
	"github.com/WAVEKUB/fintrack-backend/models"
	"github.com/WAVEKUB/fintrack-backend/services"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
}

func main() {
	// Auto Migrate
	initializers.DB.AutoMigrate(
		&models.User{},
		&models.Wallet{},
		&models.Transaction{},
		&models.Category{},
	)

	// Init Services and Controllers
	userService := services.NewUserService(initializers.DB)
	usersController := controllers.NewUsersController(userService)

	r := gin.Default()

	// Public Routes
	r.POST("/api/v1/signup", usersController.SignUp) // Sign up
	r.POST("/api/v1/login", usersController.Login)   // Login

	// Protected Routes
	authorized := r.Group("/")
	authorized.Use(middleware.RequireAuth)
	{
		authorized.GET("/api/v1/validate", usersController.Validate)    // Validate
		authorized.PUT("/api/v1/update", usersController.UpdateUser)    // Update user
		authorized.DELETE("/api/v1/delete", usersController.DeleteUser) // Delete user
	}

	r.Run(":8080")

}
