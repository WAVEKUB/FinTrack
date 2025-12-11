package routes

import (
	"github.com/WAVEKUB/fintrack-backend/controllers"
	"github.com/WAVEKUB/fintrack-backend/initializers"
	"github.com/WAVEKUB/fintrack-backend/services"
	"github.com/gin-gonic/gin"
)

func AuthRoutes(router *gin.Engine) {

	userService := services.NewUserService(initializers.DB)
	usersController := controllers.NewUsersController(userService)

	authRoutes := router.Group("/auth")
	{
		// Sign Up
		authRoutes.POST("/signup", usersController.SignUp)
		// Sign In
		authRoutes.POST("/signin", usersController.Login)
		// Validate
		authRoutes.POST("/validate", usersController.Validate)
	}
}
