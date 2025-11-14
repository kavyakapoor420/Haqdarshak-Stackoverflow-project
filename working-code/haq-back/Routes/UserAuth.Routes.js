

app.post('/api/register', async (req, res) => {
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
});

