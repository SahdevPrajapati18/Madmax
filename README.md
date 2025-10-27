# Madmax 🎵

A full-stack music streaming application built with modern web technologies. Madmax allows users to discover, stream, and upload music, create playlists, and enjoy a seamless music experience with authentication, real-time notifications, and social features.

## 🌟 Features

### 🎧 Music Streaming
- **High-quality audio streaming** with support for multiple formats
- **Discover new music** through curated collections and recommendations
- **Offline playback** capabilities
- **Cross-platform compatibility** (Web, Mobile responsive)

### 👤 User Management
- **Secure authentication** with JWT tokens
- **Google OAuth integration** for easy login
- **Role-based access control** (Users and Artists)
- **Profile management** and customization

### 🎨 Artist Features
- **Music upload and management** dashboard
- **Artist profiles** with bio and portfolio
- **Track analytics** and insights
- **Direct fan engagement** tools
- **Music deletion** and content management

### 📱 Playlists & Organization
- **Create and manage playlists** with custom artwork
- **Collaborative playlists** (public/private)
- **Smart recommendations** based on listening history
- **Import/Export** functionality

### 📧 Notifications & Communication
- **Email notifications** for important updates
- **Real-time messaging** system
- **Push notifications** support
- **Activity feeds** and social features

## 🏗️ Architecture

Madmax follows a **microservices architecture** with separate services for different functionalities:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Auth Service  │    │  Music Service  │
│   (React/Vite)  │    │   (Node/Express)│    │  (Node/Express) │
│                 │    │                 │    │                 │
│ - UI/UX         │    │ - JWT Auth      │    │ - File Upload   │
│ - Music Player  │    │ - Google OAuth  │    │ - Streaming     │
│ - Playlists     │    │ - User Mgmt     │    │ - Playlists     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  Notification   │    │    Database     │
                       │   Service       │    │   (MongoDB)     │
                       │ (Node/Express)  │    │                 │
                       │                 │    │ - Users         │
                       │ - Email Service │    │ - Music         │
                       │ - RabbitMQ      │    │ - Playlists     │
                       │ - SMS/Email     │    │ - Notifications │
                       └─────────────────┘    └─────────────────┘
```

### 🔄 Message Queuing
- **RabbitMQ** for reliable message delivery
- **Asynchronous processing** for notifications
- **Event-driven architecture** for scalability

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hook Form** - Form management

### Backend Services

#### Auth Service
- **Node.js** with **Express.js**
- **JWT** for authentication
- **Passport.js** with Google OAuth2
- **bcryptjs** for password hashing
- **MongoDB** with **Mongoose** ODM
- **Express Validator** for input validation

#### Music Service
- **Node.js** with **Express.js**
- **Multer** for file uploads
- **Supabase** for cloud storage
- **JWT** authentication middleware
- **MongoDB** with **Mongoose**
- **CORS** for cross-origin requests

#### Notification Service
- **Node.js** with **Express.js**
- **Nodemailer** for email services
- **RabbitMQ** for message queuing
- **MongoDB** with **Mongoose**

### Database & Storage
- **MongoDB** - NoSQL database for flexible data modeling
- **Supabase** - Cloud storage for music files and images
- **RabbitMQ** - Message broker for notifications

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development auto-reload
- **Vite** - Frontend build tool

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local or cloud instance)
- **RabbitMQ** (for notifications)
- **Supabase** account (for file storage)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Madmax
```

### 2. Install Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Auth Service
```bash
cd ../auth
npm install
```

#### Music Service
```bash
cd ../music
npm install
```

#### Notification Service
```bash
cd ../notification
npm install
```

### 3. Environment Configuration

Create `.env` files in each service directory:

#### Frontend (.env)
```env
VITE_BACKEND_URL=https://your-backend-domain.com
VITE_MUSIC_API=https://your-music-api.com
VITE_AUTH_API=https://your-auth-api.com
VITE_NOTIFY_API=https://your-notification-api.com
```

#### Auth Service (.env)
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/auth
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### Music Service (.env)
```env
PORT=3002
MONGO_URI=mongodb://localhost:27017/music
JWT_SECRET=your-super-secret-jwt-key
SUPABASE_URL=your-supabase-url
SUPABASE_API_KEY=your-supabase-anon-key
```

