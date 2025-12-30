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
export interface IngredientsGroup {
    _id: string
    ingredients: Ingredient[]
    name: string
}
export interface CartItem {
    product: { id: string, name: string, price: number }
    ingredients?: Record<string, Ingredient[]>,  // Dynamic group names -> arrays of ingredient objects
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