import express from 'express';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/confirm-booking', async (req, res) => {
    const { bookingId, customerEmail, customerPhone, customerName, services, date, time } = req.body;

    const servicesList = Array.isArray(services) ? services.join(', ') : services;
    console.log(`Confirming booking ${bookingId} for ${customerName}`);

    // 1. Send Email using Nodemailer
    try {
      // Note: In a real app, these would be in .env
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: '"Éclat Salon" <no-reply@eclatsalon.com>',
        to: customerEmail,
        subject: 'Booking Confirmed - Éclat Salon',
        text: `Hi ${customerName},\n\nYour booking for ${servicesList} on ${date} at ${time} has been confirmed!\n\nWe look forward to seeing you.\n\nBest regards,\nÉclat Salon`,
        html: `
          <div style="font-family: serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e5e5; border-radius: 10px;">
            <h1 style="color: #D4AF37; text-align: center;">Booking Confirmed</h1>
            <p>Hi <strong>${customerName}</strong>,</p>
            <p>Your appointment at <strong>Éclat Salon</strong> has been confirmed.</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Services:</strong> ${servicesList}</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${time}</p>
            </div>
            <p>We look forward to providing you with a luxury experience.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #888; text-align: center;">Éclat Salon - Luxury Hair & Beauty Excellence</p>
          </div>
        `,
      };

      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent to:', customerEmail);
      } else {
        console.warn('Email credentials missing. Skipping email send.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }

    // 2. WhatsApp Notification
    // In a real app, you'd use Twilio or WhatsApp Business API
    // For now, we'll log it and provide the link for the admin to use if needed
    console.log(`[WhatsApp Simulation] To: ${customerPhone}, Message: Your booking for ${servicesList} on ${date} at ${time} is confirmed!`);

    res.json({ success: true, message: 'Booking confirmed and notifications triggered.' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
