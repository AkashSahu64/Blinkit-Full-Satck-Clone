const forgotPasswordTemplate = ({ name, otp }) => {
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>Dear ${name},</p>
        <p>We received a request to reset the password for your Blinkit account. Please use the following One-Time Password (OTP) to proceed with resetting your password:</p>
        <div style="background-color: #f9f9f9; font-size: 20px; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #ddd; display: inline-block; margin: 10px 0;">
          <strong>${otp}</strong>
        </div>
        <p>This OTP is valid for <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email.</p>
        <p>If you have any concerns, feel free to contact our support team.</p>
        <br />
        <p>Best regards,</p>
        <p><strong>Blinkit Team</strong></p>
      </div>
    `;
  };
  
  export default forgotPasswordTemplate;
  