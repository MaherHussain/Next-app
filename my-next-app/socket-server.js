const http = require('http');
const { Server } = require('socket.io');
const express = require('express');

const app = express();

const server = http.createServer(app);
app.use(express.json());

// Your HTTP endpoint


// Create HTTP server with Express app


// Attach Socket.IO to the HTTP server
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST'],
  },
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('A partner connected:', socket.id);

  socket.on('join-room', (restaurantId) => {
    socket.join(restaurantId);
    console.log(`Socket ${socket.id} joined room ${restaurantId}`);
  });

  socket.on('disconnect', () => {
    console.log('Partner disconnected:', socket.id);
  });
});

app.post('/notify-new-order', (req, res) => {
  const { restaurantId, order } = req.body;
  console.log('Received notification request for restaurant:', restaurantId);
  
  if (!restaurantId || !order) {
    console.log('Missing restaurantId or order');
    return res.status(400).json({ error: 'restaurantId and order are required' });
  }
  
  console.log('Emitting new-order to room:', restaurantId);
  io.to(restaurantId).emit('new-order', { order });
  res.json({ success: true });
});

const PORT = process.env.SOCKET_SERVER_PORT || 4000;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
