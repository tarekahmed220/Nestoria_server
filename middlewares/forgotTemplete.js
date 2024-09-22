export const forgotTemplete = (token, email, name) => {
  return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Request</title>
	</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; text-align:center">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <tr>
            <td style="text-align: center; padding: 20px;">
                <img style="width:380px" src="https://res.cloudinary.com/delh2nrhf/image/upload/v1725669707/ret9qdnd3owvpirtgzso.png" alt="Nestoria" style="max-width: 100%; height: auto; border-radius: 8px;">
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; color: #333;">
                <h1 style="font-size: 24px; margin-bottom: 20px; color: #333;">Password Reset Request</h1>
                <p style="margin-bottom: 20px;">Hi ${name},</p>
                <p style="margin-bottom: 20px;">Someone has requested a new password for the following account on Nestoria:</p>
                <p style="margin-bottom: 20px;"><strong>Email address:</strong> ${email}</p>
                <p style="margin-bottom: 20px;">If you didn't make this request, just ignore this email. If you'd like to proceed:</p>
                <a href="http://localhost:3000/resetpassword" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #ffffff; background-color: #ea580c; text-decoration: none; border-radius: 5px; margin-top: 20px;">Click here to reset your password</a>
                <p style="margin-top: 20px;">Thanks for reading.</p>
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
