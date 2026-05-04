import mongoose, { Schema, Document, Model, Types } from "mongoose";

interface IPartner extends Document {
    restaurantId: Types.ObjectId,
    partnerName: string,
    phone: string,
    email: string,
    password: string,
    resetPasswordToken?: string,
    resetPasswordExpires?: Date,
}

const PartnerSchema: Schema<IPartner> = new Schema({
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    partnerName: { type: String, required: true },
    phone: {
        type: String, validate: {
            validator: (v: string): boolean => /\d{10}/.test(v),
            message: 'Phone number should be 10-digits number'
        }
    },
    email: {
        type: String, required: true, unique: true, validate: {
            validator: (v: string): boolean => /\S+@\S+\.\S+/.test(v),
            message: 'Email is not valid',
        }
    },
    password: { type: String, required: true, },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
}, { timestamps: true, strict: false })
export default (mongoose.models.Partner as Model<IPartner>) ||
    mongoose.model<IPartner>("Partner", PartnerSchema);