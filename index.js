// index.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import serverless from "serverless-http";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config();

const app = express();

// --- DB connect once (serverless reuses between invocations)
await connectDB();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Allow your FE origins (Vercel prod + previews + local dev)
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://intern-connect-fe.vercel.app",
    /\.vercel\.app$/, // preview deployments
  ],
  credentials: true,
};
app.use(cors(corsOptions));

// health/root
app.get("/", (req, res) => res.send("API OK"));
app.get("/home", (req, res) =>
  res.status(200).json({ message: "i am coming from backend", success: true })
);

// routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// IMPORTANT: no app.listen() on Vercel
// export a handler instead
export const handler = serverless(app);
export default (req, res) => handler(req, res);