#### Notification Service (.env)
```env
PORT=3001
MONGO_URI=mongodb://localhost:27017/notification
JWT_SECRET=your-super-secret-jwt-key
RABBITMQ_URI=amqp://localhost:5672
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

### 4. Database Setup
```bash
# Start MongoDB (if using local)
mongod

# Or use MongoDB Atlas cloud database
```

### 5. Start Services

#### Development Mode
```bash
# Terminal 1 - Frontend
cd frontend && npm run dev

# Terminal 2 - Auth Service
cd ../auth && npm run dev

# Terminal 3 - Music Service
cd ../music && npm run dev

# Terminal 4 - Notification Service
cd ../notification && npm run dev
```

#### Production Mode
```bash
# Auth Service
cd auth && npm start

# Music Service
cd music && npm start

# Notification Service
cd notification && npm start
```

### 6. Access the Application
- **Frontend**: http://localhost:5173
- **Auth Service**: http://localhost:3000
- **Music Service**: http://localhost:3002
- **Notification Service**: http://localhost:3001

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register - User registration
POST /api/auth/login - User login
POST /api/auth/logout - User logout
GET /api/auth/me - Get current user
GET /api/auth/google - Google OAuth login
```

### Music Endpoints
```
GET /api/music - Get all music (authenticated)
POST /api/music/upload - Upload music (artists only)
GET /api/music/music-details/:id - Get music details
GET /api/music/artist-musics - Get artist's music
DELETE /api/music/:id - Delete music (artists only)
```

### Playlist Endpoints
```
GET /api/music/playlists - Get user playlists
POST /api/music/playlist - Create playlist
PUT /api/music/playlist/:id - Update playlist
DELETE /api/music/playlist/:id - Delete playlist
POST /api/music/playlist/:id/add - Add music to playlist
POST /api/music/playlist/:id/remove - Remove music from playlist
```

## 🎯 Key Features Deep Dive

### Authentication System
- **JWT-based authentication** with secure token management
- **Google OAuth integration** for social login
- **Role-based permissions** (User/Artist)
- **Password hashing** with bcryptjs
- **Token refresh** and expiration handling

### Music Management
- **File upload** with progress tracking
- **Cloud storage** integration (Supabase)
- **Metadata extraction** from audio files
- **Streaming optimization** for various network conditions
- **Copyright protection** and content management

### Real-time Features
- **Live notifications** via RabbitMQ
- **Email alerts** for important events
- **Activity feeds** and social interactions
- **Real-time messaging** between users

## 🔧 Development

### Code Structure
```
frontend/src/
├── components/          # Reusable UI components
├── services/           # API services and utilities
├── styles/             # CSS and styling files
└── assets/             # Static assets

auth/src/
├── controllers/        # Authentication logic
├── middlewares/        # Auth middleware
├── models/             # User models
├── routes/             # Auth routes
└── config/             # Configuration files

music/src/
├── controllers/        # Music business logic
├── middlewares/        # Authentication middleware
├── models/             # Music and playlist models
├── routes/             # Music API routes
├── services/           # External services (storage)
└── config/             # Configuration files
```

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Testing
```bash
# Frontend
cd frontend && npm run test

# Backend services
cd auth && npm test
cd music && npm test
cd notification && npm test
```

## 🚀 Deployment

### Docker Deployment
```dockerfile
# Frontend
FROM node:18-alpine as build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Auth Service
FROM node:18-alpine
WORKDIR /app
COPY auth/package*.json ./
RUN npm install --production
COPY auth/ ./
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production
- Use strong, unique JWT secrets
- Configure production database URLs
- Set up proper CORS origins
- Configure email service credentials
- Set up monitoring and logging

## 📄 License

This project is licensed under the ISC License.

## 🤝 Support

For support, email support@madmax.com or join our Discord community.

## 📈 Roadmap

- [ ] Mobile app development (React Native)
- [ ] Advanced music recommendations (AI/ML)
- [ ] Social features (following, sharing)
- [ ] Live streaming capabilities
- [ ] Podcast support
- [ ] Premium subscription features

---

**Built with ❤️ by the Madmax team**
