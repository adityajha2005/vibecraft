import express from 'express';
import { generateImage } from '../controllers/aiController';

const router = express.Router();

// Generate image from prompt
router.post('/generate', generateImage);

export default router;