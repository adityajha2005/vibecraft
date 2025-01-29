"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EyeTrackingController {
    constructor(eyeTrackingService) {
        this.startTracking = async (req, res) => {
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
            }
            catch (error) {
                console.error('Failed to start eye tracking:', error);
                res.status(500).json({
                    error: 'Failed to start eye tracking',
                    details: error.message
                });
            }
        };
        this.stopTracking = async (req, res) => {
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
            }
            catch (error) {
                console.error('Failed to stop eye tracking:', error);
                res.status(500).json({
                    error: 'Failed to stop eye tracking',
                    details: error.message
                });
            }
        };
        this.getStatus = (req, res) => {
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
        this.getActiveUsers = (req, res) => {
            const activeUsers = this.eyeTrackingService.getActiveUsers();
            res.status(200).json({
                activeUsers,
                count: activeUsers.length
            });
        };
        this.eyeTrackingService = eyeTrackingService;
    }
}
exports.default = EyeTrackingController;
