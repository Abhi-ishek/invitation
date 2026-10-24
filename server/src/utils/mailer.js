import nodemailer from 'nodemailer';

export const sendEmailNotification = async ({ to, subject, html }) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(`✉️ [DEV EMAIL SIMULATOR]`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Preview: ${html.slice(0, 150)}...`);
      return { simulated: true };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Wedding Wishcraft Atelier" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✨ Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`⚠️ Email notification error:`, error.message);
    return null;
  }
};
