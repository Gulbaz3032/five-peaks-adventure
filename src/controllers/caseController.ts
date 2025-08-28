import { Request, Response } from "express";
import caseModel, { ICase } from "../models/caseSchema";
import mongoose from "mongoose";

// Create a new Case
export const createCase = async (req: Request, res: Response) => {
  try {
    const { type, description, date } = req.body;

    if (!type) {
      return res.status(400).json({ message: "Case type is required" });
    }

    const newCase = new caseModel({
      type,
      description,
      date,
    });

    await newCase.save();

    return res.status(201).json({
      message: "Case created successfully",
      case: newCase,
    });
  } catch (error: any) {
    console.error("Failed to create case", error);
    return res.status(500).json({
      message: "Failed to create case",
      error: error.message,
    });
  }
};

// Get all cases
export const getCases = async (req: Request, res: Response) => {
  try {
    const cases = await caseModel.find().sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Cases retrieved successfully",
      cases,
    });
  } catch (error: any) {
    console.error("Failed to fetch cases", error);
    return res.status(500).json({
      message: "Failed to fetch cases",
      error: error.message,
    });
  }
};

// Get single case by ID
export const getCaseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Case ID" });
    }

    const foundCase = await caseModel.findById(id);

    if (!foundCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    return res.status(200).json({
      message: "Case retrieved successfully",
      case: foundCase,
    });
  } catch (error: any) {
    console.error("Failed to fetch case by ID", error);
    return res.status(500).json({
      message: "Failed to fetch case",
      error: error.message,
    });
  }
};

// Update case
export const updateCase = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Case ID" });
    }

    const updatedCase = await caseModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    return res.status(200).json({
      message: "Case updated successfully",
      case: updatedCase,
    });
  } catch (error: any) {
    console.error("Failed to update case", error);
    return res.status(500).json({
      message: "Failed to update case",
      error: error.message,
    });
  }
};

// Delete case
export const deleteCase = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Case ID" });
    }

    const deletedCase = await caseModel.findByIdAndDelete(id);

    if (!deletedCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    return res.status(200).json({
      message: "Case deleted successfully",
      case: deletedCase,
    });
  } catch (error: any) {
    console.error("Failed to delete case", error);
    return res.status(500).json({
      message: "Failed to delete case",
      error: error.message,
    });
  }
};
