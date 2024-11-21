const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

// Store active users and room history
const rooms = new Map();
const messageHistory = new Map();
const userTypingStatus = new Map();

io.on('connection', (socket) => {
  let currentRoom = null;
  let userName = null;

  // Handle user joining a room
  socket.on('joinRoom', ({ room, username }) => {
    // Leave previous room if any
    if (currentRoom) {
      socket.leave(currentRoom);
      removeUserFromRoom(currentRoom, userName);
    }

    // Join new room
    currentRoom = room;
    userName = username;
    socket.join(room);

    // Initialize room if it doesn't exist
    if (!rooms.has(room)) {
      rooms.set(room, new Set());
      messageHistory.set(room, []);
    }

    // Add user to room
    rooms.get(room).add(username);

    // Send room history to user
    socket.emit('messageHistory', messageHistory.get(room));

    // Notify room about new user
    io.to(room).emit('userJoined', {
      username,
      users: Array.from(rooms.get(room))
    });
  });

  // Handle chat messages
  socket.on('chatMessage', ({ room, message }) => {
    const messageData = {
      username: userName,
      message,
      timestamp: new Date().toISOString()
    };

    // Store message in history
    messageHistory.get(room).push(messageData);
    if (messageHistory.get(room).length > 100) {
      messageHistory.get(room).shift(); // Keep only last 100 messages
    }

    // Broadcast message to room
    io.to(room).emit('message', messageData);
  });

  // Handle typing status
  socket.on('typing', ({ room, isTyping }) => {
    const roomTyping = userTypingStatus.get(room) || new Map();
    if (isTyping) {
      roomTyping.set(userName, true);
    } else {
      roomTyping.delete(userName);
    }
    userTypingStatus.set(room, roomTyping);

    // Broadcast typing status
    socket.to(room).emit('userTyping', {
      users: Array.from(roomTyping.keys())
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (currentRoom && userName) {
      removeUserFromRoom(currentRoom, userName);
      io.to(currentRoom).emit('userLeft', {
        username: userName,
        users: Array.from(rooms.get(currentRoom) || [])
      });
    }
  });
});

function removeUserFromRoom(room, username) {
  if (rooms.has(room)) {
    rooms.get(room).delete(username);
    if (rooms.get(room).size === 0) {
      rooms.delete(room);
      messageHistory.delete(room);
      userTypingStatus.delete(room);
    }
  }
}

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});