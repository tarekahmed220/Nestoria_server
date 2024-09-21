export const complaintResponseTemplate = (name) => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Response to Your Complaint</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; text-align:start">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
              <tr>
                  <td style="text-align: center; padding: 20px;">
                      <img style="width:380px" src="https://res.cloudinary.com/delh2nrhf/image/upload/v1725669707/ret9qdnd3owvpirtgzso.png" alt="Nestoria" style="max-width: 100%; height: auto; border-radius: 8px;">
                  </td>
              </tr>
              <tr>
                  <td style="padding: 20px; color: #333;">
                      <h1 style="font-size: 24px; margin-bottom: 20px; color: #333;">Response to Your Complaint</h1>
                      <p style="margin-bottom: 20px;">Hi ${name},</p>
                      <p style="margin-bottom: 20px;">Thank you for reaching out to us. We want you to know that we are committed to helping you with your issue.</p>
                      <p style="margin-bottom: 20px;">Please allow us up to 12 hours to respond to your complaint. We appreciate your patience and understanding.</p>
                      <p style="margin-top: 20px;">Best regards,</p>
                      <p style="margin-top: 20px;">The Nestoria Team</p>
                  </td>
              </tr>
              <tr>
                  <td style="text-align: center; padding: 10px; font-size: 14px; color: #666;">
                      &copy; 2024 Nestoria. All rights reserved.
                  </td>
              </tr>
          </table>
      </body>
      </html>
      `;
};
