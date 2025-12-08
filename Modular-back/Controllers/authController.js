const User = require("../Models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret';

exports.register = async (req, res) => {
  try {
    const { username, email, password, role, handle, avatarUrl } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }, { handle }] });
    if (existingUser) {
      return res.status(409).json({ message: 'User with that email, username, or handle already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role, handle, avatarUrl });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, role: user.role, username: user.username, message: 'Login successful!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};