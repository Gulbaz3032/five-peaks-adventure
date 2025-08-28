import express, { Request, Response } from "express";
import adminModel from "../models/adminSchema";
import { IAdmin } from "../models/adminSchema";

export const createAdmin = async (req: Request, res: Response) => {
    try {
        const {
            orderDate,
            time,
            vehicleNumber,
            totalPassengers,
            numberOfFemales,
            numberOfMales,
            vehicleWithPassengers,
            vehicleWithGoods,
            typeOfGoods
        }: IAdmin = req.body;  

        const profileImage = req.file ? req.file.filename : "";

        const user = new adminModel({
            orderDate,
            time,
            vehicleNumber,
            profileImage,
            totalPassengers,
            numberOfFemales,
            numberOfMales,
            vehicleWithPassengers,
            vehicleWithGoods,
            typeOfGoods
        });

        await user.save();

        return res.status(201).json({
            message: "Data saved successfully",
            data: user
        });

    } catch (error: any) {
        console.error("Failed to create, Server error", error);
        return res.status(400).json({
            message: "Failed to create Admin, server error",
            error: error.message
        });
    }
};

export const getAllAdmins = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page -1) * limit;

        const users = await adminModel.find()
        .skip(skip)
        .limit(limit);

        const totalUsers = await adminModel.countDocuments();

        if (!users || users.length === 0) {
            return res.status(404).json({
                message: "No admin records found"
            });
        }

        return res.status(200).json({
            message: "Data retrieved successfully",
            users,
            pagination: {
                totalUsers,
                currentPage: page,
                totalPages: Math.ceil(totalUsers / limit),
                limit
            }
        });
    } catch (error: any) {
        console.error("Server error, failed to get admins", error);
        return res.status(500).json({
            message: "Failed to get admin records, server error",
            error: error.message
        });
    }
};

export const updateAdmin = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const updatedData = req.body;

        // If a new image is uploaded, set profileImage field
        if (req.file) {
            updatedData.profileImage = req.file.filename;
        }

        const updatedUser = await adminModel.findByIdAndUpdate(
            id,
            updatedData,
            {
                new: true,         // Return updated document
                runValidators: true // Validate before updating
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        return res.status(200).json({
            message: "Admin updated successfully",
            data: updatedUser
        });
    } catch (error: any) {
        console.error("Failed to update admin", error);
        return res.status(500).json({
            message: "Server error, failed to update admin",
            error: error.message
        });
    }
};


export const deleteAdmin = async (req: Request, res: Response) => {
    try {
        const user = req.params.id;
        const newUser = await adminModel.findByIdAndDelete(user);
        if(!newUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User deleted successfully",
            newUser
        })
    } catch (error) {
        return res.status(500).json({
            message: "failed to delete the data, server error",
            error
        })
    }
}
