const { io } = require('socket.io-client');

// Create two test clients
const client1 = io('http://localhost:3000');
const client2 = io('http://localhost:3000');

// Client 1 setup
client1.on('connect', () => {
  console.log('Client 1 connected');
  
  // Join room
  client1.emit('joinRoom', { room: 'test-room', username: 'User1' });
});

client1.on('message', (data) => {
  console.log('Client 1 received:', data);
});

client1.on('userJoined', (data) => {
  console.log('User joined:', data);
});

client1.on('userTyping', (data) => {
  console.log('Users typing:', data);
});

// Client 2 setup
client2.on('connect', () => {
  console.log('Client 2 connected');
  
  // Join same room
  client2.emit('joinRoom', { room: 'test-room', username: 'User2' });
  
  // Send a test message after 1 second
  setTimeout(() => {
    client2.emit('typing', { room: 'test-room', isTyping: true });
    
    setTimeout(() => {
      client2.emit('chatMessage', { 
        room: 'test-room', 
        message: 'Hello from Client 2!' 
      });
      client2.emit('typing', { room: 'test-room', isTyping: false });
    }, 1000);
  }, 1000);
});