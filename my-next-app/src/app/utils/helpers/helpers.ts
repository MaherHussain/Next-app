export function PriceFormatter(price: number) {
    if (price) {
        return (price).toLocaleString("da-DK", {
            style: "currency",
            currency: "DKK",
        })
    }


}
export const getCartIdFromLocalStorage = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("cartId");
    }
    return null;
};

export function generateTimeOptions(intervalMinutes: number, opening: string, closing: string): string[] {
    const now = new Date();
    const [openH, openM] = opening.split(":").map(Number)
    const [closeH, closeM] = closing.split(":").map(Number)

    const openTime = new Date()
    openTime.setHours(openH, openM, 0, 0)

    const closeTime = new Date()

    closeTime.setHours(closeH, closeM, 0, 0)
    const startTime = now > openTime ? now : openTime

    const times: string[] = []
    const current = new Date(startTime)

    // Round to next 5-min mark
    current.setMinutes(Math.ceil(current.getMinutes() / intervalMinutes) * intervalMinutes);
    current.setSeconds(0);
    current.setMilliseconds(0);

    while (current <= closeTime) {
        const hh = String(current.getHours()).padStart(2, "0");
        const mm = String(current.getMinutes()).padStart(2, "0");
        times.push(`${hh}:${mm}`);
        current.setMinutes(current.getMinutes() + intervalMinutes)
    }

    return times;
}