const verifyEmailTemplate = ({ name, url }) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.5;">
    <h2>Hi ${name},</h2>
    <p>Thank you for registering with Blinkit. To complete your registration, please verify your email address by clicking the button below:</p>
    <a href="${url}" 
       style="display: inline-block; padding: 10px 20px; color: white; background-color: blue; text-decoration: none; border-radius: 5px;">
       Verify Your Email
    </a>
    <p>If you did not request this registration, please ignore this email.</p>
    <p>Best regards,<br/>The Blinkit Team</p>
  </div>
`;

export default verifyEmailTemplate;
