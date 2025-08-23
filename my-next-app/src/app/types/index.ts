import { Types } from 'mongoose'

export interface ContactData {
    name: string;
    phone: string;
    email: string;
    address?: string;

}
export interface Item {
    product: { id: Types.ObjectId, name: string, price: number }
    ingredients?: {
        drissing?: string[],
        fravaelge?: string[],
        smorelse?: string[],

    },
    quantity: number
}
export interface PickupData {
    contactData: ContactData | null;
    selectedTime: string | null;
    orderMethod: string | null;
    paymentMethod: string | null;
};
export interface Order {
    _id: string;
    orderNumber: string;
    items: Item[];
    contactData: ContactData | null;
    selectedTime: string;
    paymentMethod: string;
    total: number;
    orderMethod: string;
    status: string;
    createdAt?: string;
    estimatedTime?: string | number; // Optional, can be a string or number
    // Add more fields as needed
}