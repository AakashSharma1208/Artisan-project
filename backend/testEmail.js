require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
    try {
        console.log('Testing with USER:', process.env.EMAIL_USER);
        console.log('Testing with PASS length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Test Email From Artisan',
            text: 'This is a test email sent from the backend script.'
        });

        console.log('Email sent successfully:', info.response);
    } catch (error) {
        console.error('Email Error:', error);
    }
}

testEmail();
