const { Server } = require('socket.io'); // Use require instead of import
import http from 'http';

const initializeSocket = (server: http.Server) => {
  const io = new Server(server, { cors: { origin: '*' } });
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
  });
  return io;
};

export default initializeSocket;