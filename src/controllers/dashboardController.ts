import { Request, Response } from "express";
import caseModel from "../models/caseSchema";
import touristModel from "../models/touristSchema";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const currentYear = new Date().getFullYear();

    // Total tourists (this year)
    const totalTourists = await touristModel.countDocuments({
      date: { $gte: new Date(`${currentYear}-01-01`) }
    });

    const internationalTourists = await touristModel.countDocuments({ type: "international" });
    const localTourists = await touristModel.countDocuments({ type: "local" });
    const activeTourists = await touristModel.countDocuments({ status: "active" });

    // ✅ Gender Stats (normalized to lowercase)
    const genderStatsRaw = await touristModel.aggregate([
      {
        $group: {
          _id: { $toLower: "$gender" },  // normalize gender values
          count: { $sum: 1 }
        }
      }
    ]);

    const genderStats = genderStatsRaw.reduce(
      (acc: any, g: any) => {
        acc[g._id] = g.count;
        return acc;
      },
      { male: 0, female: 0, others: 0 }
    );

    // Monthly assistance stats
    const monthlyAssistance = await touristModel.aggregate([
      {
        $group: {
          _id: { month: { $month: "$date" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);

    // Last 5 active tourists
    const recentActiveTourists = await touristModel.find({ status: "active" })
      .sort({ createdAt: -1 })
      .limit(5);

    // Case stats
    const monthlyUpdates = {
      activeTourists,
      resolvedCase: await caseModel.countDocuments({ type: "resolved" }),
      complaints: await caseModel.countDocuments({ type: "complaint" }),
      emergencies: await caseModel.countDocuments({ type: "emergency" })
    };

    return res.status(200).json({
      totalTourists,
      internationalTourists,
      localTourists,
      activeTourists,
      genderStats,           // ✅ clean, no duplicate keys
      monthlyAssistance,
      recentActiveTourists,
      monthlyUpdates
    });

  } catch (error: any) {
    console.log("failed to fetch dashboard stats", error);
    return res.status(500).json({
      message: "Failed to fetch dashboard stats",
      error: error.message
    });
  }
};
