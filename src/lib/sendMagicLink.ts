import nodemailer from 'nodemailer';

export const sendMagicLink = async (email: string, magicLink: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Change if using Outlook
    auth: {
      user: process.env.EMAIL_USER ?? 'arun.sfjbs@gmail.com', // Your personal email
      pass: process.env.EMAIL_PASS ?? 'xwkd zesr qvyc weki', // App password (not your email password)
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER ?? 'arun.sfjbs@gmail.com',
    to: email,
    subject: 'Your Magic Login Link',
    html: `
      <p>Click the link below to log in:</p>
      <p><a href="${magicLink}">${magicLink}</a></p>
      <p>This link expires in 15 minutes.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (error) {
    console.error('Error sending magic link:', error);
    throw new Error('Failed to send email');
  }
};
