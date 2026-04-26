import { useQuery } from "@tanstack/react-query";
import { getRestaurant, getRestaurantById } from "../services/restaurant-services";

export function useGetRestaurant() {
    return useQuery({
        queryKey: ['restaurant'],
        queryFn: getRestaurant,
        retry: 3
    })
}

export function useGetRestaurantById(id: string) {
    return useQuery({
        queryKey: ['restaurant', id],
        queryFn: () => getRestaurantById(id),
        enabled: !!id,
        retry: 3
    })
}