import nodemailer from 'nodemailer';

// Alternative email service using Nodemailer with Gmail
export async function sendPasswordResetEmailWithGmail(
  userEmail: string, 
  resetToken: string, 
  baseUrl: string,
  gmailUser?: string,
  gmailPassword?: string
): Promise<boolean> {
  
  if (!gmailUser || !gmailPassword) {
    console.log('Gmail credentials not provided, skipping Gmail email send');
    return false;
  }

  try {
    // Create transporter with Gmail SMTP
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPassword
      }
    });

    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"The RPG Vault" <${gmailUser}>`,
      to: userEmail,
      subject: 'Password Reset Request - The RPG Vault',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Password Reset - The RPG Vault</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #7c3aed, #9333ea); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="margin: 0; font-size: 24px;">The RPG Vault</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px;">Password Reset Request</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e9ecef;">
    <h2 style="color: #495057; margin-bottom: 20px;">Reset Your Password</h2>
    
    <p style="margin-bottom: 25px; font-size: 16px;">
      Hello! You requested to reset your password for your RPG Vault account.
    </p>
    
    <p style="margin-bottom: 30px;">
      Click the button below to reset your password:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}" 
         style="background: #7c3aed; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
        Reset Password
      </a>
    </div>
    
    <p style="margin-top: 30px; font-size: 14px; color: #6c757d;">
      If the button doesn't work, copy and paste this link into your browser:
      <br>
      <a href="${resetLink}" style="color: #7c3aed; word-break: break-all;">${resetLink}</a>
    </p>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
      <p style="font-size: 14px; color: #6c757d; margin-bottom: 10px;">
        <strong>Important:</strong> This password reset link will expire in 30 minutes for security reasons.
      </p>
      
      <p style="font-size: 14px; color: #6c757d;">
        If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
      </p>
    </div>
  </div>
  
  <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #6c757d;">
    <p>Best regards,<br>The RPG Vault Team</p>
  </div>
</body>
</html>
      `,
      text: `
Hello,

You requested to reset your password for The RPG Vault.

Click the link below to reset your password:
${resetLink}

This link will expire in 30 minutes for security reasons.

If you didn't request this password reset, please ignore this email.

Best regards,
The RPG Vault Team
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully via Gmail');
    return true;

  } catch (error) {
    console.error('Gmail email error:', error);
    return false;
  }
}