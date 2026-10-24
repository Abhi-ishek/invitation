import { ContactMessage } from '../models/ContactMessage.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { sendEmailNotification } from '../utils/mailer.js';

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, weddingDate, themeInterest, message } = req.body;

    if (!name || !email || !message) {
      throw new ApiError(400, 'Name, email, and message are required');
    }

    const saved = await ContactMessage.create({
      name,
      email,
      phone,
      weddingDate,
      themeInterest,
      message,
    });

    sendEmailNotification({
      to: email,
      subject: '💍 Received your inquiry - Wedding Wishcraft Concierge',
      html: `
        <h3>Dear ${name},</h3>
        <p>Thank you for reaching out to Wedding Wishcraft. Our wedding video specialist will contact you shortly.</p>
        <p>Your message: "${message}"</p>
      `,
    });

    res.status(201).json(new ApiResponse(201, saved, 'Your message has been received by our concierge'));
  } catch (error) {
    next(error);
  }
};
