import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
    name: string,
    price: number
}

const PrdoductSchema: Schema<IProduct> = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true }
}, { timestamps: true })

export default (mongoose.models.Product as Model<IProduct>) ||
    mongoose.model<IProduct>("Product", PrdoductSchema);