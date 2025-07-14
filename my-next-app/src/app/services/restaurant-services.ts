import http from "./http";

interface Restaurant {
    _id: string;
    name: string;
    address: string;
    email: string;
    phone: string;
    createdAt: string;
    updatedAt: string;
}

interface RestaurantResponse {
    data: Restaurant;
}

export const getRestaurant = async (): Promise<RestaurantResponse> => {
    const response = await http.get("/auth/restaurant");
    return response.data;
};

