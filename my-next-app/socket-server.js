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

  socket.on('join-room', (restaurantId) => {
    socket.join(restaurantId);
  });

  socket.on('join-order', (orderId) => {
    socket.join(orderId);
  });

  socket.on('disconnect', () => {
    // Client disconnected
  });
});

app.post('/notify-new-order', (req, res) => {
  const { restaurantId, order } = req.body;
  
  if (!restaurantId || !order) {
    return res.status(400).json({ error: 'restaurantId and order are required' });
  }
  
  io.to(restaurantId).emit('new-order', { order });
  res.json({ success: true });
});

app.post('/notify-order-status-update', (req, res) => {
  const { orderId, restaurantId, status, estimatedTime, rejectionReason } = req.body;

  if (!orderId || !status) {
    return res.status(400).json({ error: 'orderId and status are required' });
  }

  // Notify the customer in the specific order room
  io.to(orderId).emit('order-status-updated', { orderId, status, estimatedTime, rejectionReason });

  // Also notify the restaurant room so all admin boards refresh
  if (restaurantId) {
    io.to(restaurantId).emit('order-status-updated', { orderId, status, estimatedTime, rejectionReason });
  }
  
  res.json({ success: true });
});

const PORT = process.env.SOCKET_SERVER_PORT || 4000;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
