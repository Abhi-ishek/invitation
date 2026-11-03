import crypto from 'crypto';

const OTP_SECRET = process.env.OTP_SECRET || 'wedding_wishcraft_otp_secret_key_2026';

/**
 * Standardize phone number format
 * Accepts: 9876543210, +91 98765 43210, 09876543210, etc.
 */
export const normalizePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return '';
  
  // Remove spaces, hyphens, and parentheses
  let cleaned = phone.replace(/[\s\-\(\)]/g, '').trim();

  // If starts with 0 and is 11 digits (e.g., 09876543210), strip the leading 0
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.substring(1);
  }

  // If it's a 10-digit number without country code, default to Indian (+91)
  if (/^\d{10}$/.test(cleaned)) {
    cleaned = `+91${cleaned}`;
  }

  return cleaned;
};

/**
 * Validate phone number format (E.164 or valid international format)
 */
export const isValidPhone = (phone) => {
  const normalized = normalizePhone(phone);
  // Matches international format starting with + followed by 10 to 15 digits
  return /^\+[1-9]\d{9,14}$/.test(normalized);
};

/**
 * Generate a cryptographically secure 6-digit numeric OTP
 */
export const generateOtp = (digits = 6) => {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return crypto.randomInt(min, max + 1).toString();
};

/**
 * Hash OTP using SHA-256 for secure storage
 */
export const hashOtp = (otp) => {
  return crypto
    .createHash('sha256')
    .update(`${otp}:${OTP_SECRET}`)
    .digest('hex');
};

/**
 * Verify entered OTP against stored hash
 */
export const verifyOtpHash = (enteredOtp, storedHash) => {
  if (!enteredOtp || !storedHash) return false;
  const hashToCompare = hashOtp(enteredOtp.toString().trim());
  return crypto.timingSafeEqual(Buffer.from(hashToCompare), Buffer.from(storedHash));
};

/**
 * Send SMS OTP via SMS provider or Simulated Dev logger
 */
export const sendSmsOtp = async ({ phone, otp, purpose = 'phone_verification' }) => {
  const normalized = normalizePhone(phone);

  // Check if Twilio is configured
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    try {
      // Dynamic import to avoid hard dependency if not installed
      const twilioModule = await import('twilio');
      const twilioClient = twilioModule.default(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      let smsBody = `Your Wedding Wishcraft verification code is: ${otp}. Valid for 10 minutes. Please do not share this code with anyone.`;
      if (purpose === 'payment_confirmation') {
        smsBody = `💍 Wedding Wishcraft: Payment confirmed for Order ${otp}! Your bespoke wedding invitation video is now in production. Thank you for choosing us!`;
      } else if (purpose === 'payment_submitted') {
        smsBody = `💍 Wedding Wishcraft: We received your UPI Reference for Order ${otp}. Our studio is verifying payment and will begin crafting your video!`;
      }

      const message = await twilioClient.messages.create({
        body: smsBody,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: normalized,
      });

      console.log(`📱 SMS successfully dispatched via Twilio to ${normalized} (SID: ${message.sid})`);
      return { success: true, provider: 'twilio', messageId: message.sid };
    } catch (error) {
      console.error(`⚠️ Twilio dispatch failed: ${error.message}. Falling back to simulation log.`);
    }
  }

  // Check if Fast2SMS is configured
  if (process.env.FAST2SMS_API_KEY) {
    try {
      const numbers = normalized.replace(/^\+91/, '');
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variables_values:
            purpose === 'payment_confirmation'
              ? `Payment confirmed for Order ${otp}`
              : purpose === 'payment_submitted'
              ? `Payment received for Order ${otp}, verification in progress`
              : otp,
          route: (purpose === 'payment_confirmation' || purpose === 'payment_submitted') ? 'q' : 'otp',
          numbers,
        }),
      });

      const data = await response.json();
      if (data.return) {
        console.log(`📱 SMS successfully dispatched via Fast2SMS to ${normalized}`);
        return { success: true, provider: 'fast2sms', data };
      }
    } catch (error) {
      console.error(`⚠️ Fast2SMS dispatch failed: ${error.message}`);
    }
  }

  // Simulated Console Mode (default when no 3rd-party SMS provider credentials are set)
  if (purpose === 'payment_confirmation') {
    console.log(`
╔═════════════════════════════════════════════════════════════════════╗
║   💰  WEDDING WISHCRAFT — PAYMENT CONFIRMATION SMS                  ║
╠═════════════════════════════════════════════════════════════════════╣
║   📞  Recipient:    ${normalized.padEnd(44)}║
║   🧾  Order No:     ${otp.padEnd(44)}║
║   ✅  Status:       Payment Confirmed & Verified by Studio          ║
║   💍  Message:      Thank you! Your bespoke wedding invitation      ║
║                     video is now in active production.              ║
║   ℹ️   Tip: Set TWILIO or FAST2SMS env vars for real carrier SMS    ║
╚═════════════════════════════════════════════════════════════════════╝
    `);
  } else if (purpose === 'payment_submitted') {
    console.log(`
╔═════════════════════════════════════════════════════════════════════╗
║   ⏳  WEDDING WISHCRAFT — UPI PAYMENT SUBMITTED SMS                 ║
╠═════════════════════════════════════════════════════════════════════╣
║   📞  Recipient:    ${normalized.padEnd(44)}║
║   🧾  Order No:     ${otp.padEnd(44)}║
║   🔍  Status:       UPI UTR Submitted — Verification in Progress    ║
║   💍  Message:      We received your UPI payment reference. Our     ║
║                     studio will verify & start video production!    ║
║   ℹ️   Tip: Set TWILIO or FAST2SMS env vars for real carrier SMS    ║
╚═════════════════════════════════════════════════════════════════════╝
    `);
  } else {
    console.log(`
╔═════════════════════════════════════════════════════════════════════╗
║   📱  WEDDING WISHCRAFT — OTP SIMULATION CONSOLE                    ║
╠═════════════════════════════════════════════════════════════════════╣
║   📞  Recipient:  ${normalized.padEnd(46)}║
║   🔑  OTP Code:   ${otp.padEnd(46)}║
║   🎯  Purpose:    ${purpose.padEnd(46)}║
║   ⏳  Validity:   10 minutes                                        ║
║   ℹ️   Tip: Set TWILIO or FAST2SMS env vars for real carrier SMS    ║
╚═════════════════════════════════════════════════════════════════════╝
    `);
  }

  return {
    success: true,
    simulated: true,
    recipient: normalized,
    // Only expose otp in simulated return object when not in strict production
    ...(process.env.NODE_ENV !== 'production' && { devOtp: otp }),
  };
};

