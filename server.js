// vdyn need axfx lejl


const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

// In-memory storage for OTPs
const otpStore = {};

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email provider
    auth: {
        user: 'devpateldeveloper99@gmail.com', // Your email
        pass: 'vdyn need axfx lejl', // Your email password (use app-specific password if 2FA is enabled)
    },
});

// API to send OTP
app.post('/send-otp', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // Expires in 5 minutes

    const mailOptions = {
        from: 'devpatel1828king@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to send OTP' });
        }
        res.json({ message: 'OTP sent successfully' });
    });
});

// API to verify OTP
app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }

    const storedOtp = otpStore[email];
    if (!storedOtp) {
        return res.status(400).json({ error: 'OTP not found for this email' });
    }

    if (Date.now() > storedOtp.expiresAt) {
        return res.status(400).json({ error: 'OTP expired' });
    }

    if (storedOtp.otp !== otp) {
        return res.status(400).json({ error: 'Invalid OTP' });
    }

    // OTP is valid
    delete otpStore[email]; // Remove the OTP after successful verification
    res.json({ message: 'OTP verified successfully' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
