import api from "@/lib/axios";

export interface UserProfile {
    ID: number;
    email: string;
    name: string;
    avatar: string;
}

export interface ProfileInput {
    email: string;
    name: string;
    avatar: string;
}

export interface PasswordInput {
    current_password: string;
    new_password: string;
}

export const userService = {
    getProfile: async (): Promise<UserProfile> => {
        const response = await api.get("/user/profile");
        return response.data.data;
    },

    updateProfile: async (profile: ProfileInput): Promise<UserProfile> => {
        const response = await api.put("/user/update", profile);
        return response.data.data;
    },

    changePassword: async (payload: PasswordInput): Promise<void> => {
        await api.put("/user/password", payload);
    },

    deleteAccount: async (): Promise<void> => {
        await api.delete("/user/delete");
    },
};
