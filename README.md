# Websocket test client
Provide example to run websocket client by browser embedded websocket or by SocketIO.

# Jira link
https://ikigaians.atlassian.net/browse/FND-463

# Stack
- React + TypeScript + Vite

# Configuration
In main.tsx import App from
- "App_browser" if browser native websocket is chosen
- "App_io" if SocketIO client is chosen

# Running
- Start application.
```shell
npm run build
npm run dev
```
- Open on browser: http://localhost:5173/
- Click Connect to send connection request.
