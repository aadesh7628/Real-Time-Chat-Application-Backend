const { io } = require('socket.io-client');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const username = process.argv[2] || 'Anonymous';
const room = process.argv[3] || 'general';

const socket = io('http://localhost:3000');

// Connect to server
socket.on('connect', () => {
  console.log('Connected to server');
  socket.emit('joinRoom', { room, username });
  console.log(`Joined room: ${room} as ${username}`);
});

// Listen for messages
socket.on('message', (data) => {
  console.log(`\n${data.username}: ${data.message}`);
});

// Listen for user joins
socket.on('userJoined', (data) => {
  console.log(`\n${data.username} joined the room`);
  console.log('Current users:', data.users.join(', '));
});

// Listen for user leaves
socket.on('userLeft', (data) => {
  console.log(`\n${data.username} left the room`);
  console.log('Current users:', data.users.join(', '));
});

// Listen for typing indicators
socket.on('userTyping', (data) => {
  if (data.users.length > 0) {
    console.log(`\n${data.users.join(', ')} is typing...`);
  }
});

// Listen for message history
socket.on('messageHistory', (messages) => {
  console.log('\nMessage History:');
  messages.forEach(msg => {
    console.log(`${msg.username}: ${msg.message}`);
  });
  console.log('\n');
});

let typingTimeout;

// Handle user input
rl.on('line', (input) => {
  if (input.trim()) {
    // Clear typing indicator
    clearTimeout(typingTimeout);
    socket.emit('typing', { room, isTyping: false });
    
    // Send message
    socket.emit('chatMessage', { room, message: input });
  }
});

// Handle typing indicator
rl.input.on('keypress', () => {
  socket.emit('typing', { room, isTyping: true });
  
  // Clear previous timeout
  clearTimeout(typingTimeout);
  
  // Set new timeout
  typingTimeout = setTimeout(() => {
    socket.emit('typing', { room, isTyping: false });
  }, 1500);
});