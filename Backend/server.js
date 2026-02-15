require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const UserModel = require('./models/formDataSchema');
const InternshipApplication = require('./models/Application');

const app = express();
const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3001;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'Mynameismarvin';

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB successfully connected'))
.catch(err => console.log('Failed to connect to MongoDB:', err));


//......... REGISTER.......... 

const registerUser = async (req, res) => {
  let { name, email, password } = req.body;

  try {
    email = email.toLowerCase();

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'User registration successful' });

  } catch (err) {
    res.status(500).json({ message: 'Error during registration', error: err.message });
  }
};


// .......... LOGIN ..............

const userLogin = async (req, res) => {
  let { email, password } = req.body;

  try {
    email = email.toLowerCase();

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid login credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid login credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET_KEY,
      { expiresIn: '4h' }
    );

    res.cookie('authToken', token, { httpOnly: true });

    res.status(200).json({ message: 'Login successful' });

  } catch (err) {
    res.status(500).json({ message: 'Error during login', error: err.message });
  }
};


// ..... LOGOUT ....

const userLogout = (req, res) => {
  try {
    res.clearCookie('authToken');
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    res.status(500).json({ message: 'Error during logout', error: err.message });
  }
};


// ...... AUTH MIDDLEWARE .......

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ status: false, message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded;
    next();

  } catch (error) {
    res.status(401).json({ status: false, message: 'Invalid token' });
  }
};


// ..... APPLY .....

const submitApplication = async (req, res) => {
  const { opportunity } = req.body;

  try {
    const userId = req.user.userId;

    const newApplication = new InternshipApplication({
      userId,
      stipend: opportunity.stipend,
      location: {
        office: opportunity.location?.office,
        stipend: opportunity.location?.stipend
      },
      role: opportunity.role,
      company: opportunity.company
    });

    await newApplication.save();

    await UserModel.findByIdAndUpdate(userId, {
      $push: { applications: newApplication._id }
    });

    res.status(200).json({ message: 'Application submitted successfully', applied: opportunity });

  } catch (err) {
    res.status(500).json({ message: 'Error submitting application', error: err.message });
  }
};


// .... GET APPLIED ....

const getUserApplications = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await UserModel.findById(userId).populate('applications');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.applications);

  } catch (err) {
    res.status(500).json({ message: 'Error retrieving applications', error: err.message });
  }
};


//... ROUTES ....

app.post('/register', registerUser);
app.post('/login', userLogin);
app.post('/logout', userLogout);

app.get('/home', authenticateUser, (req, res) => {
  res.status(200).json({
    status: true,
    message: 'User authenticated'
  });
});

app.post('/apply', authenticateUser, submitApplication);
app.get('/applied', authenticateUser, getUserApplications);


// .... GLOBAL ERROR ....

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Server error', error: err.message });
});


// ..... START SERVER ....

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
