package services

import (
	"testing"

	"github.com/WAVEKUB/fintrack-backend/models"
)

func TestNormalizeTransactionTypeAcceptsFrontendValues(t *testing.T) {
	tests := map[string]string{
		"income":  transactionTypeIncome,
		"expense": transactionTypeExpense,
		" INCOME ": transactionTypeIncome,
	}

	for input, want := range tests {
		if got := normalizeTransactionType(input); got != want {
			t.Fatalf("normalizeTransactionType(%q) = %q, want %q", input, got, want)
		}
	}
}

func TestTransactionBalanceImpact(t *testing.T) {
	tests := map[string]struct {
		transactionType string
		amount          float64
		want            float64
	}{
		"income increases wallet balance":  {transactionType: "income", amount: 125.50, want: 125.50},
		"expense decreases wallet balance": {transactionType: "expense", amount: 40, want: -40},
		"unknown type has no impact":        {transactionType: "transfer", amount: 40, want: 0},
	}

	for name, tt := range tests {
		t.Run(name, func(t *testing.T) {
			got := transactionBalanceImpact(models.Transaction{Type: tt.transactionType, Amount: tt.amount})
			if got != tt.want {
				t.Fatalf("transactionBalanceImpact() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestTransactionBalanceDeltaForUpdateAndDelete(t *testing.T) {
	original := models.Transaction{Type: "EXPENSE", Amount: 40}
	updated := models.Transaction{Type: "EXPENSE", Amount: 25}

	updateDelta := transactionBalanceImpact(updated) - transactionBalanceImpact(original)
	if updateDelta != 15 {
		t.Fatalf("update delta = %v, want 15", updateDelta)
	}

	deleteDelta := -transactionBalanceImpact(original)
	if deleteDelta != 40 {
		t.Fatalf("delete delta = %v, want 40", deleteDelta)
	}
}
