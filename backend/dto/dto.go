package dto

import (
	"time"

	"github.com/WAVEKUB/fintrack-backend/models"
)

// ========== USER DTO ==========

type UserDTO struct {
	ID        uint   `json:"ID"`
	Email     string `json:"email"`
	Name      string `json:"name"`
	Avatar    string `json:"avatar"`
	CreatedAt string `json:"CreatedAt"`
	UpdatedAt string `json:"UpdatedAt"`
}

func ToUserDTO(user models.User) UserDTO {
	return UserDTO{
		ID:        user.ID,
		Email:     user.Email,
		Name:      user.Name,
		Avatar:    user.Avatar,
		CreatedAt: user.CreatedAt.Format(time.RFC3339),
		UpdatedAt: user.UpdatedAt.Format(time.RFC3339),
	}
}

// ========== WALLET DTO ==========

type WalletDTO struct {
	ID        uint    `json:"ID"`
	Name      string  `json:"name"`
	Type      string  `json:"type"`
	Balance   float64 `json:"balance"`
	UserID    uint    `json:"user_id"`
	CreatedAt string  `json:"CreatedAt"`
	UpdatedAt string  `json:"UpdatedAt"`
}

func ToWalletDTO(wallet models.Wallet) WalletDTO {
	return WalletDTO{
		ID:        wallet.ID,
		Name:      wallet.Name,
		Type:      wallet.Type,
		Balance:   wallet.Balance,
		UserID:    wallet.UserID,
		CreatedAt: wallet.CreatedAt.Format(time.RFC3339),
		UpdatedAt: wallet.UpdatedAt.Format(time.RFC3339),
	}
}

func ToWalletDTOs(wallets []models.Wallet) []WalletDTO {
	dtos := make([]WalletDTO, len(wallets))
	for i, w := range wallets {
		dtos[i] = ToWalletDTO(w)
	}
	return dtos
}

// ========== CATEGORY DTO ==========

type CategoryDTO struct {
	ID        uint   `json:"ID"`
	Name      string `json:"name"`
	Type      string `json:"type"`
	Icon      string `json:"icon"`
	Color     string `json:"color"`
	UserID    *uint  `json:"user_id"`
	CreatedAt string `json:"CreatedAt"`
	UpdatedAt string `json:"UpdatedAt"`
}

func ToCategoryDTO(category models.Category) CategoryDTO {
	return CategoryDTO{
		ID:        category.ID,
		Name:      category.Name,
		Type:      category.Type,
		Icon:      category.Icon,
		Color:     category.Color,
		UserID:    category.UserID,
		CreatedAt: category.CreatedAt.Format(time.RFC3339),
		UpdatedAt: category.UpdatedAt.Format(time.RFC3339),
	}
}

func ToCategoryDTOs(categories []models.Category) []CategoryDTO {
	dtos := make([]CategoryDTO, len(categories))
	for i, c := range categories {
		dtos[i] = ToCategoryDTO(c)
	}
	return dtos
}

// ToCategoryDTOPtr returns a pointer to CategoryDTO, used for optional nested categories
func ToCategoryDTOPtr(category models.Category) *CategoryDTO {
	if category.ID == 0 {
		return nil
	}
	dto := ToCategoryDTO(category)
	return &dto
}

// ========== TRANSACTION DTO ==========

type TransactionDTO struct {
	ID             uint         `json:"ID"`
	Amount         float64      `json:"amount"`
	Type           string       `json:"type"`
	Date           string       `json:"date"`
	Note           string       `json:"note"`
	UserID         uint         `json:"user_id"`
	WalletID       uint         `json:"wallet_id"`
	CategoryID     uint         `json:"category_id"`
	TargetWalletID uint         `json:"target_wallet_id,omitempty"`
	Category       *CategoryDTO `json:"category,omitempty"`
	CreatedAt      string       `json:"CreatedAt"`
	UpdatedAt      string       `json:"UpdatedAt"`
}

