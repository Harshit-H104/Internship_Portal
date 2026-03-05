require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const sequelize = require('./config/db');
const User = require('./models/User');
const Application = require('./models/Application');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'Mynameismarvin';

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());


// ================= DB CONNECT =================

sequelize.sync()
  .then(() => console.log('MySQL connected & tables created'))
  .catch(err => console.log(err));


// ================= AUTH MIDDLEWARE =================

const authenticateUser = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};


// ================= REGISTER =================

app.post('/register', async (req, res) => {
  try {
    let { name, email, password } = req.body;

    email = email.toLowerCase();

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: "Registration successful" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= LOGIN =================

app.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase();

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET_KEY,
      { expiresIn: '4h' }
    );

    res.cookie('authToken', token, {
      httpOnly: true,
      sameSite: 'lax'
    });

    res.json({ message: "Login successful" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= PROFILE =================

app.get('/profile', authenticateUser, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);

    res.json({
      name: user.name,
      email: user.email
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= APPLY =================

app.post('/apply', authenticateUser, async (req, res) => {
  try {
    const { opportunity, phone, email, resumeLink } = req.body;

    await Application.create({
      userId: req.user.userId,
      company: opportunity.company,
      role: opportunity.role,
      office: opportunity.location?.office,
      stipend: opportunity.location?.stipend,
      phone,
      email,
      resumeLink
    });

    res.json({ message: "Application submitted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= APPLIED =================

app.get('/applied', authenticateUser, async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { userId: req.user.userId }
    });

    res.json(applications);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= LOGOUT =================

app.post('/logout', (req, res) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    sameSite: 'lax'
  });

  res.json({ message: "Logout successful" });
});


// ================= SERVER START =================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});