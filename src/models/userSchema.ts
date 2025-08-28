import mongoose, { Schema, Document } from "mongoose";

export interface IPersonalInfo extends Document {
  fullName: string;
  position: string;
  mobile: string;
  email: string;
  currentAddress: string;
  permanentAddress: string;
  cnic: string;
}

const userSchema: Schema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    currentAddress: {
      type: String,
      required: true,
      trim: true,
    },
    permanentAddress: {
      type: String,
      required: true,
      trim: true,
    },
    cnic: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const PersonalInfoModel = mongoose.model<IPersonalInfo>(
  "PersonalInfo",
  userSchema
);

export default PersonalInfoModel;
