import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IProduct extends Document {
    name: string,
    price: number,
    restaurantId: mongoose.Types.ObjectId,
    active?: boolean,
    category?: string,
    description?: string,
    imageUrl?: string,
    ingredients: mongoose.Types.ObjectId[];
}

const ProductSchema: Schema<IProduct> = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
    active: { type: Boolean, default: true },
    category: { type: String },
    description: { type: String },
    imageUrl: { type: String },
    ingredients: [{ type: Schema.Types.ObjectId, ref: 'Ingredient' }],
}, { timestamps: true })

export default (mongoose.models.Product as Model<IProduct>) ||
    mongoose.model<IProduct>("Product", ProductSchema);