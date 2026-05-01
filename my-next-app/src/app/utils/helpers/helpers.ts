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
    if (!estimatedTime) return requestedTime || '';

    const estimateMinutes = parseInt(estimatedTime) || 0;
    let baseTime: Date;

    // ASAP orders might send "ASAP" string
    if (requestedTime === 'ASAP' || !requestedTime || requestedTime === 'custom time') {
        baseTime = createdAt ? new Date(createdAt) : new Date();
        // Add the initial 10-minute system buffer for ASAP orders
        baseTime.setMinutes(baseTime.getMinutes() + 10);
    } else if (requestedTime.includes(':')) {
        const [hours, minutes] = requestedTime.split(':').map(Number);
        baseTime = new Date(); // Start with today's date
        if (!isNaN(hours) && !isNaN(minutes)) {
            baseTime.setHours(hours, minutes, 0, 0);
        } else {
            baseTime = createdAt ? new Date(createdAt) : new Date();
        }
    } else {
        baseTime = createdAt ? new Date(createdAt) : new Date();
    }

    baseTime.setMinutes(baseTime.getMinutes() + estimateMinutes);

    const hh = String(baseTime.getHours()).padStart(2, '0');
    const mm = String(baseTime.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
}

export function isRestaurantOpen(openHours: any): boolean {
    if (!openHours || Object.keys(openHours).length === 0) return false;

    const now = new Date();
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const currentDay = dayNames[now.getDay()];
    const hours = openHours[currentDay];

    if (!hours || !hours.start || !hours.end) return false; // Closed today or data is incomplete

    const [startH, startM] = hours.start.split(":").map(Number);
    const [endH, endM] = hours.end.split(":").map(Number);

    const currentH = now.getHours();
    const currentM = now.getMinutes();

    const currentTimeMinutes = currentH * 60 + currentM;
    const startTimeMinutes = startH * 60 + startM;
    const endTimeMinutes = endH * 60 + endM;

    return currentTimeMinutes >= startTimeMinutes && currentTimeMinutes <= endTimeMinutes;
}

export function getNextOpeningTime(openHours: any): { day: string, time: string } | null {
    if (!openHours || Object.keys(openHours).length === 0) return null;

    const now = new Date();
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const currentDayIndex = now.getDay();

    // Check today first
    const todayHours = openHours[dayNames[currentDayIndex]];
    if (todayHours && todayHours.start) {
        const [startH, startM] = todayHours.start.split(":").map(Number);
        const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();
        const startTimeMinutes = startH * 60 + startM;

        if (currentTimeMinutes < startTimeMinutes) {
            return { day: "today", time: todayHours.start };
        }
    }

    // Check next 7 days
    for (let i = 1; i <= 7; i++) {
        const nextDayIndex = (currentDayIndex + i) % 7;
        const nextDayName = dayNames[nextDayIndex];
        const nextDayHours = openHours[nextDayName];

        if (nextDayHours && nextDayHours.start) {
            const dayLabel = i === 1 ? "tomorrow" : nextDayName.charAt(0).toUpperCase() + nextDayName.slice(1);
            return { day: dayLabel, time: nextDayHours.start };
        }
    }

    return null;
}

