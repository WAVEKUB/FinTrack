package routes

import (
	"github.com/WAVEKUB/fintrack-backend/controllers"
	"github.com/WAVEKUB/fintrack-backend/middleware"
	"github.com/gin-gonic/gin"
)

func CategoryRoutes(r *gin.RouterGroup) {
	categoryGroup := r.Group("/categories")
	categoryGroup.Use(middleware.RequireAuth)
	{
		categoryGroup.POST("/", controllers.CreateCategory)
		categoryGroup.GET("/", controllers.GetCategories)
		categoryGroup.PUT("/:id", controllers.UpdateCategory)
		categoryGroup.DELETE("/:id", controllers.DeleteCategory)
	}
}
