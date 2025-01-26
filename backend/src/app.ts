import express from 'express';
import cors from 'cors';
import artworkRoutes from './routes/artworkRoutes';
import userRoutes from './routes/userRoutes';
import aiRoutes from './routes/aiRoutes'; // Import AI routes

const dotenv = require('dotenv'); // Use require instead of import
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Register routes
app.use('/api/artworks', artworkRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes); // Register AI routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});