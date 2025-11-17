import mongoose, { Schema, Document, Model } from "mongoose";

export interface  IIngredient extends Document {
    name:string
    cost?: number 
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
}

const IngredientSchema :Schema<IIngredient> = new Schema ({
name: {type : String, required: true},
cost: {type: Number},
restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true }
}, { timestamps: true })

export default (mongoose.models.Ingredient as Model<IIngredient>) ||
    mongoose.model<IIngredient>("Ingredient", IngredientSchema);