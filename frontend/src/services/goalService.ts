import api from '@/lib/axios';

export interface Goal {
    ID: number;
    name: string;
    target_amount: number;
    current_amount: number;
    deadline?: string;
    notes?: string;
    user_id: number;
    CreatedAt?: string;
    UpdatedAt?: string;
    DeletedAt?: string | null;
}

export interface GoalInput {
    name: string;
    target_amount: number;
    current_amount: number;
    deadline?: string;
    notes?: string;
}

export const goalService = {
    getGoals: async (): Promise<Goal[]> => {
        const response = await api.get('/goals');
        return response.data.data || [];
    },

    createGoal: async (goal: GoalInput): Promise<Goal> => {
        const response = await api.post('/goals', goal);
        return response.data.goal;
    },

    updateGoal: async (id: number, goal: GoalInput): Promise<Goal> => {
        const response = await api.put(`/goals/${id}`, goal);
        return response.data.goal;
    },

    deleteGoal: async (id: number): Promise<void> => {
        await api.delete(`/goals/${id}`);
    }
};
