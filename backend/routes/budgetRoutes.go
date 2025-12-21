package routes

import (
	"github.com/WAVEKUB/fintrack-backend/controllers"
	"github.com/WAVEKUB/fintrack-backend/middleware"
	"github.com/gin-gonic/gin"
)

func BudgetRoutes(r *gin.RouterGroup) {
	budgetGroup := r.Group("/budgets")
	budgetGroup.Use(middleware.RequireAuth)
	{
		budgetGroup.POST("", controllers.CreateBudget)
		budgetGroup.GET("", controllers.GetBudgets)
		budgetGroup.PUT("/:id", controllers.UpdateBudget)
		budgetGroup.DELETE("/:id", controllers.DeleteBudget)
	}
}
