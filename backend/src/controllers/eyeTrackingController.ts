// controllers/eyeTrackingController.ts
import { Request, Response } from 'express';
import EyeTrackingService from '../services/eyeTrackingService';

class EyeTrackingController {
  private eyeTrackingService: EyeTrackingService;

  constructor(eyeTrackingService: EyeTrackingService) {
    this.eyeTrackingService = eyeTrackingService;
  }

  public startTracking = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }

    try {
      await this.eyeTrackingService.startEyeTracking(userId);
      res.status(200).json({ 
        message: 'Eye tracking started successfully',
        userId 
      });
    } catch (error) {
      console.error('Failed to start eye tracking:', error);
      res.status(500).json({ 
        error: 'Failed to start eye tracking',
        details: (error as Error).message 
      });
    }
  };

  public stopTracking = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }

    try {
      await this.eyeTrackingService.stopEyeTracking(userId);
      res.status(200).json({ 
        message: 'Eye tracking stopped successfully',
        userId 
      });
    } catch (error) {
      console.error('Failed to stop eye tracking:', error);
      res.status(500).json({ 
        error: 'Failed to stop eye tracking',
        details: (error as Error).message 
      });
    }
  };

  public getStatus = (req: Request, res: Response): void => {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }

    const isTracking = this.eyeTrackingService.isTracking(userId);
    res.status(200).json({ 
      userId,
      isTracking 
    });
  };

  public getActiveUsers = (req: Request, res: Response): void => {
    const activeUsers = this.eyeTrackingService.getActiveUsers();
    res.status(200).json({ 
      activeUsers,
      count: activeUsers.length 
    });
  };
}

export default EyeTrackingController;