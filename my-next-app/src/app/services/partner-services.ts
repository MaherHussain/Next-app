import http from "./http";

interface Partner {
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

export async function createPartner(payload: Partner): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>('/auth/partner/register', payload);
    return response.data;
}