package main

import (
	"github.com/WAVEKUB/fintrack-backend/initializers"
	"github.com/WAVEKUB/fintrack-backend/routes"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
	initializers.SyncDatabase()
}

func main() {

	r := gin.Default()

	r.Use(
		cors.New(cors.Config{
			AllowOrigins:     []string{"http://localhost:3000"},
			AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
			AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
			AllowCredentials: true,
		}))

	routes.AuthRoutes(r)
	routes.UserRoutes(r)

	r.Run(":8080")

}
