package services

import (
	"errors"

	"github.com/WAVEKUB/fintrack-backend/initializers"
	"github.com/WAVEKUB/fintrack-backend/models"
)

func CreateGoal(goal *models.Goal) error {
	if goal.Name == "" {
		return errors.New("name is required")
	}
	if goal.TargetAmount <= 0 {
		return errors.New("target amount must be greater than 0")
	}
	return initializers.DB.Create(goal).Error
}

func GetGoals(userID uint) ([]models.Goal, error) {
	var goals []models.Goal
	err := initializers.DB.Where("user_id = ?", userID).Order("created_at desc").Find(&goals).Error
	return goals, err
}

func GetGoalByID(id string, userID uint) (*models.Goal, error) {
	var goal models.Goal
	err := initializers.DB.Where("id = ? AND user_id = ?", id, userID).First(&goal).Error
	if err != nil {
		return nil, errors.New("goal not found")
	}
	return &goal, nil
}

func UpdateGoal(goal *models.Goal) error {
	if goal.Name == "" {
		return errors.New("name is required")
	}
	if goal.TargetAmount <= 0 {
		return errors.New("target amount must be greater than 0")
	}
	return initializers.DB.Save(goal).Error
}

func DeleteGoal(id string, userID uint) error {
	result := initializers.DB.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Goal{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("goal not found or not authorized")
	}
	return nil
}

// AddToGoal adds an amount to the current progress of a goal
func AddToGoal(id string, userID uint, amount float64) (*models.Goal, error) {
	goal, err := GetGoalByID(id, userID)
	if err != nil {
		return nil, err
	}
	goal.CurrentAmount += amount
	if err := initializers.DB.Save(goal).Error; err != nil {
		return nil, err
	}
	return goal, nil
}
