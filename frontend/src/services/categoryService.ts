import api from "@/lib/axios";

export interface Category {
    ID: number;
    name: string;
    type: "INCOME" | "EXPENSE";
    icon: string;
    color: string;
    user_id?: number | null;
}

export interface CategoryInput {
    name: string;
    type: "INCOME" | "EXPENSE";
    icon: string;
    color: string;
}

export const categoryService = {
    getCategories: async (): Promise<Category[]> => {
        const response = await api.get('/categories/');
        return response.data.data;
    },

    createCategory: async (category: CategoryInput): Promise<Category> => {
        const response = await api.post('/categories/', category);
        return response.data;
    },

    updateCategory: async (id: number, category: CategoryInput): Promise<Category> => {
        const response = await api.put(`/categories/${id}`, category);
        return response.data;
    },

    deleteCategory: async (id: number): Promise<void> => {
        await api.delete(`/categories/${id}`);
    }
};
