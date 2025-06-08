import { useEffect, useState } from 'react';
import { nanoid } from "nanoid";
export const useCartId = () => {
    const [cartId, setCartId] = useState<string | null>(null);

    useEffect(() => {
        let stored = localStorage.getItem('cartId');
        if (!stored) {
            stored = nanoid();
            localStorage.setItem('cartId', stored);
        }
        setCartId(stored);
    }, []);

    return cartId;
};