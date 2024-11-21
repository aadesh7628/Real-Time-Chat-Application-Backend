# Real-Time Chat Application Backend

A robust Node.js backend for a real-time chat application using Socket.IO, featuring multiple rooms, typing indicators, and message history.

## Features

- 🚀 Real-time messaging using Socket.IO
- 👥 Multiple chat room support
- ⌨️ Live typing indicators
- 📜 Message history storage

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/aadesh7628/Real-Time-Chat-Application-Backend.git
cd Real-Time-Chat-Application-Backend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 3000 (default) or the port specified in the PORT environment variable.

## Testing

### Interactive Testing
Run multiple clients in different terminal windows:

```bash
node src/interactive-client.js Username RoomName
```

Example:
```bash
# Terminal 1
node src/interactive-client.js Alice room1

# Terminal 2
node src/interactive-client.js Bob room1
```

### Automated Testing
Run the automated test client:
```bash
npm test
```

## API Documentation

### Socket Events

#### Client to Server

| Event | Payload | Description |
|-------|---------|-------------|
| `joinRoom` | `{ room: string, username: string }` | Join a chat room |
| `chatMessage` | `{ room: string, message: string }` | Send a message |
| `typing` | `{ room: string, isTyping: boolean }` | Indicate typing status |

#### Server to Client

| Event | Payload | Description |
|-------|---------|-------------|
| `message` | `{ username: string, message: string, timestamp: string }` | Receive a message |
| `userJoined` | `{ username: string, users: string[] }` | User joined notification |
| `userLeft` | `{ username: string, users: string[] }` | User left notification |
| `userTyping` | `{ users: string[] }` | Users currently typing |
| `messageHistory` | `Array<message>` | Room message history |

## Project Structure

```
src/
├── server.js           # Main server file
├── interactive-client.js # Interactive test client
└── test-client.js      # Automated test client
