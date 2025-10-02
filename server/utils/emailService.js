const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Email templates
const emailTemplates = {
  welcome: (email) => ({
    subject: 'Welcome to Our Newsletter!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="background: linear-gradient(to right, #FFB86C, #FF6B6B); padding: 15px; border-radius: 5px 5px 0 0; text-align: center;">
          <h1 style="color: #000; margin: 0;">Welcome to Our Newsletter!</h1>
        </div>
        <div style="padding: 20px;">
          <p>Hello,</p>
          <p>Thank you for subscribing to our newsletter! We're excited to share our latest updates, projects, and insights with you.</p>
          <p>You'll be among the first to know when we launch new projects or have exciting announcements.</p>
          <p>Stay tuned!</p>
          <p>Best regards,<br>The Portfolio Team</p>
        </div>
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 0 0 5px 5px; text-align: center; font-size: 12px; color: #666;">
          <p>If you wish to unsubscribe, please click <a href="#">here</a>.</p>
        </div>
      </div>
    `
  }),
  newProject: (email, project) => ({
    subject: 'New Project Added: ' + project.title,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="background: linear-gradient(to right, #FFB86C, #FF6B6B); padding: 15px; border-radius: 5px 5px 0 0; text-align: center;">
          <h1 style="color: #000; margin: 0;">New Project Added!</h1>
        </div>
        <div style="padding: 20px;">
          <p>Hello,</p>
          <p>We're excited to announce that we've just added a new project to our portfolio:</p>
          <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h2 style="color: #333; margin-top: 0;">${project.title}</h2>
            <p>${project.description}</p>
            ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.title}" style="max-width: 100%; border-radius: 5px;">` : ''}
          </div>
          <p>Check out our portfolio to see the full details!</p>
          <p>Best regards,<br>The Portfolio Team</p>
        </div>
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 0 0 5px 5px; text-align: center; font-size: 12px; color: #666;">
          <p>If you wish to unsubscribe, please click <a href="#">here</a>.</p>
        </div>
      </div>
    `
  })
};

// Send welcome email to new subscriber
const sendWelcomeEmail = async (email) => {
  try {
    const template = emailTemplates.welcome(email);
    const mailOptions = {
      from: `"Portfolio Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: template.subject,
      html: template.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

// Send new project notification to all subscribers
const sendNewProjectEmail = async (subscribers, project) => {
  try {
    const results = [];
    
    for (const subscriber of subscribers) {
      const template = emailTemplates.newProject(subscriber.email, project);
      const mailOptions = {
        from: `"Portfolio Team" <${process.env.EMAIL_USER}>`,
        to: subscriber.email,
        subject: template.subject,
        html: template.html
      };

      const info = await transporter.sendMail(mailOptions);
      results.push({ email: subscriber.email, messageId: info.messageId });
    }

    console.log(`New project emails sent to ${results.length} subscribers`);
    return { success: true, results };
  } catch (error) {
    console.error('Error sending new project emails:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWelcomeEmail,
  sendNewProjectEmail
};