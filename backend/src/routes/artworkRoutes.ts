import express from 'express';
import {
  saveArtwork,
  getArtworksByUser,
  updateArtwork,
} from '../controllers/artworkController';

const router = express.Router();

// Save artwork
router.post('/', saveArtwork);

// Fetch artworks for a user
router.get('/user/:userId', getArtworksByUser);

// Update artwork
router.put('/:id', updateArtwork);

export default router;