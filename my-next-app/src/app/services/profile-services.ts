import http from "./http";

export interface RestaurantProfile {
    _id: string;
    name: string;
    address: string;
    logo?: string;
    cvrNumber?: number;
    openHours: {
        monday: { start: string; end: string } | null;
        tuesday: { start: string; end: string } | null;
        wednesday: { start: string; end: string } | null;
        thursday: { start: string; end: string } | null;
        friday: { start: string; end: string } | null;
        saturday: { start: string; end: string } | null;
        sunday: { start: string; end: string } | null;
    };
}

export const getProfile = async (): Promise<RestaurantProfile> => {
    const response = await http.get<{ restaurant: RestaurantProfile }>("/partner/profile");
    return response.data.restaurant;
};

export const updateProfile = async (data: Partial<RestaurantProfile>): Promise<{ message: string; restaurant: RestaurantProfile }> => {
    const response = await http.put<{ message: string; restaurant: RestaurantProfile }>("/partner/profile", data);
    return response.data;
};
