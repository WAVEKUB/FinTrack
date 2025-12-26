package routes

import (
	"github.com/WAVEKUB/fintrack-backend/controllers"
	"github.com/WAVEKUB/fintrack-backend/middleware"
	"github.com/gin-gonic/gin"
)

func GoalRoutes(r *gin.RouterGroup) {
	goalGroup := r.Group("/goals")
	goalGroup.Use(middleware.RequireAuth)
	{
		goalGroup.POST("", controllers.CreateGoal)
		goalGroup.GET("", controllers.GetGoals)
		goalGroup.GET("/:id", controllers.GetGoal)
		goalGroup.PUT("/:id", controllers.UpdateGoal)
		goalGroup.DELETE("/:id", controllers.DeleteGoal)
		goalGroup.POST("/:id/add", controllers.AddToGoalHandler)
	}
}
