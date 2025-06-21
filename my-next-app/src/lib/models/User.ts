
import mongoose, { Schema, Document, Model } from "mongoose";

const baseOptions = {
    discrimintorKey: 'role',
    collection: 'users'
}
export interface IUser extends Document {
    name: string;
    email: string;
    password: string
    phone: string,
    address?: string,
}

const UserSchema: Schema<IUser> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
});

export default (mongoose.models.User as Model<IUser>) ||
    mongoose.model<IUser>("User", UserSchema);