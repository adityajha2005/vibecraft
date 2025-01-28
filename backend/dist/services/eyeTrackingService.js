"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// services/eyeTrackingService.ts
const python_shell_1 = require("python-shell");
const ws_1 = require("ws");
const path_1 = __importDefault(require("path"));
const PYTHON_SCRIPT_PATH = path_1.default.join(__dirname, '../../scripts/eyeTracker.py');
class EyeTrackingService {
    constructor(socketIOClient, wsServer) {
        this.socketIOClient = null;
        this.wsServer = null;
        this.pyshell = null;
        this.activeUsers = new Set();
        this.socketIOClient = socketIOClient || null;
        this.wsServer = wsServer || null;
    }
    async startEyeTracking(userId) {
        if (this.activeUsers.has(userId)) {
            console.log(`Eye tracking already active for user: ${userId}`);
            return;
        }
        const options = {
            mode: 'text',
            pythonPath: 'python', // Changed from python3 to python for Windows compatibility
            scriptPath: path_1.default.dirname(PYTHON_SCRIPT_PATH),
            args: [userId],
        };
        try {
            this.pyshell = new python_shell_1.PythonShell(PYTHON_SCRIPT_PATH, options);
            this.activeUsers.add(userId);
            this.pyshell.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    this.handleOverstimulation(userId, data.overstimulated);
                }
                catch (error) {
                    console.error('Error parsing message from Python script:', error);
                }
            });
            this.pyshell.on('error', (error) => {
                console.error('Eye-tracking error:', error);
                this.activeUsers.delete(userId);
            });
            this.pyshell.on('close', () => {
                console.log(`Eye-tracking ended for user: ${userId}`);
                this.activeUsers.delete(userId);
            });
            console.log(`Eye-tracking started for user: ${userId}`);
        }
        catch (error) {
            console.error(`Failed to start eye-tracking for user ${userId}:`, error);
            this.activeUsers.delete(userId);
            throw error;
        }
    }
    async stopEyeTracking(userId) {
        if (!this.activeUsers.has(userId)) {
            console.warn(`No active eye-tracking session for user: ${userId}`);
            return;
        }
        return new Promise((resolve, reject) => {
            if (this.pyshell) {
                this.pyshell.end((err) => {
                    if (err) {
                        console.error(`Error stopping eye-tracking for user ${userId}:`, err);
                        reject(err);
                    }
                    else {
                        console.log(`Eye-tracking stopped for user: ${userId}`);
                        this.activeUsers.delete(userId);
                        resolve();
                    }
                });
            }
            else {
                resolve();
            }
        });
    }
    handleOverstimulation(userId, overstimulated) {
        console.log(`User ${userId} overstimulation status: ${overstimulated}`);
        // Send to WebSocket clients (Python)
        if (this.wsServer && this.wsServer.readyState === ws_1.WebSocket.OPEN) {
            this.wsServer.send(JSON.stringify({
                type: 'overstimulation-update',
                userId,
                overstimulated
            }));
        }
        // Send to Socket.IO clients (frontend)
        if (this.socketIOClient) {
            this.socketIOClient.emit('ui-adjustment', {
                userId,
                action: 'reduce-stimulation',
                overstimulated,
                timestamp: new Date().toISOString()
            });
        }
        // Broadcast to room if using Socket.IO rooms
        if (this.socketIOClient) {
            this.socketIOClient.to(userId).emit('ui-adjustment', {
                action: 'reduce-stimulation',
                message: 'Reducing visual intensity due to overstimulation.',
                timestamp: new Date().toISOString()
            });
        }
    }
    isTracking(userId) {
        return this.activeUsers.has(userId);
    }
    getActiveUsers() {
        return Array.from(this.activeUsers);
    }
}
exports.default = EyeTrackingService;
