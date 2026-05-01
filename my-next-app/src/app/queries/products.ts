import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addProduct, getProducts, deleteProduct, editProduct, searchProducts } from '../services/product-services'

export function useGetProducts({ page, limit, restaurantId, activeOnly }: { page?: number, limit?: number, restaurantId: string, activeOnly: boolean }) {
    return useQuery({
        queryKey: ['products', { page, limit, restaurantId, activeOnly }],
        queryFn: () => getProducts({ page, limit, restaurantId, activeOnly }),
        retry: 3,
        enabled: !!restaurantId,
    })
}
export function useAddProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ name, price, restaurantId, active, ingredients, imageUrl }: { name: string, price: number, restaurantId: string, active?: boolean, ingredients?: string[], imageUrl?: string }) => addProduct({ name, price, restaurantId, active, ingredients, imageUrl }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (err: any) => {
            const errorMessage = err?.response?.data?.message || err?.message || "An error occurred";
            return errorMessage
        }
    })
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (err: any) => {
            const errorMessage = err?.response?.data?.message || err?.message || "An error occurred";
            return errorMessage
        }
    })
}

export function useEditProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ product }: { product: { id: string, name?: string; price?: number; active?: boolean, ingredients?: string[], imageUrl?: string } }) => editProduct(product),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (err: any) => {
            const errorMessage = err?.response?.data?.message || err?.message || "An error occurred";
            return errorMessage
        }
    })
}

export function useSearchProducts({ query, page, limit, restaurantId, activeOnly }: { query: string, page?: number, limit?: number, restaurantId: string, activeOnly: boolean }) {
    return useQuery({
        queryKey: ['products', 'search', { query, page, limit, restaurantId, activeOnly }],
        queryFn: () => searchProducts({ query, page, limit, restaurantId, activeOnly }),
        enabled: query.length > 0 && !!restaurantId,
        retry: 3
    })
}