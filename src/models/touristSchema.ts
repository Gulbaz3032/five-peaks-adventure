import express from "express";
import mongoose from "mongoose";

export interface ITourists extends Document {
  name: string;
  email: string;
  password: string;
  country: string;
  gender: "male" | "female" | "others";
  type: "international" | "local";
  status: "active" | "inactive";
  date: Date;
  resetOtp: string | null;
  resetOtpExpires: Date | null;
  isOtpVerified: boolean;
  role: "admin" | "user";
}

const touristSchema = new mongoose.Schema<ITourists>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
      required: true,
    },
    type: {
      type: String,
      enum: ["international", "local"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    resetOtp: {
      type: String,
      default: null,
    },
    resetOtpExpires: {
      type: Date,
      default: null,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
     role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const touristModel = mongoose.model<ITourists>("Tourist", touristSchema);
export default touristModel;
