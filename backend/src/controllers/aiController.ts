import { Request, Response } from 'express';
import { generateImageFromPrompt } from '../services/aiService';

export const generateImage = async (req: Request, res: Response) => {
  const { prompt } = req.body;
  try {
    const imageUrl = await generateImageFromPrompt(prompt);
    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate image' });
  }
};