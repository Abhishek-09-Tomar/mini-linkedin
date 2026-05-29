# Mini LinkedIn - MERN Stack Version

This is a modern MERN conversion of your original PHP + MySQL Mini LinkedIn project.

## Tech Stack

- Frontend: React, Vite, React Router, Axios, modern CSS
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Auth: JWT + bcrypt password hashing
- Uploads: Multer for profile, cover, and post media
- Features: Signup, OTP verification in development mode, login, dashboard feed, posts, image/video uploads, likes, comments, shares, notifications, searchable profiles, public profile pages, edit profile, connection requests, accept/reject/cancel/remove connections

## Folder Structure

```txt
mini-linkedin-mern/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   ├── uploads/
│   │   ├── posts/
│   │   └── profiles/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
└── package.json
```

## Required Software

Install these first:

1. Node.js LTS
2. MongoDB Community Server, or use MongoDB Atlas
3. VS Code
4. Postman, optional for API testing

## Setup Commands

Open PowerShell or VS Code terminal inside the project folder.

### 1. Install root helper dependency

```bash
npm install
```

### 2. Install backend dependencies

```bash
cd backend
npm install express mongoose dotenv cors bcryptjs jsonwebtoken multer morgan express-validator
npm install -D nodemon
```

### 3. Install frontend dependencies

```bash
cd ../frontend
npm install @vitejs/plugin-react vite react react-dom react-router-dom axios lucide-react
```

### 4. Create backend environment file

Copy this:

```bash
cd ../backend
copy .env.example .env
```

For Git Bash/macOS/Linux:

```bash
cp .env.example .env
```

Update `.env` if needed:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mini_linkedin_mern
JWT_SECRET=replace_this_with_a_long_secret_key
CLIENT_URL=http://localhost:5173
APP_ENV=development
```

For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

### 5. Create frontend environment file

```bash
cd ../frontend
copy .env.example .env
```

For Git Bash/macOS/Linux:

```bash
cp .env.example .env
```

### 6. Run backend

```bash
cd ../backend
npm run dev
```

Backend runs here:

```txt
http://localhost:5000
```

### 7. Run frontend in another terminal

```bash
cd frontend
npm run dev
```

Frontend runs here:

```txt
http://localhost:5173
```

## Fast Run From Root

After installing all dependencies and creating `.env` files:

```bash
npm run dev
```

This runs frontend and backend together.

## Testing Flow

1. Open `http://localhost:5173`
2. Signup with a new user.
3. In development mode, the OTP is shown on the verification page.
4. Verify OTP.
5. Create another account in another browser or incognito window.
6. Search users.
7. Send a connection request.
8. Login as the second user and accept the request.
9. Create posts, upload media, like, comment, share, edit, and delete posts.

## Important Notes

- `node_modules` is not included in this ZIP. Install dependencies using the commands above.
- Uploaded files are saved in `backend/uploads` and served from `http://localhost:5000/uploads/...`.
- This project uses MongoDB, not MySQL. Your old MySQL tables were converted into Mongoose schemas.
- Development OTP is returned by the backend only when `APP_ENV=development`.
- For production, use a real SMS/email provider, stronger validation, HTTPS, and secure cookie-based auth.
