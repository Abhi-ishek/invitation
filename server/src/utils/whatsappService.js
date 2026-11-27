const DEFAULT_OWNER_WHATSAPP = '917018353733';

/**
 * Format saved order + wedding details into a clean WhatsApp message for the owner.
 */
export const formatWeddingDetailsMessage = (order) => {
  const wd = order?.weddingDetails || {};
  const customer = order?.customerDetails || {};
  const items = Array.isArray(order?.items)
    ? order.items.map((item) => item.title).filter(Boolean).join(', ')
    : '';

  const lines = [
    `💍 *New Wedding Details Submitted*`,
    `*Order:* ${order?.orderNumber || 'N/A'}`,
  ];

  if (customer.name || customer.phone || customer.email) {
    lines.push('');
    lines.push('*Customer Contact:*');
    if (customer.name) lines.push(`• Name: ${customer.name}`);
    if (customer.phone) lines.push(`• Phone: ${customer.phone}`);
    if (customer.email) lines.push(`• Email: ${customer.email}`);
  }

  if (items) {
    lines.push(`• Template: ${items}`);
  }

  lines.push('');
  lines.push('*Groom & Family:*');
  lines.push(`• Groom: ${wd.groomName || 'N/A'}`);
  if (wd.groomFatherName) lines.push(`• Father: ${wd.groomFatherName}`);
  if (wd.groomMotherName) lines.push(`• Mother: ${wd.groomMotherName}`);

  lines.push('');
  lines.push('*Bride & Family:*');
  lines.push(`• Bride: ${wd.brideName || 'N/A'}`);
  if (wd.brideFatherName) lines.push(`• Father: ${wd.brideFatherName}`);
  if (wd.brideMotherName) lines.push(`• Mother: ${wd.brideMotherName}`);

  if (wd.haldiDate || wd.haldiTimings || wd.haldiVenue) {
    lines.push('');
    lines.push('*Haldi Ceremony:*');
    if (wd.haldiDate) lines.push(`• Date: ${wd.haldiDate}`);
    if (wd.haldiTimings) lines.push(`• Timings: ${wd.haldiTimings}`);
    if (wd.haldiVenue) lines.push(`• Venue: ${wd.haldiVenue}`);
  }

  if (wd.mehendiDate || wd.mehendiTimings || wd.mehendiVenue) {
    lines.push('');
    lines.push('*Mehendi Ceremony:*');
    if (wd.mehendiDate) lines.push(`• Date: ${wd.mehendiDate}`);
    if (wd.mehendiTimings) lines.push(`• Timings: ${wd.mehendiTimings}`);
    if (wd.mehendiVenue) lines.push(`• Venue: ${wd.mehendiVenue}`);
  }

  lines.push('');
  lines.push('*Wedding Ceremony (Main):*');
  lines.push(`• Date: ${wd.weddingDate || 'N/A'}`);
  if (wd.weddingTimings) lines.push(`• Timings: ${wd.weddingTimings}`);
  lines.push(`• Venue: ${wd.weddingVenue || 'N/A'}`);

  if (wd.additionalNotes) {
    lines.push('');
    lines.push(`*Notes / Hashtag:* ${wd.additionalNotes}`);
  }

  return lines.join('\n');
};

/**
 * Dispatch an automated WhatsApp message to the owner if a server-side provider
 * (Meta Cloud API, Twilio WhatsApp, or CallMeBot) is configured in environment variables.
 * Never throws so order saving is never blocked.
 */
export const sendOwnerWhatsAppNotification = async (message) => {
  const targetDigits = (process.env.OWNER_WHATSAPP_NUMBER || DEFAULT_OWNER_WHATSAPP).replace(/\D/g, '');
  const targetE164 = `+${targetDigits}`;

  // 1. Meta WhatsApp Cloud API
  if (process.env.WHATSAPP_CLOUD_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_CLOUD_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: targetDigits,
            type: 'text',
            text: { body: message },
          }),
        }
      );
      if (response.ok) {
        return { success: true, provider: 'meta_cloud_api' };
      }
      const errText = await response.text();
      console.warn('Meta WhatsApp Cloud API error:', errText);
    } catch (err) {
      console.warn('Meta WhatsApp Cloud API request failed:', err.message);
    }
  }

  // 2. Twilio WhatsApp
  if (
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_WHATSAPP_FROM
  ) {
    try {
      const twilioModule = await import('twilio');
      const client = twilioModule.default(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      const from = process.env.TWILIO_WHATSAPP_FROM.startsWith('whatsapp:')
        ? process.env.TWILIO_WHATSAPP_FROM
        : `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`;

      const msg = await client.messages.create({
        body: message,
        from,
        to: `whatsapp:${targetE164}`,
      });
      return { success: true, provider: 'twilio_whatsapp', messageId: msg.sid };
    } catch (err) {
      console.warn('Twilio WhatsApp dispatch failed:', err.message);
    }
  }

  // 3. CallMeBot (free personal WhatsApp webhook)
  if (process.env.WHATSAPP_CALLMEBOT_APIKEY) {
    try {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(
        targetDigits
      )}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(
        process.env.WHATSAPP_CALLMEBOT_APIKEY
      )}`;
      const response = await fetch(url);
      if (response.ok) {
        return { success: true, provider: 'callmebot' };
      }
      console.warn('CallMeBot WhatsApp error:', response.status);
    } catch (err) {
      console.warn('CallMeBot WhatsApp request failed:', err.message);
    }
  }

  return { success: false, skipped: true };
};
