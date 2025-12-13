package services

import (
	"errors"
	"os"
	"time"

	"github.com/WAVEKUB/fintrack-backend/models"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserService struct {
	DB *gorm.DB
}

// New User Service
func NewUserService(db *gorm.DB) *UserService {
	return &UserService{DB: db}
}

// Sign Up
func (s *UserService) SignUp(email, password, name string) (*models.User, error) {
	// hash password
	hash, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return nil, errors.New("failed to hash password")
	}

	// create user
	user := models.User{
		Email:    email,
		Password: string(hash),
		Name:     name,
	}

	// save user
	result := s.DB.Create(&user)
	if result.Error != nil {
		return nil, errors.New("failed to create user")
	}

	return &user, nil
}

// Login
func (s *UserService) Login(email, password string) (string, error) {
	// find user
	var user models.User
	s.DB.Where("email = ?", email).First(&user)
	if user.ID == 0 {
		return "", errors.New("invalid email or password")
	}

	// compare password
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return "", errors.New("invalid password")
	}

	// create token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"exp": time.Now().Add(time.Hour * 24).Unix(),
	})

	// sign token
	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", errors.New("failed to create token")
	}

	return tokenString, nil
}

// Update User
func (s *UserService) UpdateUser(email, password, name, avatar string) (*models.User, error) {
	// find user
	var user models.User
	result := s.DB.Where("email = ?", email).First(&user)
	if result.Error != nil {
		return nil, errors.New("failed to find user")
	}

	// update user
	user.Email = email
	if password != "" {
		// hash password if provided
		hash, err := bcrypt.GenerateFromPassword([]byte(password), 10)
		if err != nil {
			return nil, errors.New("failed to hash password")
		}
		user.Password = string(hash)
	}
	user.Name = name
	user.Avatar = avatar

	// save user
	result = s.DB.Save(&user)
	if result.Error != nil {
		return nil, errors.New("failed to update user")
	}

	return &user, nil
}

// Delete User
func (s *UserService) DeleteUser(email string) error {
	// find user
	var user models.User
	result := s.DB.Where("email = ?", email).First(&user)
	if result.Error != nil {
		return errors.New("failed to find user")
	}

	// delete user
	result = s.DB.Delete(&user)
	if result.Error != nil {
		return errors.New("failed to delete user")
	}

	return nil
}

// Profile
func (s *UserService) Profile(email string) (*models.User, error) {
	// find user
	var user models.User
	result := s.DB.Where("email = ?", email).First(&user)
	if result.Error != nil {
		return nil, errors.New("failed to find user")
	}

	return &user, nil
}
