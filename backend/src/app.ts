import express from 'express';
import cors from 'cors';
import artworkRoutes from './routes/artworkRoutes';
import userRoutes from './routes/userRoutes';
import aiRoutes from './routes/aiRoutes'; // Import AI routes
import initializeSocketServer from './config/socketServer'; // Import socket server initialization
import eyeTrackingRoutes from './routes/eyeTrackingRoutes';
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// Register routes
app.use('/api/artworks', artworkRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes); // Register AI routes
app.use('/api/eye-tracking', eyeTrackingRoutes);

// Initialize the WebSocket server alongside the Express server
const server = new initializeSocketServer(app); // Initialize both WebSocket and Express server

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
