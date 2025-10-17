import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addProduct, getProducts, deleteProduct, editProduct } from '../services/product-services'

export function useGetProducts() {
    return useQuery({
        queryKey: ['products'],
        queryFn: getProducts,
        retry: 3
    })
}
export function useAddProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (err: any) => {
            const errorMessage = err?.response?.data?.message || err?.message || "An error occurred";
            console.log(errorMessage)
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
            console.log(errorMessage)
        }
    })
}

export function useEditProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ product }: { product: { id: string, name?: string; price?: number } }) => editProduct(product),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (err: any) => {
            const errorMessage = err?.response?.data?.message || err?.message || "An error occurred";
            console.log(errorMessage)
        }
    })
}
