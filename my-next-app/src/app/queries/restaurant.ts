import { useQuery } from "@tanstack/react-query";
import { getRestaurant } from "../services/restaurant-services";

export function useGetRestaurant() {
    return useQuery({
        queryKey: ['restaurant'],
        queryFn: getRestaurant,
        retry: 3
    })
}