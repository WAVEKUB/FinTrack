package routes

import (
	"github.com/WAVEKUB/fintrack-backend/middleware"
	"github.com/gin-gonic/gin"
)

func UserRoutes(router *gin.Engine) {

	userRoutes := router.Group("/user")
	userRoutes.Use(middleware.RequireAuth)
	{
		userRoutes.PUT("/update", usersController.UpdateUser)
		userRoutes.DELETE("/delete", usersController.DeleteUser)
		userRoutes.GET("/profile", usersController.Profile)
	}
}
