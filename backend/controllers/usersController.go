package controllers

import (
	"net/http"

	"github.com/WAVEKUB/fintrack-backend/dto"
	"github.com/WAVEKUB/fintrack-backend/models"
	"github.com/WAVEKUB/fintrack-backend/services"
	"github.com/gin-gonic/gin"
)

type UsersController struct {
	UserService *services.UserService
}

func NewUsersController(userService *services.UserService) *UsersController {
	return &UsersController{UserService: userService}
}

func (uc *UsersController) SignUp(c *gin.Context) {

	// get request body
	var body struct {
		Email    string
		Password string
		Name     string
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read request body"})
		return
	}

	// create user via service
	_, err := uc.UserService.SignUp(body.Email, body.Password, body.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// return success
	c.JSON(http.StatusOK, gin.H{"message": "User created successfully"})
}

func (uc *UsersController) Login(c *gin.Context) {
	// get request body
	var body struct {
		Email    string
		Password string
	}
	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read request body"})
		return
	}

	// login via service
	tokenString, err := uc.UserService.Login(body.Email, body.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// return token
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorization", tokenString, 3600*24, "", "", false, true)

	// return JSON
	c.JSON(http.StatusOK, gin.H{
		"token":   tokenString,
		"message": "User logged in successfully",
	})
}

func (uc *UsersController) UpdateUser(c *gin.Context) {
	// get request body
	var body struct {
		Email    string
		Name     string
		Avatar   string
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read request body"})
		return
	}

	user, _ := c.Get("user")
	userModel := user.(models.User)

	updatedUser, err := uc.UserService.UpdateProfile(userModel.ID, body.Email, body.Name, body.Avatar)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// return success
	c.JSON(http.StatusOK, gin.H{"data": dto.ToUserDTO(*updatedUser)})
}

func (uc *UsersController) ChangePassword(c *gin.Context) {
	var body struct {
		CurrentPassword string `json:"current_password"`
		NewPassword     string `json:"new_password"`
	}

	if c.Bind(&body) != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read request body"})
		return
	}

	user, _ := c.Get("user")
	userModel := user.(models.User)

	if err := uc.UserService.ChangePassword(userModel.ID, body.CurrentPassword, body.NewPassword); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password updated successfully"})
}

func (uc *UsersController) DeleteUser(c *gin.Context) {
	user, _ := c.Get("user")
	userModel := user.(models.User)

	if err := uc.UserService.DeleteAccount(userModel.ID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete user"})
		return
	}

	// return success
	c.JSON(http.StatusOK, gin.H{"message": "User deleted successfully"})
}

func (uc *UsersController) Validate(c *gin.Context) {
	// get user from middleware
	user, _ := c.Get("user")
	userModel := user.(models.User)

	// send user back to client
	c.JSON(http.StatusOK, gin.H{
		"message": "I'm logged in!",
		"user":    dto.ToUserDTO(userModel),
	})
}

func (uc *UsersController) Profile(c *gin.Context) {
	// get user from middleware
	user, _ := c.Get("user")
	userModel := user.(models.User)

	// return user
	c.JSON(http.StatusOK, gin.H{"data": dto.ToUserDTO(userModel)})
}
