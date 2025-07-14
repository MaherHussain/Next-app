import { User } from "../utils/providers/UserContext";
import http from "./http";

interface LoginPayload {
    email: string;
    password: string;
}

interface RigesterPayload {
    partnerName: string;
    email: string;
    password: string;
    restaurantName: string;
    restaurantAddress: string;
}

interface AuthResponse {
    message: string;
    user: {
        id: string;
        email: string;
        partnerName: string;
        restaurantName: string;
    };
}

interface LogoutResponse {
    message: string;
}

interface UserResponse {
    user: User;
}

export async function createPartner(payload: RigesterPayload): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>('/auth/partner/register', payload);
    return response.data;
}

export const loginPartner = async (data: LoginPayload): Promise<AuthResponse> => {
    const response = await http.post("/auth/partner/login", data);
    return response.data;
};

export const logoutPartner = async (): Promise<LogoutResponse> => {
    const response = await http.post("/auth/partner/logout");
    return response.data;
};

export const getUser = async (): Promise<User> => {
    const response = await http.get<UserResponse>("/auth/user");
    return response.data.user;
};
