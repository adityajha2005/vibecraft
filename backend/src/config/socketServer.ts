import { Server, Socket } from 'socket.io';
import { WebSocket, WebSocketServer } from 'ws';
import http from 'http';
import { logger } from '../utils/logger';  // Create this utility
import EyeTrackingService from '../services/eyeTrackingService';

// Define types for messages
interface PythonMessage {
  status: string;
  action?: string;
  eye_aspect_ratio?: number;
  is_too_close?: boolean;
  message?: string;
}

interface UIAdjustmentMessage {
  userId: string;
  action: string;
  eye_aspect_ratio?: number;
  timestamp: number;
}

class SocketServer {
  listen(PORT: string | number, arg1: () => void) {
    // throw new Error('Method not implemented.');
  }
  private io: Server;
  private wsServer: WebSocketServer;
  private eyeTrackingService: EyeTrackingService;
  private connectedClients: Map<WebSocket, string> = new Map();

  constructor(app: any) {
    // Create HTTP server
    const server = http.createServer(app);

    // Initialize Socket.IO with CORS and other options
    this.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
      },
      pingTimeout: 60000,
      pingInterval: 25000
    });

    // Initialize WebSocket server
    this.wsServer = new WebSocketServer({ 
      port: 8080,
      host: 'localhost',
      perMessageDeflate: {
        zlibDeflateOptions: {
          chunkSize: 1024,
          memLevel: 7,
          level: 3
        },
        zlibInflateOptions: {
          chunkSize: 10 * 1024
        },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        concurrencyLimit: 10,
        threshold: 1024
      }
    });

    this.eyeTrackingService = new EyeTrackingService();
    
    this.initializeWebSocketServer();
    this.initializeSocketIO();
  }

  private initializeWebSocketServer(): void {
    this.wsServer.on('listening', () => {
      logger.info('WebSocket server is listening on ws://localhost:8080');
    });

    this.wsServer.on('error', (error) => {
      logger.error('WebSocket server error:', error);
    });

    this.wsServer.on('connection', this.handlePythonConnection.bind(this));
  }

  private initializeSocketIO(): void {
    this.io.on('connection', this.handleClientConnection.bind(this));
  }

  private handlePythonConnection(ws: WebSocket): void {
    const clientId = Math.random().toString(36).substring(7);
    this.connectedClients.set(ws, clientId);
    logger.info(`Python client connected: ${clientId}`);

    ws.on('message', async (data: Buffer) => {
      try {
        const message: PythonMessage = JSON.parse(data.toString());
        logger.debug('Received data from Python:', message);

        if (message.status === 'error') {
          logger.error('Error from Python backend:', message.message);
          return;
        }

        if (message.action === 'reduce-stimulation') {
          const uiAdjustment: UIAdjustmentMessage = {
            userId: clientId,
            action: message.action,
            eye_aspect_ratio: message.eye_aspect_ratio,
            timestamp: Date.now()
          };

          // Emit to all connected frontend clients
          this.io.emit('ui-adjustment', uiAdjustment);

          // Process overstimulation event
          if (message.is_too_close) {
            await this.eyeTrackingService.handleOverstimulation(clientId, true);
          }
        }

        // Send acknowledgment
        ws.send(JSON.stringify({ status: 'received', timestamp: Date.now() }));

      } catch (error) {
        logger.error('Error processing message:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        ws.send(JSON.stringify({ 
          status: 'error', 
          message: errorMessage,
          timestamp: Date.now()
        }));
      }
    });

    ws.on('close', () => {
      logger.info(`Python client disconnected: ${clientId}`);
      this.connectedClients.delete(ws);
    });

    ws.on('error', (error) => {
      logger.error(`WebSocket error for client ${clientId}:`, error);
    });

    // Send initial configuration
    ws.send(JSON.stringify({ 
      status: 'connected', 
      clientId,
      config: {
        frameRate: 5,
        quality: 0.7
      }
    }));
  }

  private handleClientConnection(socket: Socket): void {
    logger.info('Frontend client connected:', socket.id);

    // Handle frontend client events
    socket.on('request-status', () => {
      socket.emit('status-update', {
        connectedPythonClients: this.connectedClients.size,
        serverTime: new Date().toISOString()
      });
    });

    socket.on('disconnect', () => {
      logger.info('Frontend client disconnected:', socket.id);
    });

    socket.on('error', (error) => {
      logger.error(`Socket.IO error for client ${socket.id}:`, error);
    });
  }

  public getServer(): http.Server {
    return this.io.httpServer as unknown as http.Server;
  }

  public async cleanup(): Promise<void> {
    // Cleanup function for graceful shutdown
    return new Promise((resolve) => {
      this.wsServer.close(() => {
        this.io.close(() => {
          logger.info('Socket servers closed successfully');
          resolve();
        });
      });
    });
  }
}

export default SocketServer;
