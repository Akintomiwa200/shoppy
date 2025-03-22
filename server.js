const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = require("./app");
const swaggerDocs = require("./swagger");

dotenv.config();
connectDB();

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Attach io to requests
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Setup Swagger Docs
swaggerDocs(app);

// WebSocket Connection Handling
io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port https://localhost:${PORT}`);
});
