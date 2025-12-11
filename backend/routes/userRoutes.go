package routes

import (
	"github.com/WAVEKUB/fintrack-backend/controllers"
	"github.com/WAVEKUB/fintrack-backend/initializers"
	"github.com/WAVEKUB/fintrack-backend/middleware"
	"github.com/WAVEKUB/fintrack-backend/services"
	"github.com/gin-gonic/gin"
)

func UserRoutes(router *gin.Engine) {

	userService := services.NewUserService(initializers.DB)
	usersController := controllers.NewUsersController(userService)

	userRoutes := router.Group("/user")
	userRoutes.Use(middleware.RequireAuth)
	{
		userRoutes.PUT("/update", usersController.UpdateUser)
		userRoutes.DELETE("/delete", usersController.DeleteUser)
		userRoutes.GET("/profile", usersController.Profile)
	}
}
