import express from "express";
import { Request, Response } from "express";
import touristModel from "../models/touristSchema";
import { ITourists } from "../models/touristSchema";
import { transporter } from "../utils/emailSender";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

export const registerTourist = async (req: Request, res: Response) => {
  try {
    const { name, email, password, country, gender, type, status, date, role } =
      req.body;
    if (!name || !email || !password || !country || !gender || !role) {
      return res.status(400).json({
        message: "all fields are required",
      });
    }

    const existingUser = await touristModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "The user already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new touristModel({
      name,
      email,
      password: hashedPassword,
      country,
      gender,
      type,
      status,
      date,
      role,
    });
    await newUser.save();

    return res.status(201).json({
      message: "User created successfully",
      newUser,
    });
  } catch (error: any) {
    console.log("Failed to register tourist, Server error", error);
    return res.status(500).json({
      message: "Failed to register Tourist, Server error",
      error: error.message,
    });
  }
};

export const getTourist = async (req: Request, res: Response) => {
  try {
    const tourist = await touristModel.find();
    if (!tourist) {
      return res.status(404).json({
        message: "tourist are not found",
      });
    }

    return res.status(200).json({
      message: "Successully get data",
      tourist,
    });
  } catch (error: any) {
    console.log("Failed to get tourist, Server error", error);
    return res.status(500).json({
      message: "Failed to get Tourist, Server Error",
      error: error.message,
    });
  }
};

export const getSingleTourist = async (req: Request, res: Response) => {
  try {
    const touristId = req.params.id;
    const tourist = await touristModel.findById(touristId);
    if (!tourist) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Successfully retrived the user",
      tourist,
    });
  } catch (error: any) {
    console.log("faild to get single user server error ", error);
    return res.status(500).json({
      message: "Failed to get single user server error",
      error: error.message,
    });
  }
};

export const updateTourist = async (req: Request, res: Response) => {
  try {
    const touristId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(touristId)) {
      return res.status(400).json({
        message: "Invalid Tourist id",
      });
    }

    const { name, email, password, country, gender, type, status, date } =
      req.body;
    const updateFields: any = {};

    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }
    if (country) updateFields.country = country;
    if (gender) updateFields.gender = gender;
    if (type) updateFields.type = type;
    if (status) updateFields.status = status;
    if (date) updateFields.date = date;

    const updateTourist = await touristModel.findByIdAndUpdate(
      touristId,
      updateFields,
      { new: true }
    );

    if (!updateTourist) {
      return res.status(400).json({
        message: "Failed to update the user",
      });
    }

    return res.status(200).json({
      message: "Updated successfully",
      updateTourist,
    });
  } catch (error: any) {
    console.error("Failed to update the user, Server error:", error);
    return res.status(500).json({
      message: "Failed to update the tourist, server error",
      error: error.message,
    });
  }
};

export const deleteTourist = async (req: Request, res: Response) => {
  try {
    const touristId = req.params.id;
    const tourist = await touristModel.findByIdAndDelete(touristId);
    if (!tourist) {
      return res.status(404).json({
        message: "Tourist not found",
      });
    }

    return res.status(200).json({
      message: "User delete successfully",
      tourist,
    });
  } catch (error: any) {
    console.log("Failed to delete, Server error", error);
    return res.status(500).json({
      message: "Failed to delete the user, Server error",
      error: error.message,
    });
  }
};
export const loginTourist = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const tourist = await touristModel.findOne({ email });
    if (!tourist) {
      return res.status(404).json({
        message: "User not found with this email",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, tourist.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { userId: tourist._id, email: tourist.email, role: tourist.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "5h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      tourist,
    });
  } catch (error: any) {
    console.error("Failed to login, server error:", error);
    return res.status(500).json({
      message: "Failed to login. Server error.",
      error: error.message,
    });
  }
};

export const forgetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await touristModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expire = new Date(Date.now() + 10 * 60 * 1000); // which means otp is for 10min

    user.resetOtp = otp;
    user.resetOtpExpires = expire;
    await user.save();

    await transporter.sendMail({
      to: email,
      subject: "Password Reset OTP",
      text: `YOUR OTP IS ${otp}`,
    });

    return res.status(200).json({
      message: "OTP is successfully sent to your email",
    });
  } catch (error: any) {
    console.log("Failed to forget password, server error", error);
    return res.status(500).json({
      message: "Faild to forget password, Server error",
      error: error.message,
    });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await touristModel.findOne({ email });
    if (!user || user.resetOtp !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isOtpVerified = true;
    user.resetOtp = null;
    user.resetOtpExpires = null;

    await user.save();

    return res.status(200).json({
      message: "Successfully verify the otp",
    });
  } catch (error: any) {
    console.log("Failed to verfiyOTP, server error", error);
    return res.status(500).json({
      message: "Failed to verfiyOTP, server error",
      error: error.message,
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;
    const user = await touristModel.findOne({ email });
    if (!user || !user.isOtpVerified) {
      return res.status(404).json({
        messsage: "OTP verification required",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.isOtpVerified = false;
    await user.save();

    return res.status(200).json({
      message: "Password Reset Successfully",
    });
  } catch (error: any) {
    console.log("Failed to reset password, server error", error);
    return res.status(500).json({
      message: "Failed to reset password, Server error",
      error: error.message,
    });
  }
};

