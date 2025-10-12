import { Schema, model, models, Document, Types } from "mongoose";
import { itemSchema } from "./Cart";
import { ContactData, Item } from "@/app/types";

export interface IOrder extends Document {
    orderNumber: string
    items: Item[]
    contactData: ContactData
    selectedTime: string
    estimatedTime: string
    orderMethod: string
    paymentMethod: string
    total: number
    status: string
    restaurantId: Types.ObjectId
}
// Counter schema for order number auto-increment
const CounterSchema = new Schema({
    _id: { type: String, required: true },
    value: { type: Number, required: true }
});

const Counter = models.Counter || model('Counter', CounterSchema);


const orderSchema: Schema<IOrder> | null = new Schema({
    orderNumber: { type: String, required: true, unique: true },
    items: [itemSchema],
    total: { type: Number, default: 0 },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    contactData: {
        name: {
            type: String, required: true,
        },
        phone: {
            type: String, required: true, validate: {
                validator: (v: string): boolean => /\d{10}/.test(v),
                message: 'Phone number should be 10-digits nmber'
            }
        },
        email: {
            type: String, required: true, validate: {
                validator: (v: string): boolean => /\S+@\S+\.\S+/.test(v),
                message: 'Email is not valid',
            }
        },
        address: { type: String }
    },
    selectedTime: { type: String },
    estimatedTime: { type: String },
    paymentMethod: { type: String, enum: ["card", "cash", "paypal"], required: true, default: "cash" },
    orderMethod: { type: String, enum: ["delivery", "pickup"], required: true, default: "pickup" },
    status: { type: String, enum: ['pending', "confirmed", "rejected", "new"], default: "new" }
}, { timestamps: true })

orderSchema.pre('validate', async function (next) {
    if (!this.orderNumber) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { _id: "order" },
                { $inc: { value: 1 } },
                { new: true, upsert: true }
            );

            this.orderNumber = `#${String(counter.value).padStart(4, "0")}`;
            next();
        } catch (err: any) {
            return next(err);
        }

    }
    else {
        next();
    }
})

const Order = models.Order || model<IOrder>('Order', orderSchema)
export default Order