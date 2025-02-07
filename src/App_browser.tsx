import React, { useState } from 'react';
const WebSocketCtor = window.WebSocket;

const SERVER_URL = 'ws://localhost:3001';

const App: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [log, setLog] = useState<string[]>([]);

  const handleConnect = () => {
    if (socket) return;

    const newSocket = new WebSocketCtor(SERVER_URL);

    newSocket.onopen = () => {
      setConnected(true);
      setLog((prev) => [...prev, `Connection opened`]);
    };
    newSocket.onerror = (err) => {
      setLog((prev) => [...prev, `Connection onerror: ${JSON.stringify(err)}`]);
    };
    newSocket.onclose = () => {
      setConnected(false);
      setLog((prev) => [...prev, `Connection closed`]);
    };
    newSocket.onmessage = (data) => {
      setLog((prev) => [...prev, `On message: ${JSON.stringify(data)}`]);
    };

    setSocket(newSocket);
  };
  const handleDisconnect = () => {
    if (socket) {
      socket.close();
      setSocket(null);
      setConnected(false);
      setLog((prev) => [...prev, 'Disconnected manually.']);
    }
  };

  const handleSubmit = () => {
    if (socket && connected) {
      socket.send(message);
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