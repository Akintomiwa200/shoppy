// const http = require("http");
// const { Server } = require("socket.io");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const app = require("./app");
// const swaggerDocs = require("./swagger");

// dotenv.config();
// connectDB();

// const server = http.createServer(app);
// const io = new Server(server, { cors: { origin: "*" } });

// // Attach io to requests
// app.use((req, res, next) => {
//     req.io = io;
//     next();
// });

// // Setup Swagger Docs
// swaggerDocs(app);

// // WebSocket Connection Handling
// io.on("connection", (socket) => {
//     console.log("New client connected");

//     socket.on("disconnect", () => {
//         console.log("Client disconnected");
//     });
// });

// // Start Server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//     console.log(`Server running on port https://localhost:${PORT}`);
// });




const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = require("./app");
const swaggerDocs = require("./swagger");

dotenv.config();
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "*"], // Replace with your frontend URLs
        methods: ["GET", "POST",  "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    },
});

// Attach io to requests for real-time updates
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Setup Swagger Docs
swaggerDocs(app);

// WebSocket Connection Handling
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Example: Emit a real-time update
    socket.emit("welcome", { message: "Welcome to the WebSocket server!" });

    // Example: Listen for a custom event
    socket.on("updateData", (data) => {
        console.log("Received updateData:", data);

        // Broadcast the update to all connected clients
        io.emit("dataUpdated", data);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
