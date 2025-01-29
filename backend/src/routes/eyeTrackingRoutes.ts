// routes/eyeTrackingRoutes.ts
import express from 'express';
import EyeTrackingController from '../controllers/eyeTrackingController';
import EyeTrackingService from '../services/eyeTrackingService';

const router = express.Router();
const eyeTrackingService = new EyeTrackingService();
const eyeTrackingController = new EyeTrackingController(eyeTrackingService);

// Routes
router.post('/start', eyeTrackingController.startTracking);
router.post('/stop', eyeTrackingController.stopTracking);
router.get('/status/:userId', eyeTrackingController.getStatus);
router.get('/active-users', eyeTrackingController.getActiveUsers);

export default router;