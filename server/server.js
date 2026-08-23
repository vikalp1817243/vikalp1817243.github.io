const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Security Headers
app.use(helmet());

// CORS config
const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN || '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Anti-Spam Rate Limiter (5 requests per hour)
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Too many submissions. Please try again in an hour.' }
});

// SMTP Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// API Route
app.post('/api/contact', contactLimiter, [
  body('email').isEmail().normalizeEmail(),
  body('subject').trim().notEmpty(),
  body('message').trim().notEmpty()
], async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Invalid input parameters detected.' });
  }

  // Server-side HTML sanitization
  const cleanEmail = req.body.email;
  const cleanSubject = sanitizeHtml(req.body.subject);
  const cleanMessage = sanitizeHtml(req.body.message);

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.RECEIVER_EMAIL,
    replyTo: cleanEmail,
    subject: `[Cyberpunk Portfolio] ${cleanSubject}`,
    text: `Sender: ${cleanEmail}\n\nMessage:\n${cleanMessage}`,
    html: `<h3>New Message via Portfolio</h3>
           <p><strong>Sender:</strong> ${cleanEmail}</p>
           <p><strong>Subject:</strong> ${cleanSubject}</p>
           <p><strong>Message:</strong></p>
           <p>${cleanMessage.replace(/\n/g, '<br>')}</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Payload transmitted successfully.' });
  } catch (error) {
    console.error('Nodemailer error:', error);
    res.status(500).json({ error: 'Mail transmission failure.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server offline-bypass running on port ${PORT}`));
