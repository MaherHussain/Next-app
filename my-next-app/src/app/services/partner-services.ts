import http from "./http";

interface Partner {
    partnerName: string;
    email: string;
    password: string;
    restaurantName: string;
}

interface Response {
    message: string;
    data: Partner;
}

export async function createPartner(payload: Partner): Promise<Response> {
    const response = await http.post<Response>('/partner/register', payload);
    return response.data;
}