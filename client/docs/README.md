# Portfolio Documentation

## Table of Contents

1. [User Guide](#user-guide)
   - [Language Selection](#language-selection)
   - [Navigation](#navigation)
   - [Contact Form](#contact-form)
   - [Newsletter Subscription](#newsletter-subscription)

2. [Technical Documentation](#technical-documentation)
   - [Project Structure](#project-structure)
   - [Multilingual System](#multilingual-system)
   - [Components](#components)
   - [API Integration](#api-integration)

## User Guide

### Language Selection
The website supports multiple languages:
- English (en)
- French (fr)
- Spanish (es)

Users can switch between languages using the language selector in the navigation menu.

### Navigation
The portfolio website features an intuitive navigation system with the following main sections:
- Portfolio Projects
- Skills & Expertise
- Contact Information

### Contact Form
The contact form allows visitors to send messages directly. Required fields include:
- Name
- Email
- Message

### Newsletter Subscription
Stay updated with new projects and updates by subscribing to the newsletter:
- Enter your email address
- Receive a welcome email
- Get notifications for new projects

## Technical Documentation

### Project Structure
The project follows a modular React architecture:
```
portfolio/
├── src/
│   ├── components/
│   ├── context/
│   ├── translations/
│   ├── Pages/
│   └── Asset/
└── server/
    ├── config/
    ├── models/
    └── utils/
```

### Multilingual System
The website implements a context-based translation system:
- Language context provider (`LanguageContext.jsx`)
- Translation files in `translations/` directory
- Language persistence using localStorage

### Components
Key components include:
- Language selector
- Project cards
- Contact form
- Newsletter subscription
- Social media links

### API Integration
The backend API handles:
- Contact form submissions
- Newsletter subscriptions
- Email notifications
- Database operations
