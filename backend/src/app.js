import express from "express";
import { createServer } from "node:http";

import { Server } from "socket.io";

import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";

import cors from "cors";

import userRoutes from "./routes/users.routes.js";
import aiRoutes from "./routes/ai.routes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);


app.set("port", (process.env.PORT || 8000))
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ["https://videoxplatform.netlify.app", "https://videoxplatform.netlify.app"]
        : ["http://localhost:3000", "http://localhost:3001"],
    credentials: true
}));
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));


app.use("/api/v1/users", userRoutes);
app.use("/api/ai", aiRoutes);

const start = async () => {
    const mongoURI = process.env.MONGODB_URI || "mongodb+srv://imdigitalashish:imdigitalashish@cluster0.cujabk4.mongodb.net/"
    const connectionDb = await mongoose.connect(mongoURI)

    console.log(`MONGO Connected DB HOst: ${connectionDb.connection.host}`)
    server.listen(app.get("port"), () => {
        console.log(`LISTENING ON PORT ${app.get("port")}`)
    });
}



start();