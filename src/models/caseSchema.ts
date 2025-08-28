import mongoose, { Schema, model, Document } from "mongoose";

export interface ICase extends Document {
  type: "resolved" | "complaint" | "emergency";
  description: string;
  date: Date;
}

const caseSchema = new mongoose.Schema<ICase>({
  type: { type: String, enum: ["resolved", "complaint", "emergency"], required: true },
  description: { type: String },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const caseModel = mongoose.model<ICase>("Case", caseSchema);
export default caseModel;
