# ClipShare - Instant Temporary Snippet Sharing

ClipShare is a full-stack web application that allows users to paste text and instantly generate a temporary shareable link. The content auto-expires after a selected time (10 min, 1 hour, or 24 hours).

## Features

- **Ultra-minimal Design**: Clean, modern UI with a white background and centered card layout.
- **Auto-Expiry**: Documents are automatically deleted from the database using MongoDB TTL indexes.
- **Password Protection**: Optional encryption/password protection for snippets.
- **Micro-animations**: Smooth transitions using Framer Motion.
- **Responsive**: Mobile-first design that works on all devices.
- **QR Code**: Generate a QR code for easy mobile access.
- **Security**: Rate limiting, input sanitization, and request size limits.

## Tech Stack

- **Frontend**: Next.js (App Router), Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, Mongoose.
- **Database**: MongoDB (with TTL index).

## Quick Start

### 1. Prerequisites
- Node.js installed.
- MongoDB Atlas account (or local MongoDB).

### 2. Configuration
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:3000
```

Create a `.env.local` file in the `client` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Installation & Run
From the root directory:
```bash
# Install all dependencies
npm run install-all

# Run both client and server in dev mode
npm run dev
```

## Deployment

- **Backend (Node/Express)**: Ready for **Render** or **Railway**.
  - Set `MONGODB_URI` to your database string.
  - Set `FRONTEND_URL` to your deployed frontend URL.
- **Frontend (Next.js)**: 
  - **Vercel/Netlify**: Standard deployment works out of the box.
  - **Cloudflare Pages**: 
    - Build command: `npm run build`
    - Build output directory: `out`
    - Environment Variable: `NEXT_PUBLIC_API_URL` (points to your backend)
