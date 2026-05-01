import mongoose, { Schema, Document, Model, Types } from "mongoose";

// this model called restaurant is to manage the data of shop/store
// each partner could have one or more restaurants
interface IRestaurant extends Document {
    name: string,
    address: string,
    openHours?: {
        monday: { start: string, end: string } | null,
        tuesday: { start: string, end: string } | null,
        wednesday: { start: string, end: string } | null,
        thursday: { start: string, end: string } | null,
        friday: { start: string, end: string } | null,
        saturday: { start: string, end: string } | null,
        sunday: { start: string, end: string } | null // null because could be closed
    },
    logo?: string,
    cvrNumber?: number,
    partnerId?: Types.ObjectId,
}

const RestaurantSchema = new Schema<IRestaurant>({
    name: { type: String, unique: true, required: true },
    address: { type: String, unique: true },
    openHours: {
        monday: { start: { type: String }, end: { type: String } },
        tuesday: { start: { type: String }, end: { type: String } },
        wednesday: { start: { type: String }, end: { type: String } },
        thursday: { start: { type: String }, end: { type: String } },
        friday: { start: { type: String }, end: { type: String } },
        saturday: { start: { type: String }, end: { type: String } },
        sunday: { start: { type: String }, end: { type: String } },
    },
    logo: { type: String },
    cvrNumber: { type: Number },
    partnerId: { type: Schema.Types.ObjectId, ref: 'Partner' },
}, { timestamps: true, strict: false })

export default (mongoose.models.Restaurant as Model<IRestaurant>) ||
    mongoose.model<IRestaurant>("Restaurant", RestaurantSchema);