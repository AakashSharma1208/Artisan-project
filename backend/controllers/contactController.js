const nodemailer = require('nodemailer');

exports.sendContactEmail = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Admin receives the email
            replyTo: email,             // So admin can reply to the user directly
            subject: `Artisan Contact Form: ${subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h2 style="color: #4f46e5; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Contact Request</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 20px;">
                        <p style="margin-top: 0;"><strong>Message:</strong></p>
                        <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Email Error:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
};
