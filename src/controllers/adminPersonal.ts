import express from "express";
import adminPersonal from "../models/adminPersonal";
import { Request, Response } from "express";
import mongoose from "mongoose";

import { IPersonalInfo } from "../models/adminPersonal";

export const createPerson = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      position,
      mobile,
      email,
      currentAddress,
      permanentAddress,
      cnic,
    } = req.body;
    if (
      !fullName ||
      !position ||
      !mobile ||
      !email ||
      !currentAddress ||
      !permanentAddress ||
      !cnic
    ) {
      return res.status(400).json({
        message: "Fields are required",
      });
    }

    const existingAdmin = await adminPersonal.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        message: "the user alreay exist",
      });
    }

    const createUser = new adminPersonal({
      fullName,
      position,
      mobile,
      email,
      currentAddress,
      permanentAddress,
      cnic,
    });
    await createUser.save();

    return res.status(201).json({
      message: "Admin person created successfully",
      createUser,
    });
  } catch (error: any) {
    console.log("failed to create admin person, Server errror", error);
    return res.status(500).json({
      message: "Failed to create admin person, server error",
      error: error.message,
    });
  }
};

export const getSinglePerson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const user = await adminPersonal.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Successfully got the user",
      user,
    });
  } catch (error: any) {
    console.log("Failed to get data, server error", error);
    return res.status(500).json({
      message: "Failed to get admin person data, server error",
      error: error.message,
    });
  }
};

export const getAllPerson = async (req: Request, res: Response) => {
  try {
    const user = await adminPersonal.find();
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    return res.status(200).json({
      message: "Successfully get the user",
      user,
    });
  } catch (error: any) {
    console.log("Failed to get all user", error);
    return res.status(500).json({
      message: "Failed to get all user, server error",
      error: error.message,
    });
  }
};

export const updatePerson = async (req: Request, res: Response) => {
  try {
    const adminPersonId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(adminPersonId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const {
      fullName,
      position,
      mobile,
      email,
      currentAddress,
      permanentAddress,
      cnic,
    } = req.body;

    const updateFields: any = {};

    if (fullName) updateFields.fullName = fullName;
    if (position) updateFields.position = position;
    if (mobile) updateFields.mobile = mobile;
    if (email) updateFields.email = email;
    if (currentAddress) updateFields.currentAddress = currentAddress;
    if (permanentAddress) updateFields.permanentAddress = permanentAddress;
    if (cnic) updateFields.cnic = cnic;

    const updatedPerson = await adminPersonal.findByIdAndUpdate(
      adminPersonId,
      updateFields,
      { new: true }
    );

    if (!updatedPerson) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Person updated successfully",
      updatedPerson,
    });
  } catch (error: any) {
    console.log("Failed to update the user, server error", error);
    return res.status(500).json({
      message: "Failed to update the person, server error",
      error: error.message,
    });
  }
};


export const deletePerson = async (req: Request, res: Response) => {
    try {
        const user= req.params.id;
        const userId = await adminPersonal.findByIdAndDelete(user);
        if(!userId) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User deleted successfully",
            userId
        });

    } catch (error : any) {
        console.log("Failed to delete the user", error);
        return res.status(500).json({
            message: "failed to delte the person, server error",
            error: error.message
        });
    }
}
