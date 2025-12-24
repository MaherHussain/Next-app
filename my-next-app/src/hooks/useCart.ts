import { useEffect, useState } from 'react';
import { nanoid } from "nanoid";
import { useGetCartById } from '@/app/queries/cart';

export const useCart = () => {
    const [cartId, setCartId] = useState<string>('');

    const { data } = useGetCartById(cartId ?? "")
    let items = []
    let total = 0

    if (data) {
        items = data?.items
        total = data?.total
    }
    useEffect(() => {
        let stored = localStorage.getItem('cartId');
        if (!stored) {
            stored = nanoid();
            localStorage.setItem('cartId', stored);
        }
        setCartId(stored);


    }, []);

    return { cartId, items, total };
};
