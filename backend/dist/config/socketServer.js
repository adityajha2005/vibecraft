"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
const logger_1 = require("../utils/logger"); // Create this utility
const eyeTrackingService_1 = __importDefault(require("../services/eyeTrackingService"));
class SocketServer {
    listen(PORT, arg1) {
        // throw new Error('Method not implemented.');
    }
    constructor(app) {
        this.connectedClients = new Map();
        // Create HTTP server
        const server = http_1.default.createServer(app);
        // Initialize Socket.IO with CORS and other options
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                credentials: true
            },
            pingTimeout: 60000,
            pingInterval: 25000
        });
        // Initialize WebSocket server
        this.wsServer = new ws_1.WebSocketServer({
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
        this.eyeTrackingService = new eyeTrackingService_1.default();
        this.initializeWebSocketServer();
        this.initializeSocketIO();
    }
    initializeWebSocketServer() {
        this.wsServer.on('listening', () => {
            logger_1.logger.info('WebSocket server is listening on ws://localhost:8080');
        });
        this.wsServer.on('error', (error) => {
            logger_1.logger.error('WebSocket server error:', error);
        });
        this.wsServer.on('connection', this.handlePythonConnection.bind(this));
    }
    initializeSocketIO() {
        this.io.on('connection', this.handleClientConnection.bind(this));
    }
    handlePythonConnection(ws) {
        const clientId = Math.random().toString(36).substring(7);
        this.connectedClients.set(ws, clientId);
        logger_1.logger.info(`Python client connected: ${clientId}`);
        ws.on('message', async (data) => {
            try {
                const message = JSON.parse(data.toString());
                logger_1.logger.debug('Received data from Python:', message);
                if (message.status === 'error') {
                    logger_1.logger.error('Error from Python backend:', message.message);
                    return;
                }
                if (message.action === 'reduce-stimulation') {
                    const uiAdjustment = {
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
            }
            catch (error) {
                logger_1.logger.error('Error processing message:', error);
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                ws.send(JSON.stringify({
                    status: 'error',
                    message: errorMessage,
                    timestamp: Date.now()
                }));
            }
        });
        ws.on('close', () => {
            logger_1.logger.info(`Python client disconnected: ${clientId}`);
            this.connectedClients.delete(ws);
        });
        ws.on('error', (error) => {
            logger_1.logger.error(`WebSocket error for client ${clientId}:`, error);
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
    handleClientConnection(socket) {
        logger_1.logger.info('Frontend client connected:', socket.id);
        // Handle frontend client events
        socket.on('request-status', () => {
            socket.emit('status-update', {
                connectedPythonClients: this.connectedClients.size,
                serverTime: new Date().toISOString()
            });
        });
        socket.on('disconnect', () => {
            logger_1.logger.info('Frontend client disconnected:', socket.id);
        });
        socket.on('error', (error) => {
            logger_1.logger.error(`Socket.IO error for client ${socket.id}:`, error);
        });
    }
    getServer() {
        return this.io.httpServer;
    }
    async cleanup() {
        // Cleanup function for graceful shutdown
        return new Promise((resolve) => {
            this.wsServer.close(() => {
                this.io.close(() => {
                    logger_1.logger.info('Socket servers closed successfully');
                    resolve();
                });
            });
        });
    }
}
exports.default = SocketServer;
