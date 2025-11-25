import { Types } from 'mongoose'

export interface ContactData {
    name: string;
    phone: string;
    email: string;
    address?: string;

}
export interface Ingredient {
    _id: string;
    name: string;
    cost: number;
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

export interface Product {
    _id: string;
    name: string;
    price: number;
    active?: boolean;
    ingredients?: Ingredient[];
    createdAt?: string;
    updatedAt?: string;
    restaurantId?: string;
}