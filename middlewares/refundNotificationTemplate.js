export const refundNotificationTemplate = (name, refundAmount) => {
  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Refund Issued</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; text-align:start">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <tr>
                    <td style="text-align: center; padding: 20px;">
                        <img style="width:380px" src="https://res.cloudinary.com/delh2nrhf/image/upload/v1725669707/ret9qdnd3owvpirtgzso.png" alt="Company Logo" style="max-width: 100%; height: auto; border-radius: 8px;">
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px; color: #333;">
                        <h1 style="font-size: 24px; margin-bottom: 20px; color: #333;">Refund Issued</h1>
                        <p style="margin-bottom: 20px;">Hi ${name},</p>
                        <p style="margin-bottom: 20px;">We would like to inform you that a refund of <strong>${refundAmount.toFixed(
                          2
                        )} EGP</strong> has been processed to your original payment method.</p>
                        <p style="margin-bottom: 20px;">The refund may take a few business days to reflect in your account, depending on your bank or payment provider.</p>
                        <p style="margin-bottom: 20px;">If you have any questions or need further assistance, please feel free to contact us.</p>
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
