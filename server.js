import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";
import swaggerDocs from "./swagger.js";

dotenv.config();
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "*"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    },
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

swaggerDocs(app);

io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.emit("welcome", { message: "Welcome to the WebSocket server!" });

    socket.on("updateData", (data) => {
        console.log("Received updateData:", data);
        io.emit("dataUpdated", data);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});