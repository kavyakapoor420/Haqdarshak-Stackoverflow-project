const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// MongoDB Connection
const mongo_uri = 'mongodb://localhost:27017/postReviewSystem';
mongoose.connect(mongo_uri)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./Routes/authRoutes');
const postRoutes = require('./Routes/postRoutes');
const commentRoutes = require('./Routes/commentRoutes');
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const leaderboardRoutes = require('./Routes/leaderboardRoutes');
const schemeRoutes = require('./Routes/schemeRoutes')

app.use('/api', authRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);
app.use('/api', userRoutes);
app.use('/api', chatRoutes);
app.use('/api', leaderboardRoutes);
app.use('/api', schemeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));