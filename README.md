# Real-time Code Editor

Lightweight Vite + React realtime code editor (frontend). Backend is API-based and expected to be hosted separately.

## Features
- Monaco editor integration
- Collaborative editing (Yjs / sockets)
- Markdown preview
- TailwindCSS for styling

## Prerequisites
- Node.js 18.x (recommended)
- npm (or yarn)

## Local setup
1. Install dependencies
   - Windows (PowerShell / CMD):
     npm install

2. Run dev server
   npm run dev
   - Open: http://localhost:5000

3. Build / Preview production
   npm run build
   npm run preview

## Environment
- Client environment variables must be prefixed with `VITE_`.
  - Example: VITE_API_URL=https://api.example.com
- Add secrets in Vercel (or your host) — do not commit them.

## API / Backend
- The frontend expects a separate backend API. Configure `VITE_API_URL` to point to that backend.
- Ensure the backend allows CORS for your deployed frontend origin.
- If using WebSockets/socket.io for realtime collaboration: Vercel serverless functions do NOT support persistent WebSocket connections. Host the realtime server on a platform that supports long-running processes (Render, Railway, Fly, etc.) or use a managed realtime provider.



## Scripts (package.json)
- npm run dev — start dev server
- npm run build — production build
- npm run preview — serve build locally

## Contributing
- Open issues or PRs. Keep changes small and focused.

