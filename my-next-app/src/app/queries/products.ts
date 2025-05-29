import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts } from '../services/product-services'

export function useGetProducts() {
    return useQuery({
        queryKey: ['products'],
        queryFn: getProducts,
        retry: 3
    })
}