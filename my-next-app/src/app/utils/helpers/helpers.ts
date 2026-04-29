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

export function currentTimeRounded() {

    const now = new Date();
    now.setMinutes(now.getMinutes() + 10);

    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
}
export function dateFormatter(iso: string) {
    const date = new Date(iso);
    const pad = (n: number) => n.toString().padStart(2, "0");
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export function calculateFinalPickupTime(requestedTime: string, estimatedTime: string, createdAt?: string) {
    if (!estimatedTime || estimatedTime === 'ASAP') return requestedTime || 'ASAP';

    const estimateMinutes = parseInt(estimatedTime) || 0;
    let baseTime = new Date();

    if (requestedTime && requestedTime !== 'ASAP' && requestedTime !== 'custom time' && requestedTime.includes(':')) {
        const [hours, minutes] = requestedTime.split(':').map(Number);
        if (!isNaN(hours) && !isNaN(minutes)) {
            baseTime.setHours(hours, minutes, 0, 0);
        }
    } else if (createdAt) {
        baseTime = new Date(createdAt);
    }

    baseTime.setMinutes(baseTime.getMinutes() + estimateMinutes);
    return baseTime.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
}
