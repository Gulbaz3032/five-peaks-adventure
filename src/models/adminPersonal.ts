import mongoose, { Schema, model, Document } from "mongoose";

export interface IPersonalInfo extends Document {
  fullName: string;
  position: string;
  mobile: string;
  email: string;
  currentAddress: string;
  permanentAddress: string;
  cnic: string;
}

const PersonalInfoSchema = new Schema<IPersonalInfo>({
  fullName: { type: String, required: true },
  position: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  currentAddress: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  cnic: { type: String, required: true, unique: true }
});

const adminPersonal = mongoose.model<IPersonalInfo>("PersonalInfo", PersonalInfoSchema)
export default adminPersonal;
