package services

import (
	"errors"
	"os"
	"strings"
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
	result := s.DB.Where("email = ?", email).First(&user)
	if result.Error != nil {
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

func (s *UserService) UpdateProfile(userID uint, email, name, avatar string) (*models.User, error) {
	email = strings.TrimSpace(email)
	name = strings.TrimSpace(name)

	if email == "" {
		return nil, errors.New("email is required")
	}
	if name == "" {
		return nil, errors.New("name is required")
	}

	var duplicateCount int64
	if err := s.DB.Model(&models.User{}).Where("email = ? AND id <> ?", email, userID).Count(&duplicateCount).Error; err != nil {
		return nil, errors.New("failed to check email")
	}
	if duplicateCount > 0 {
		return nil, errors.New("email is already in use")
	}

	var user models.User
	if err := s.DB.First(&user, userID).Error; err != nil {
		return nil, errors.New("failed to find user")
	}

	user.Email = email
	user.Name = name
	user.Avatar = strings.TrimSpace(avatar)
	if err := s.DB.Save(&user).Error; err != nil {
		return nil, errors.New("failed to update profile")
	}

	return &user, nil
}

func (s *UserService) ChangePassword(userID uint, currentPassword, newPassword string) error {
	if strings.TrimSpace(newPassword) == "" {
		return errors.New("new password is required")
	}

	var user models.User
	if err := s.DB.First(&user, userID).Error; err != nil {
		return errors.New("failed to find user")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(currentPassword)); err != nil {
		return errors.New("current password is incorrect")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(newPassword), 10)
	if err != nil {
		return errors.New("failed to hash password")
	}
	user.Password = string(hash)

	if err := s.DB.Save(&user).Error; err != nil {
		return errors.New("failed to update password")
	}
	return nil
}

func (s *UserService) DeleteAccount(userID uint) error {
	return s.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Unscoped().Where("user_id = ?", userID).Delete(&models.Transaction{}).Error; err != nil {
			return err
		}
		if err := tx.Unscoped().Where("user_id = ?", userID).Delete(&models.Budget{}).Error; err != nil {
			return err
		}
		if err := tx.Unscoped().Where("user_id = ?", userID).Delete(&models.Goal{}).Error; err != nil {
			return err
		}
		if err := tx.Unscoped().Where("user_id = ?", userID).Delete(&models.Wallet{}).Error; err != nil {
			return err
		}
		if err := tx.Unscoped().Where("user_id = ?", userID).Delete(&models.Category{}).Error; err != nil {
			return err
		}
		result := tx.Unscoped().Where("id = ?", userID).Delete(&models.User{})
		if result.Error != nil {
			return result.Error
		}
		if result.RowsAffected == 0 {
			return errors.New("user not found")
		}
		return nil
	})
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
