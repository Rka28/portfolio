const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import email service
const { sendWelcomeEmail } = require('./utils/emailService');

// Import database connection
const { testConnection } = require('./config/db');

// Import models
const subscribersModel = require('./models/subscribers');
const contactsModel = require('./models/contacts');
const commentsModel = require('./models/comments');

// Initialize Express app
const app = express();

/* -------------------------------
   🔐 CONFIGURATION DU CORS
--------------------------------- */
const allowedOrigins = [
  'https://portfolio-gmxs.onrender.com',
  'https://www.portfolio-gmxs.onrender.com',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080'
];

const corsOptions = {
  origin: function (origin, callback) {
    // En production, même domaine = pas de CORS strict nécessaire
    if (!origin || process.env.NODE_ENV === 'production') {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('🚫 CORS blocked:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

/* -------------------------------
   💾 BASE DE DONNÉES
--------------------------------- */
testConnection();

const initDatabase = async () => {
  try {
    await subscribersModel.createTable();
    await contactsModel.createTable();
    await commentsModel.createTable();
    await commentsModel.createUsersTable();
    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database tables:', error);
  }
};

initDatabase();

/* -------------------------------
   📬 ROUTES API - DOIVENT ÊTRE AVANT app.get('*')
--------------------------------- */

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Newsletter subscription
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    const result = await subscribersModel.addSubscriber(email);
    
    if (result.success) {
      try {
        const emailResult = await sendWelcomeEmail(email);
        if (emailResult.success) {
          console.log(`📧 Welcome email sent to: ${email}`);
          await subscribersModel.updateLastEmailSent(email);
        } else {
          console.error('Email send failed:', emailResult.error);
        }
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
      }

      return res.status(201).json({ 
        success: true, 
        message: 'Successfully subscribed to newsletter' 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'Failed to subscribe', 
      error: result.error 
    });
  } catch (error) {
    console.error('Error in subscribe endpoint:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Unsubscribe
app.post('/api/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const result = await subscribersModel.unsubscribe(email);
    
    if (result.success) {
      return res.status(200).json({ 
        success: true, 
        message: 'Successfully unsubscribed from newsletter' 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'Failed to unsubscribe', 
      error: result.error 
    });
  } catch (error) {
    console.error('Error in unsubscribe endpoint:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and message are required' 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    const result = await contactsModel.addContact(name, email, message);
    
    if (result.success) {
      return res.status(201).json({ 
        success: true, 
        message: 'Message sent successfully' 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'Failed to send message', 
      error: result.error 
    });
  } catch (error) {
    console.error('Error in contact endpoint:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

/* -------------------------------
   👤 AUTHENTIFICATION UTILISATEUR
--------------------------------- */

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email and password are required' 
      });
    }

    const result = await commentsModel.registerUser(email, password, name);
    
    if (result.success) {
      return res.status(201).json({ 
        success: true, 
        message: 'User registered successfully', 
        id: result.id 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to register user', 
      error: result.error 
    });
  } catch (error) {
    console.error('Error in register endpoint:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    const result = await commentsModel.loginUser(email, password);
    
    if (result.success) {
      return res.status(200).json({ 
        success: true, 
        user: result.user 
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials' 
    });
  } catch (error) {
    console.error('Error in login endpoint:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

/* -------------------------------
   💬 COMMENTS
--------------------------------- */

app.post('/api/comments', async (req, res) => {
  try {
    const { projectId, name, email, comment, parentId } = req.body;
    
    if (!projectId || !name || !email || !comment) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    const result = await commentsModel.addComment(
      projectId, 
      name, 
      email, 
      comment, 
      parentId || null
    );
    
    if (result.success) {
      return res.status(201).json({ 
        success: true, 
        message: 'Comment added', 
        id: result.id 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to add comment', 
      error: result.error 
    });
  } catch (error) {
    console.error('Error in add comment endpoint:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

app.get('/api/comments/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    console.log(`📝 Fetching comments for project: ${projectId}`);
    
    const result = await commentsModel.getCommentsByProject(projectId);
    
    if (result.success) {
      return res.status(200).json({ 
        success: true, 
        comments: result.comments || [] 
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to get comments', 
      error: result.error 
    });
  } catch (error) {
    console.error('Error in get comments endpoint:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
});

/* -------------------------------
   📦 SERVIR LE CLIENT EN PRODUCTION
--------------------------------- */

if (process.env.NODE_ENV === 'production') {
  // Servir les fichiers statiques du build React
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  // ⚠️ IMPORTANT : Cette route DOIT être la DERNIÈRE
  // Elle capture toutes les routes non-API pour React Router
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

/* -------------------------------
   🚀 START SERVER
--------------------------------- */

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 PORT: ${PORT}`);
});