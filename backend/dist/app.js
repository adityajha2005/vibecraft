"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const artworkRoutes_1 = __importDefault(require("./routes/artworkRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes")); // Import AI routes
const socketServer_1 = __importDefault(require("./config/socketServer")); // Import socket server initialization
const eyeTrackingRoutes_1 = __importDefault(require("./routes/eyeTrackingRoutes"));
const dotenv = require('dotenv');
dotenv.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "*" }));
app.use(express_1.default.json());
// Register routes
app.use('/api/artworks', artworkRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/ai', aiRoutes_1.default); // Register AI routes
app.use('/api/eye-tracking', eyeTrackingRoutes_1.default);
// Initialize the WebSocket server alongside the Express server
const server = new socketServer_1.default(app); // Initialize both WebSocket and Express server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
