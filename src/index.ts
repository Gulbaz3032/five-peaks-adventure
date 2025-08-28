
  import express from "express";
  import dotenv from "dotenv";
  import session from "express-session";
  import passport from "./auth/googleStrategy";

  // Database Connection
  import { dbConnect } from "./utils/db";

  // Routes
  import dashboardRoutes from "./routes/dashboardRoutes";
  import touristRoutes from "./routes/touristRoutes";
  import adminRoutes from "./routes/adminRoutes";
  import adminPersonRoutes from "./routes/adminPersonRoutes";
  import caseRoutes from "./routes/caseRoutes";
  import googleRoutes from "./routes/googleRoutes";

import adminTouristRoutes from "./routes/adminTouristRoutes";



  dotenv.config();


  const app = express();
  dbConnect();


  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Session Setup
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "mysecret", // Better use env variable
      resave: false,
      saveUninitialized: true,
    })
  );

  // Passport Setup
  app.use(passport.initialize());
  app.use(passport.session());


  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/tourist", touristRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/admin-person", adminPersonRoutes);
  app.use("/api/case", caseRoutes);
  app.use("/auth", googleRoutes);

  app.use("/api/admin/tourist", adminTouristRoutes);

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
  });
