export const acceptanceTemplate = (email, accountLinkUrl) => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Account Acceptance Notification</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="text-align: center; padding: 20px;">
              <img src="https://res.cloudinary.com/delh2nrhf/image/upload/v1725669707/ret9qdnd3owvpirtgzso.png" alt="Company Logo" style="width: 350px; max-width: 100%; height: auto; border-radius: 8px;">
            </td>
          </tr>
          <tr>
            <td style="padding: 20px; color: #333;">
              <h1 style="font-size: 24px; margin-bottom: 20px; color: #333;">Account Acceptance Confirmation</h1>
              <p style="margin-bottom: 20px;">Hi there!,</p>
              <p style="margin-bottom: 20px;">Your application has been accepted, and we are pleased to inform you that your account has been successfully created.</p>
              <p style="margin-bottom: 20px;">To complete the setup of your Stripe account, please click the button below:</p>
              <a href="${accountLinkUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px; margin-top: 20px;">Complete Your Account Setup</a>
              <p style="margin-top: 20px;">If you have any questions or need further assistance, please feel free to contact us.</p>
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
