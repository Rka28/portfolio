const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import email service for sending emails
const { sendWelcomeEmail, sendNewProjectEmail } = require('./utils/emailService');

// Import database connection
const { testConnection } = require('./config/db');

// Import models
const subscribersModel = require('./models/subscribers');
const contactsModel = require('./models/contacts');
const commentsModel = require('./models/comments');

// Initialize Express app
const app = express();

// Configuration CORS - IMPORTANT pour OVH
const allowedOrigins = [
  'https://votre-domaine.ovh',           // Votre domaine OVH
  'http://votre-domaine.ovh',            // Version HTTP
  'https://www.votre-domaine.ovh',       // Avec www
  'http://www.votre-domaine.ovh',        // Avec www HTTP
  'http://localhost:3000',               // Dev local
  'http://localhost:5173',               // Vite dev
  'http://localhost:8080'                // Autre port dev
];

const corsOptions = {
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origin (comme Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Route de santé pour tester l'API
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Test database connection
testConnection();
// Initialize database tables
const initDatabase = async () => {
  try {
    await subscribersModel.createTable();
    await contactsModel.createTable();
    await commentsModel.createTable();
    await commentsModel.createUsersTable();
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
  }
};

initDatabase();

// API Routes

// Newsletter subscription routes
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    
    const result = await subscribersModel.addSubscriber(email);
    
    if (result.success) {
      // Send welcome email using Nodemailer
      try {
        // Send the welcome email
        const emailResult = await sendWelcomeEmail(email);
        
        if (emailResult.success) {
          console.log('Welcome email sent to:', email);
          
          // Update the last_email_sent timestamp
          await subscribersModel.updateLastEmailSent(email);
        } else {
          console.error('Failed to send welcome email:', emailResult.error);
        }
      } catch (emailError) {
        // Log the error but don't fail the subscription process
        console.error('Error sending welcome email:', emailError);
      }
      
      return res.status(201).json({ success: true, message: 'Successfully subscribed to newsletter' });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to subscribe', error: result.error });
    }
  } catch (error) {
    console.error('Error in subscribe endpoint:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.post('/api/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    
    const result = await subscribersModel.unsubscribe(email);
    
    if (result.success) {
      return res.status(200).json({ success: true, message: 'Successfully unsubscribed from newsletter' });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to unsubscribe', error: result.error });
    }
  } catch (error) {
    console.error('Error in unsubscribe endpoint:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Contact form routes
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    
    const result = await contactsModel.addContact(name, email, message);
    
    if (result.success) {
      return res.status(201).json({ success: true, message: 'Message sent successfully' });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to send message', error: result.error });
    }
  } catch (error) {
    console.error('Error in contact endpoint:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Comments routes
app.post('/api/comments', async (req, res) => {
  try {
    const { projectId, name, email, comment, parentId } = req.body;
    
    if (!projectId || !name || !email || !comment) {
      return res.status(400).json({ success: false, message: 'Project ID, name, email, and comment are required' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    
    const result = await commentsModel.addComment(projectId, name, email, comment, parentId || null);
    
    if (result.success) {
      return res.status(201).json({ success: true, message: 'Comment added successfully', id: result.id });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to add comment', error: result.error });
    }
  } catch (error) {
    console.error('Error in add comment endpoint:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.get('/api/comments/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    if (!projectId) {
      return res.status(400).json({ success: false, message: 'Project ID is required' });
    }
    
    const result = await commentsModel.getCommentsByProject(projectId);
    
    if (result.success) {
      return res.status(200).json({ success: true, comments: result.comments });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to get comments', error: result.error });
    }
  } catch (error) {
    console.error('Error in get comments endpoint:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.get('/api/comments/replies/:commentId', async (req, res) => {
  try {
    const { commentId } = req.params;
    
    if (!commentId) {
      return res.status(400).json({ success: false, message: 'Comment ID is required' });
    }
    
    const result = await commentsModel.getReplies(commentId);
    
    if (result.success) {
      return res.status(200).json({ success: true, replies: result.replies });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to get replies', error: result.error });
    }
  } catch (error) {
    console.error('Error in get replies endpoint:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// User authentication routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    
    const result = await commentsModel.registerUser(email, password, name);
    
    if (result.success) {
      return res.status(201).json({ success: true, message: 'User registered successfully', id: result.id });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to register user', error: result.error });
    }
  } catch (error) {
    console.error('Error in register endpoint:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    
    const result = await commentsModel.loginUser(email, password);
    
    if (result.success) {
      return res.status(200).json({ success: true, user: result.user });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error in login endpoint:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

app.get('/api/user/comments', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    
    const result = await commentsModel.getCommentsByUser(email);
    
    if (result.success) {
      return res.status(200).json({ success: true, comments: result.comments });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to get user comments', error: result.error });
    }
  } catch (error) {
    console.error('Error in get user comments endpoint:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});