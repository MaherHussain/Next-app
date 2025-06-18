import { Schema, model, models, Document, Types } from "mongoose";
import { Item } from "@/app/types";

export interface ICart extends Document {
    cartId: string,
    total: number,
    items: Item[]
}

export const itemSchema = new Schema<Item>(
    {
        product: {
            id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            name: { type: String },
            price: { type: Number }
        },
        quantity: { type: Schema.Types.Mixed, required: true },
        ingredients: {
            drissing: [{ type: String }],
            fravaelge: [{ type: String }],
            smorelse: [{ type: String }],
        },
    },
    { _id: false }
);
const cartSchema: Schema<ICart> | null = new Schema({
    cartId: { type: String, unique: true, required: true },
    total: { type: Number, default: 0 },
    items: [itemSchema]

}, { timestamps: true })

// Pre-save middleware to calculate total
cartSchema.pre('save', function (next) {
    const cart = this as ICart;

    cart.total = cart.items.reduce((sum, item) => {
        const itemTotal = (item.product.price || 0) * (item.quantity || 0);
        return sum + itemTotal;
    }, 0);

    next();
});
const Cart = models.Cart || model<ICart>('Cart', cartSchema);
export default Cart;