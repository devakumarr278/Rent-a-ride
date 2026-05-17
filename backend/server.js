import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from './routes/adminRoute.js'
import vendorRoute from './routes/venderRoute.js'
import cors from 'cors'
import cookieParser from "cookie-parser";
import { cloudinaryConfig } from "./utils/cloudinaryConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });
const port = process.env.PORT || 3000;
const mongoUri = process.env.mongo_uri || process.env.MONGO_URI;

const App = express();

App.use(express.json());
App.use(cookieParser());

if (!mongoUri) {
  console.error("Missing mongo_uri in backend/.env");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("connected");
    const server = App.listen(port, () => {
      console.log(`server listening on port ${port}!`);
    });

    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Kill the process using the port or set a different PORT in .env`);
        process.exit(1);
      }
      console.error('Server error:', err);
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  });

const allowedOrigins = [
  'https://rent-a-ride-two.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
]; // Add allowed origins here

App.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
    credentials: true, // Enables the Access-Control-Allow-Credentials header
  })
);


App.use('*', cloudinaryConfig);

// App.get('/*', (req, res) => res.sendFile(resolve(__dirname, '../public/index.html')));


App.use("/api/user", userRoute);
App.use("/api/auth", authRoute);
App.use("/api/admin",adminRoute);
App.use("/api/vendor",vendorRoute)



App.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  return res.status(statusCode).json({
    succes: false,
    message,
    statusCode,
  });
});
