import React, { useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SERVER_URL = 'ws://localhost:3001';

const App: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [log, setLog] = useState<string[]>([]);

  // Connect to the server
  const handleConnect = () => {
    if (socket) return;

    const newSocket = io(SERVER_URL, {
      transports: ["websocket"],
      upgrade: false,
    });

    newSocket.on('connect', () => {
      setConnected(true);
      setLog((prev) => [...prev, 'Connected to server.']);
    });

    newSocket.on('upgrade', (data: any) => {
      setLog((prev) => [...prev, `Upgrade from server: ${JSON.stringify(data)}`]);
    });

    newSocket.on('connect_error', (err: Error) => {
      setLog((prev) => [...prev, `Connection error: ${JSON.stringify(err)}`]);
    });

    newSocket.on('response', (data: any) => {
      setLog((prev) => [...prev, `Received from server: ${JSON.stringify(data)}`]);
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      setLog((prev) => [...prev, 'Disconnected from server.']);
    });

    setSocket(newSocket);
  };

  // Disconnect from the server
  const handleDisconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setConnected(false);
      setLog((prev) => [...prev, 'Disconnected manually.']);
    }
  };

  // Send a message to the server
  const handleSubmit = () => {
    if (socket && connected) {
      socket.emit('message', message);
      setLog((prev) => [...prev, `Sent message: ${message}`]);
      setMessage('');
    } else {
      setLog((prev) => [...prev, 'Cannot send message, not connected.']);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Socket.IO React Client</h1>
      <button onClick={handleConnect} disabled={connected}>
        Connect
      </button>
      <button onClick={handleDisconnect} disabled={!connected}>
        Disconnect
      </button>
      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter a message"
          disabled={!connected}
        />
        <button onClick={handleSubmit} disabled={!connected}>
          Submit
        </button>
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Log:</h3>
        <div
          style={{
            height: '200px',
            overflowY: 'auto',
            border: '1px solid #ccc',
            padding: '10px',
            backgroundColor: '#f9f9f9',
          }}
        >
          {log.map((entry, index) => (
            <div key={index}>{entry}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
