export const templeteEmail = (token, name) => {
  return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Verify Your Account</title>
		<style>
			/* Reset Styles */
			* {
				margin: 0;
				padding: 0;
				box-sizing: border-box;
			}
			body {
				font-family: Arial, sans-serif;
				background-color: #f4f4f4;
			}
			.container {
				max-width: 600px;
				margin: 20px auto;
				background-color: #ffffff;
				border-radius: 8px;
				box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
				overflow: hidden;
			}
			.header {
				background-color: #ffffff;
				padding: 20px;
				text-align: center;
				color: white;
			}
			.header img {
				width: 380px;
				margin-bottom: 15px;
			}
			.content {
				padding: 20px;
				text-align: center;
				color: #333;
			}
			h1 {
				font-size: 24px;
				margin-bottom: 20px;
				color: #333;
			}
			p {
				margin-bottom: 20px;
				font-size: 16px;
				line-height: 1.6;
			}
			.button {
				display: inline-block;
				background-color: #ea580c;
				
				padding: 12px 30px;
				font-size: 16px;
				font-weight: bold;
				border-radius: 50px;
				text-decoration: none;
				margin: 10px 0;
				transition: background-color 0.3s ease;
			}
			.button:hover {
				background-color: #ea580c;
			}
			.footer {
				padding: 10px;
				text-align: center;
				font-size: 14px;
				color: #666;
				background-color: #f4f4f4;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="header">
				<img src="https://res.cloudinary.com/delh2nrhf/image/upload/v1725669707/ret9qdnd3owvpirtgzso.png" alt="Nestoria">
			</div>
			<div class="content">
				<h1>Verify Your Account</h1>
				<p>Hi ${name},</p>
				<p>Thank you for registering on Nestoria. To complete your registration and verify your account, please click the button below:</p>
				<a href="http://localhost:3000/confirmemail?token=${token}" class="button" style="color: #ffffff;">Verify Your Account</a>
				<a href="http://localhost:3000" class="button" style="color: #ffffff;">Go to Home Page</a>
				<p>If you did not create an account, please ignore this email.</p>
				<p>Thanks for choosing Nestoria!</p>
			</div>
			<div class="footer">
				&copy; 2024 Nestoria. All rights reserved.
			</div>
		</div>
	</body>
	</html>
	`;
};
