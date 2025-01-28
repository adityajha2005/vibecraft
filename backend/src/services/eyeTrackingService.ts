// services/eyeTrackingService.ts
import { PythonShell, Options } from 'python-shell';
import { Socket } from 'socket.io';
import { WebSocket } from 'ws';
import path from 'path';

const PYTHON_SCRIPT_PATH = path.join(__dirname, '../../scripts/eyeTracker.py');

class EyeTrackingService {
  private socketIOClient: Socket | null = null;
  private wsServer: WebSocket | null = null;
  private pyshell: PythonShell | null = null;
  private activeUsers: Set<string> = new Set();

  constructor(socketIOClient?: Socket, wsServer?: WebSocket) {
    this.socketIOClient = socketIOClient || null;
    this.wsServer = wsServer || null;
  }

  public async startEyeTracking(userId: string): Promise<void> {
    if (this.activeUsers.has(userId)) {
      console.log(`Eye tracking already active for user: ${userId}`);
      return;
    }

    const options: Options = {
      mode: 'text',
      pythonPath: 'python', // Changed from python3 to python for Windows compatibility
      scriptPath: path.dirname(PYTHON_SCRIPT_PATH),
      args: [userId],
    };

    try {
      this.pyshell = new PythonShell(PYTHON_SCRIPT_PATH, options);
      this.activeUsers.add(userId);

      this.pyshell.on('message', (message: string) => {
        try {
          const data = JSON.parse(message);
          this.handleOverstimulation(userId, data.overstimulated);
        } catch (error) {
          console.error('Error parsing message from Python script:', error);
        }
      });

      this.pyshell.on('error', (error: Error) => {
        console.error('Eye-tracking error:', error);
        this.activeUsers.delete(userId);
      });

      this.pyshell.on('close', () => {
        console.log(`Eye-tracking ended for user: ${userId}`);
        this.activeUsers.delete(userId);
      });

      console.log(`Eye-tracking started for user: ${userId}`);
    } catch (error) {
      console.error(`Failed to start eye-tracking for user ${userId}:`, error);
      this.activeUsers.delete(userId);
      throw error;
    }
  }

  public async stopEyeTracking(userId: string): Promise<void> {
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
          } else {
            console.log(`Eye-tracking stopped for user: ${userId}`);
            this.activeUsers.delete(userId);
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  public handleOverstimulation(userId: string, overstimulated: boolean): void {
    console.log(`User ${userId} overstimulation status: ${overstimulated}`);

    // Send to WebSocket clients (Python)
    if (this.wsServer && this.wsServer.readyState === WebSocket.OPEN) {
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

  public isTracking(userId: string): boolean {
    return this.activeUsers.has(userId);
  }

  public getActiveUsers(): string[] {
    return Array.from(this.activeUsers);
  }
}

export default EyeTrackingService;