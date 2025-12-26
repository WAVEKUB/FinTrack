package initializers

import (
	"log"
	"time"

	"github.com/WAVEKUB/fintrack-backend/models"
	"golang.org/x/crypto/bcrypt"
)

func SeedDatabase() {
	// Check if data already exists
	var userCount int64
	DB.Model(&models.User{}).Count(&userCount)
	if userCount > 0 {
		log.Println("📦 Database already seeded, skipping...")
		return
	}

	log.Println("🌱 Seeding database with mock data...")

	// Create mock users
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)
	users := []models.User{
		{
			Email:    "john@example.com",
			Password: string(hashedPassword),
			Name:     "John Doe",
			Avatar:   "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
		},
		{
			Email:    "jane@example.com",
			Password: string(hashedPassword),
			Name:     "Jane Smith",
			Avatar:   "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
		},
	}

	for i := range users {
		DB.Create(&users[i])
	}
	log.Println("✅ Created mock users")

	// Create global categories (no user_id)
	categories := []models.Category{
		// Income categories
		{Name: "Salary", Type: "INCOME", Icon: "💰", Color: "#22C55E"},
		{Name: "Freelance", Type: "INCOME", Icon: "💻", Color: "#10B981"},
		{Name: "Investments", Type: "INCOME", Icon: "📈", Color: "#059669"},
		{Name: "Gifts", Type: "INCOME", Icon: "🎁", Color: "#14B8A6"},
		{Name: "Other Income", Type: "INCOME", Icon: "💵", Color: "#0D9488"},

		// Expense categories
		{Name: "Food & Dining", Type: "EXPENSE", Icon: "🍔", Color: "#EF4444"},
		{Name: "Transportation", Type: "EXPENSE", Icon: "🚗", Color: "#F97316"},
		{Name: "Shopping", Type: "EXPENSE", Icon: "🛍️", Color: "#F59E0B"},
		{Name: "Entertainment", Type: "EXPENSE", Icon: "🎬", Color: "#EAB308"},
		{Name: "Bills & Utilities", Type: "EXPENSE", Icon: "💡", Color: "#84CC16"},
		{Name: "Healthcare", Type: "EXPENSE", Icon: "🏥", Color: "#22C55E"},
		{Name: "Education", Type: "EXPENSE", Icon: "📚", Color: "#14B8A6"},
		{Name: "Travel", Type: "EXPENSE", Icon: "✈️", Color: "#06B6D4"},
		{Name: "Rent", Type: "EXPENSE", Icon: "🏠", Color: "#0EA5E9"},
		{Name: "Groceries", Type: "EXPENSE", Icon: "🛒", Color: "#3B82F6"},
		{Name: "Personal Care", Type: "EXPENSE", Icon: "💅", Color: "#6366F1"},
		{Name: "Subscriptions", Type: "EXPENSE", Icon: "📱", Color: "#8B5CF6"},
		{Name: "Other Expenses", Type: "EXPENSE", Icon: "📦", Color: "#A855F7"},
	}

	for i := range categories {
		DB.Create(&categories[i])
	}
	log.Println("✅ Created global categories")

	// Create wallets for user 1
	wallets := []models.Wallet{
		{Name: "Main Bank", Type: "BANK", Balance: 15000.00, UserID: users[0].ID},
		{Name: "Cash Wallet", Type: "CASH", Balance: 500.00, UserID: users[0].ID},
		{Name: "Credit Card", Type: "CREDIT", Balance: -1200.00, UserID: users[0].ID},
		{Name: "Savings", Type: "BANK", Balance: 25000.00, UserID: users[0].ID},
	}

	for i := range wallets {
		DB.Create(&wallets[i])
	}
	log.Println("✅ Created wallets for user 1")

	// Create wallets for user 2
	wallets2 := []models.Wallet{
		{Name: "Personal Account", Type: "BANK", Balance: 8000.00, UserID: users[1].ID},
		{Name: "Emergency Fund", Type: "BANK", Balance: 12000.00, UserID: users[1].ID},
	}

	for i := range wallets2 {
		DB.Create(&wallets2[i])
	}
	log.Println("✅ Created wallets for user 2")

	// Get category IDs for transactions
	var salaryCategory, freelanceCategory, foodCategory, transportCategory, shoppingCategory, entertainmentCategory, billsCategory, groceriesCategory models.Category
	DB.Where("name = ?", "Salary").First(&salaryCategory)
	DB.Where("name = ?", "Freelance").First(&freelanceCategory)
	DB.Where("name = ?", "Food & Dining").First(&foodCategory)
	DB.Where("name = ?", "Transportation").First(&transportCategory)
	DB.Where("name = ?", "Shopping").First(&shoppingCategory)
	DB.Where("name = ?", "Entertainment").First(&entertainmentCategory)
	DB.Where("name = ?", "Bills & Utilities").First(&billsCategory)
	DB.Where("name = ?", "Groceries").First(&groceriesCategory)

	// Create transactions for user 1 (last 3 months)
	now := time.Now()
	transactions := []models.Transaction{
		// December 2025
		{Amount: 5000.00, Type: "INCOME", Date: now.AddDate(0, 0, -2), Note: "Monthly Salary", UserID: users[0].ID, WalletID: wallets[0].ID, CategoryID: salaryCategory.ID},
		{Amount: 1500.00, Type: "INCOME", Date: now.AddDate(0, 0, -5), Note: "Freelance Project", UserID: users[0].ID, WalletID: wallets[0].ID, CategoryID: freelanceCategory.ID},
		{Amount: 45.50, Type: "EXPENSE", Date: now.AddDate(0, 0, -1), Note: "Lunch with team", UserID: users[0].ID, WalletID: wallets[0].ID, CategoryID: foodCategory.ID},
		{Amount: 120.00, Type: "EXPENSE", Date: now.AddDate(0, 0, -3), Note: "Gas", UserID: users[0].ID, WalletID: wallets[0].ID, CategoryID: transportCategory.ID},
		{Amount: 299.99, Type: "EXPENSE", Date: now.AddDate(0, 0, -4), Note: "New headphones", UserID: users[0].ID, WalletID: wallets[2].ID, CategoryID: shoppingCategory.ID},
		{Amount: 15.99, Type: "EXPENSE", Date: now.AddDate(0, 0, -1), Note: "Netflix subscription", UserID: users[0].ID, WalletID: wallets[0].ID, CategoryID: entertainmentCategory.ID},
		{Amount: 150.00, Type: "EXPENSE", Date: now.AddDate(0, 0, -6), Note: "Electric bill", UserID: users[0].ID, WalletID: wallets[0].ID, CategoryID: billsCategory.ID},
		{Amount: 85.00, Type: "EXPENSE", Date: now.AddDate(0, 0, -2), Note: "Weekly groceries", UserID: users[0].ID, WalletID: wallets[1].ID, CategoryID: groceriesCategory.ID},

		// November 2025
		{Amount: 5000.00, Type: "INCOME", Date: now.AddDate(0, -1, -2), Note: "Monthly Salary", UserID: users[0].ID, WalletID: wallets[0].ID, CategoryID: salaryCategory.ID},
		{Amount: 800.00, Type: "INCOME", Date: now.AddDate(0, -1, -10), Note: "Side project", UserID: users[0].ID, WalletID: wallets[0].ID, CategoryID: freelanceCategory.ID},
		{Amount: 65.00, Type: "EXPENSE", Date: now.AddDate(0, -1, -5), Note: "Restaurant dinner", UserID: users[0].ID, WalletID: wallets[0].ID, CategoryID: foodCategory.ID},
		{Amount: 200.00, Type: "EXPENSE", Date: now.AddDate(0, -1, -8), Note: "Car maintenance", UserID: users[0].ID, WalletID: wallets[0].ID, CategoryID: transportCategory.ID},
		{Amount: 450.00, Type: "EXPENSE", Date: now.AddDate(0, -1, -12), Note: "Winter jacket", UserID: users[0].ID, WalletID: wallets[2].ID, CategoryID: shoppingCategory.ID},
		{Amount: 25.00, Type: "EXPENSE", Date: now.AddDate(0, -1, -15), Note: "Movie tickets", UserID: users[0].ID, WalletID: wallets[1].ID, CategoryID: entertainmentCategory.ID},
		{Amount: 180.00, Type: "EXPENSE", Date: now.AddDate(0, -1, -6), Note: "Internet + Phone", UserID: users[0].ID, WalletID: wallets[0].ID, CategoryID: billsCategory.ID},
		{Amount: 120.00, Type: "EXPENSE", Date: now.AddDate(0, -1, -3), Note: "Groceries", UserID: users[0].ID, WalletID: wallets[1].ID, CategoryID: groceriesCategory.ID},

		// October 2025
		{Amount: 5000.00, Type: "INCOME", Date: now.AddDate(0, -2, -2), Note: "Monthly Salary", UserID: users[0].ID, WalletID: wallets[0].ID, CategoryID: salaryCategory.ID},
		{Amount: 2000.00, Type: "INCOME", Date: now.AddDate(0, -2, -15), Note: "Big freelance project", UserID: users[0].ID, WalletID: wallets[0].ID, CategoryID: freelanceCategory.ID},
		{Amount: 35.00, Type: "EXPENSE", Date: now.AddDate(0, -2, -4), Note: "Coffee shop", UserID: users[0].ID, WalletID: wallets[1].ID, CategoryID: foodCategory.ID},
		{Amount: 80.00, Type: "EXPENSE", Date: now.AddDate(0, -2, -7), Note: "Uber rides", UserID: users[0].ID, WalletID: wallets[0].ID, CategoryID: transportCategory.ID},
		{Amount: 150.00, Type: "EXPENSE", Date: now.AddDate(0, -2, -10), Note: "Books", UserID: users[0].ID, WalletID: wallets[0].ID, CategoryID: shoppingCategory.ID},
		{Amount: 50.00, Type: "EXPENSE", Date: now.AddDate(0, -2, -12), Note: "Concert tickets", UserID: users[0].ID, WalletID: wallets[0].ID, CategoryID: entertainmentCategory.ID},
		{Amount: 145.00, Type: "EXPENSE", Date: now.AddDate(0, -2, -6), Note: "Electric bill", UserID: users[0].ID, WalletID: wallets[0].ID, CategoryID: billsCategory.ID},
		{Amount: 95.00, Type: "EXPENSE", Date: now.AddDate(0, -2, -3), Note: "Groceries", UserID: users[0].ID, WalletID: wallets[1].ID, CategoryID: groceriesCategory.ID},
	}

	for i := range transactions {
		DB.Create(&transactions[i])
	}
	log.Println("✅ Created transactions for user 1")

	// Create transactions for user 2
	transactions2 := []models.Transaction{
		{Amount: 4500.00, Type: "INCOME", Date: now.AddDate(0, 0, -3), Note: "Salary", UserID: users[1].ID, WalletID: wallets2[0].ID, CategoryID: salaryCategory.ID},
		{Amount: 55.00, Type: "EXPENSE", Date: now.AddDate(0, 0, -1), Note: "Dinner", UserID: users[1].ID, WalletID: wallets2[0].ID, CategoryID: foodCategory.ID},
		{Amount: 200.00, Type: "EXPENSE", Date: now.AddDate(0, 0, -2), Note: "Shopping", UserID: users[1].ID, WalletID: wallets2[0].ID, CategoryID: shoppingCategory.ID},
	}

	for i := range transactions2 {
		DB.Create(&transactions2[i])
	}
	log.Println("✅ Created transactions for user 2")

	// Create budgets for user 1
	startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	endOfMonth := startOfMonth.AddDate(0, 1, -1)

	budgets := []models.Budget{
		{Name: "Food Budget", Amount: 500.00, Period: "MONTHLY", StartDate: startOfMonth, EndDate: endOfMonth, UserID: users[0].ID, CategoryID: foodCategory.ID, WalletID: &wallets[0].ID},
		{Name: "Transport Budget", Amount: 300.00, Period: "MONTHLY", StartDate: startOfMonth, EndDate: endOfMonth, UserID: users[0].ID, CategoryID: transportCategory.ID, WalletID: &wallets[0].ID},
		{Name: "Entertainment Budget", Amount: 200.00, Period: "MONTHLY", StartDate: startOfMonth, EndDate: endOfMonth, UserID: users[0].ID, CategoryID: entertainmentCategory.ID, WalletID: nil},
		{Name: "Shopping Budget", Amount: 400.00, Period: "MONTHLY", StartDate: startOfMonth, EndDate: endOfMonth, UserID: users[0].ID, CategoryID: shoppingCategory.ID, WalletID: nil},
	}

	for i := range budgets {
		DB.Create(&budgets[i])
	}
	log.Println("✅ Created budgets for user 1")

	log.Println("🎉 Database seeding completed successfully!")
}
