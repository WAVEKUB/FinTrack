import api from '@/lib/axios';

export interface Budget {
    ID: number;
    name: string;
    amount: number;
    period: string;
    start_date: string;
    end_date: string;
    category_id: number | null;
    user_id: number;
    category?: {
        ID: number;
        name: string;
        type: string;
        color: string;
        icon: string;
    };
    CreatedAt?: string;
    UpdatedAt?: string;
    DeletedAt?: string | null;
}

export interface BudgetInput {
    name: string;
    amount: number;
    period: string;
    start_date: string;
    end_date: string;
    category_id: number;
}

export const budgetService = {
    getBudgets: async (): Promise<Budget[]> => {
        const response = await api.get('/budgets');
        return response.data.budgets;
    },

    createBudget: async (budget: BudgetInput): Promise<Budget> => {
        const response = await api.post('/budgets', budget);
        return response.data.budget;
    },

    updateBudget: async (id: number, budget: BudgetInput): Promise<Budget> => {
        const response = await api.put(`/budgets/${id}`, budget);
        return response.data.budget;
    },

    deleteBudget: async (id: number): Promise<void> => {
        await api.delete(`/budgets/${id}`);
    }
};
