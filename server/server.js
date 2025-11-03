const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { sendWelcomeEmail } = require('./utils/emailService');
const { testConnection } = require('./config/db');
const subscribersModel = require('./models/subscribers');
const contactsModel = require('./models/contacts');
const commentsModel = require('./models/comments');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test DB
testConnection();

// Init tables
const initDatabase = async () => {
  try {
    await subscribersModel.createTable();
    await contactsModel.createTable();
    await commentsModel.createTable();
    await commentsModel.createUsersTable();
    console.log('✅ Database OK');
  } catch (error) {
    console.error('❌ Database error:', error);
  }
};
initDatabase();

/* ===== ROUTES API ===== */

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API running' });
});

app.post('/api/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    const result = await subscribersModel.addSubscriber(email);
    if (result.success) {
      try {
        await sendWelcomeEmail(email);
        await subscribersModel.updateLastEmailSent(email);
      } catch (err) {
        console.error('Email error:', err);
      }
      return res.json({ success: true, message: 'Subscribed' });
    }
    return res.status(500).json({ success: false, message: 'Failed' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }
    const result = await contactsModel.addContact(name, email, message);
    return res.json(result.success ? { success: true } : { success: false });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/comments', async (req, res) => {
  try {
    const { projectId, name, email, comment, parentId } = req.body;
    if (!projectId || !name || !email || !comment) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }
    const result = await commentsModel.addComment(projectId, name, email, comment, parentId || null);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/comments/:projectId', async (req, res) => {
  try {
    const result = await commentsModel.getCommentsByProject(req.params.projectId);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }
    const result = await commentsModel.registerUser(email, password, name);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }
    const result = await commentsModel.loginUser(email, password);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/* ===== STATIC FILES - DERNIER ===== */

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

/* ===== START ===== */

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));