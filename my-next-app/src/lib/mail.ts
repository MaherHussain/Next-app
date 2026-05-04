import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendPasswordResetEmail = async (email: string, resetUrl: string) => {
    const mailOptions = {
        from: `"ZFood Support" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: 'Password Reset Request',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; rounded-xl">
                <h2 style="color: #ea580c; text-align: center;">ZFood Password Reset</h2>
                <p>Hello,</p>
                <p>You requested a password reset for your ZFood partner account. Please click the button below to reset your password. This link will expire in 1 hour.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #ea580c; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px;">Reset Password</a>
                </div>
                <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
                <p style="word-break: break-all; color: #666;">${resetUrl}</p>
                <p>If you did not request this reset, please ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #999; text-align: center;">&copy; ${new Date().getFullYear()} ZFood. All rights reserved.</p>
            </div>
        `,
    };

    // If SMTP_HOST is not set, we'll log the email for testing instead of trying to send it
    if (!process.env.SMTP_HOST) {
        console.log('--- EMAIL MOCK ---');
        console.log(`To: ${email}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log(`Reset URL: ${resetUrl}`);
        console.log('------------------');
        return { message: 'Email logged to console (Mock Mode)' };
    }

    try {
        await transporter.sendMail(mailOptions);
        return { message: 'Email sent successfully' };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send reset email');
    }
};
