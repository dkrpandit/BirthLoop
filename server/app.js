const express = require('express');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const setupScheduledTasks = require('./services/scheduler');
const notificationRoute = require('./routes/notificationRoutes')
const emailOtpRoutes = require('./routes/emailOtpRoutes');
const cors = require('cors');
require('dotenv').config();
require('./utils/passport');

const friendRoutes = require("./routes/friendRoutes")
const app = express();

// Connect to MongoDB
connectDB();

setupScheduledTasks();
// Middleware
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
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
  res.send('Welcome to BirthLoop');
});

// user Routes
app.use("/api/friend", friendRoutes)

// Notification
app.use("/api/notification", notificationRoute)

// Email OTP Routes
app.use('/api/email-otp', emailOtpRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));