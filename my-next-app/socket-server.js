const http = require('http');
const { Server } = require('socket.io');
const express = require('express');

const app = express();

const server = http.createServer(app);
app.use(express.json());


// Attach Socket.IO to the HTTP server
const io = new Server(server, {
  cors: {
    origin: '*',
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

app.post("/notify-new-order", (req, res) => {
  const { restaurantId, order } = req.body;
  if (!restaurantId || !order) {
    return res
      .status(400)
      .json({ error: "restaurantId and order are required" });
  }

  io.to(restaurantId).emit("new-order", { order });
  res.json({ success: true });
});

app.post("/notify-order-accepted", (req, res) => {
  const { restaurantId, orderId, order } = req.body;
  console.log(
    "Received order acceptance notification for restaurant:",
    restaurantId
  );

  if (!restaurantId || !orderId) {
    console.log("Missing restaurantId or orderId");
    return res
      .status(400)
      .json({ error: "restaurantId and orderId are required" });
  }

  io.to(restaurantId).emit("order-accepted", { orderId, order });
  res.json({ success: true });
});

server.listen(4000, () => {
  console.log('Socket.IO server running on port 4000');
});