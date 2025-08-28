import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  googleId: string;
  fullName: string;
  email: string;
  avatar?: string;
  accessToken?: string;   // add this if you want to store Google access token
}

const userSchema: Schema<IUser> = new Schema(
  {
    googleId: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String },
    accessToken: { type: String }, // ✅ correctly defined here
  },
  { timestamps: true }
);

const googleModel = mongoose.model<IUser>("GoogleUser", userSchema);

export default googleModel;