func ToTransactionDTO(tx models.Transaction) TransactionDTO {
	dto := TransactionDTO{
		ID:             tx.ID,
		Amount:         tx.Amount,
		Type:           tx.Type,
		Date:           tx.Date.Format(time.RFC3339),
		Note:           tx.Note,
		UserID:         tx.UserID,
		WalletID:       tx.WalletID,
		CategoryID:     tx.CategoryID,
		TargetWalletID: tx.TargetWalletID,
		Category:       ToCategoryDTOPtr(tx.Category),
		CreatedAt:      tx.CreatedAt.Format(time.RFC3339),
		UpdatedAt:      tx.UpdatedAt.Format(time.RFC3339),
	}
	return dto
}

func ToTransactionDTOs(transactions []models.Transaction) []TransactionDTO {
	dtos := make([]TransactionDTO, len(transactions))
	for i, tx := range transactions {
		dtos[i] = ToTransactionDTO(tx)
	}
	return dtos
}

// ========== BUDGET DTO ==========

type BudgetDTO struct {
	ID         uint         `json:"ID"`
	Name       string       `json:"name"`
	Amount     float64      `json:"amount"`
	Spent      float64      `json:"spent"`
	Remaining  float64      `json:"remaining"`
	Progress   float64      `json:"progress"`
	Period     string       `json:"period"`
	StartDate  string       `json:"start_date"`
	EndDate    string       `json:"end_date"`
	UserID     uint         `json:"user_id"`
	CategoryID uint         `json:"category_id"`
	WalletID   *uint        `json:"wallet_id,omitempty"`
	Category   *CategoryDTO `json:"category,omitempty"`
	Wallet     *WalletDTO   `json:"wallet,omitempty"`
	CreatedAt  string       `json:"CreatedAt"`
	UpdatedAt  string       `json:"UpdatedAt"`
}

func ToBudgetDTO(budget models.Budget) BudgetDTO {
	dto := BudgetDTO{
		ID:         budget.ID,
		Name:       budget.Name,
		Amount:     budget.Amount,
		Spent:      budget.SpentAmount,
		Remaining:  budget.RemainingAmount,
		Progress:   budget.Progress,
		Period:     budget.Period,
		StartDate:  budget.StartDate.Format(time.RFC3339),
		EndDate:    budget.EndDate.Format(time.RFC3339),
		UserID:     budget.UserID,
		CategoryID: budget.CategoryID,
		WalletID:   budget.WalletID,
		Category:   ToCategoryDTOPtr(budget.Category),
		CreatedAt:  budget.CreatedAt.Format(time.RFC3339),
		UpdatedAt:  budget.UpdatedAt.Format(time.RFC3339),
	}

	// Handle optional wallet
	if budget.Wallet.ID != 0 {
		walletDTO := ToWalletDTO(budget.Wallet)
		dto.Wallet = &walletDTO
	}

	return dto
}

func ToBudgetDTOs(budgets []models.Budget) []BudgetDTO {
	dtos := make([]BudgetDTO, len(budgets))
	for i, b := range budgets {
		dtos[i] = ToBudgetDTO(b)
	}
	return dtos
}

// ========== GOAL DTO ==========

type GoalDTO struct {
	ID            uint    `json:"ID"`
	Name          string  `json:"name"`
	TargetAmount  float64 `json:"target_amount"`
	CurrentAmount float64 `json:"current_amount"`
	Deadline      *string `json:"deadline,omitempty"`
	Notes         string  `json:"notes"`
	UserID        uint    `json:"user_id"`
	CreatedAt     string  `json:"CreatedAt"`
	UpdatedAt     string  `json:"UpdatedAt"`
}

func ToGoalDTO(goal models.Goal) GoalDTO {
	dto := GoalDTO{
		ID:            goal.ID,
		Name:          goal.Name,
		TargetAmount:  goal.TargetAmount,
		CurrentAmount: goal.CurrentAmount,
		Notes:         goal.Notes,
		UserID:        goal.UserID,
		CreatedAt:     goal.CreatedAt.Format(time.RFC3339),
		UpdatedAt:     goal.UpdatedAt.Format(time.RFC3339),
	}

	// Handle optional deadline
	if goal.Deadline != nil {
		deadline := goal.Deadline.Format(time.RFC3339)
		dto.Deadline = &deadline
	}

	return dto
}

func ToGoalDTOs(goals []models.Goal) []GoalDTO {
	dtos := make([]GoalDTO, len(goals))
	for i, g := range goals {
		dtos[i] = ToGoalDTO(g)
	}
	return dtos
}
