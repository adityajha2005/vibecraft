import express from 'express';
import { createUser, getUser } from '../controllers/userController'; // Correct import

const router = express.Router();

// Define routes
router.post('/', createUser); // Create a new user
router.get('/:userId', getUser); // Fetch user details

export default router;