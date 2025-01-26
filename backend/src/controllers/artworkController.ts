import { Request, Response } from 'express';
import prisma from '../config/database';

// Save generated artwork
export const saveArtwork = async (req: Request, res: Response) => {
  const { title, image, userId } = req.body;
  try {
    const artwork = await prisma.artwork.create({
      data: { title, image, userId },
    });
    res.status(201).json(artwork);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save artwork' });
  }
};

// Fetch all artworks for a user
export const getArtworksByUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const artworks = await prisma.artwork.findMany({
      where: { userId },
    });
    res.status(200).json(artworks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch artworks' });
  }
};

// Update artwork
export const updateArtwork = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, image, userId, enhancedImage, variations } = req.body;
  
    try {
      const artwork = await prisma.artwork.update({
        where: { id },
        data: { title, image, userId, enhancedImage, variations },
      });
      res.status(200).json(artwork);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update artwork' });
    }
  };
export const createArtwork = async (req: Request, res: Response) => {
  const { title, image, userId, enhancedImage, variations } = req.body;

  try {
    const artwork = await prisma.artwork.create({
      data: {
        title,
        image,
        userId,
        enhancedImage, // Optional field
        variations,   // Optional field
      },
    });
    res.status(201).json(artwork);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create artwork' });
  }
};