
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string
}

const UserSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

export default (mongoose.models.User as Model<IUser>) ||
    mongoose.model<IUser>("User", UserSchema);