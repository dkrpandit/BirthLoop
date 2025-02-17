const express = require('express');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { scheduleNotifications } = require('./services/notificationService');
const cors = require('cors');
require('dotenv').config();
require('./utils/passport');

const friendRoutes = require("./routes/friendRoutes")
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
scheduleNotifications();
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Auth Routes
app.use('/api/auth', authRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to Authentication Example');
});

// user Routes
app.use("/api/friend",friendRoutes)

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));