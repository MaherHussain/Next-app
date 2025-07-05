import http from "./http";

interface LoginData {
    email: string;
    password: string;
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

export const loginPartner = async (data: LoginData): Promise<AuthResponse> => {
    const response = await http.post("/auth/partner/login", data);
    return response.data;
};

export const logoutPartner = async (): Promise<LogoutResponse> => {
    const response = await http.post("/auth/partner/logout");
    return response.data;
};