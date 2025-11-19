import mongoose, { Schema, Document, Model } from "mongoose";

export interface IIngredientGroup extends Document {
    name: string;
    ingredients: [{ type: Schema.Types.ObjectId, ref: 'Ingredient' }];
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant' };
}

const ingredientGroupSchema = new Schema<IIngredientGroup>({
    name: { type: String, required: true },
    ingredients: [{ type: Schema.Types.ObjectId, ref: 'Ingredient', default: [], required: true }],
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
}, {
    timestamps: true,
});

const IngredientGroup: Model<IIngredientGroup> = mongoose.models.IngredientGroup || mongoose.model("IngredientGroup", ingredientGroupSchema);

export default IngredientGroup;
