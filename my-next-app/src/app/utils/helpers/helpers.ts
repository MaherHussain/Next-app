export function PriceFormatter(price: number) {
    return (price).toLocaleString("da-DK", {
        style: "currency",
        currency: "DKK",
    })

}
export const getCartIdFromLocalStorage = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("cartId");
    }
    return null;
};