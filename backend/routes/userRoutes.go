package routes

import (
	"github.com/WAVEKUB/fintrack-backend/controllers"
	"github.com/WAVEKUB/fintrack-backend/initializers"
	"github.com/WAVEKUB/fintrack-backend/middleware"
	"github.com/WAVEKUB/fintrack-backend/services"
	"github.com/gin-gonic/gin"
)

func UserRoutes(router *gin.RouterGroup) {

	userService := services.NewUserService(initializers.DB)
	usersController := controllers.NewUsersController(userService)

	userRoutes := router.Group("/user")
	userRoutes.Use(middleware.RequireAuth)
	{
		// Update User
		userRoutes.PUT("/update", usersController.UpdateUser)
		// Delete User
		userRoutes.DELETE("/delete", usersController.DeleteUser)
		// Get User Profile
		userRoutes.GET("/profile", usersController.Profile)
		// Validate
		userRoutes.GET("/validate", usersController.Validate)
	}
}
