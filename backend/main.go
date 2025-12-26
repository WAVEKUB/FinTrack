package main

import (
	"os"

	"github.com/WAVEKUB/fintrack-backend/initializers"
	"github.com/WAVEKUB/fintrack-backend/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
	initializers.SyncDatabase()
	initializers.SeedDatabase()
}

func main() {

	r := gin.Default()

	r.Use(
		cors.New(cors.Config{
			AllowOrigins:     []string{os.Getenv("CLIENT_ORIGIN")},
			AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
			AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
			AllowCredentials: true,
		}))

	v1 := r.Group("/api/v1")
	routes.AuthRoutes(v1)
	routes.UserRoutes(v1)
	routes.TransactionRoutes(v1)
	routes.WalletRoutes(v1)
	routes.BudgetRoutes(v1)
	routes.CategoryRoutes(v1)

	r.Run(":" + os.Getenv("PORT"))

}
