import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    
    // For development: Log the reset link so you can test the functionality
    if (process.env.NODE_ENV === 'development' && params.text?.includes('Click the link below')) {
      const resetLinkMatch = params.text.match(/(http[s]?:\/\/[^\s]+)/);
      if (resetLinkMatch) {
        console.log('\n=== DEVELOPMENT MODE - PASSWORD RESET LINK ===');
        console.log('Since email sending failed, here is your reset link:');
        console.log(resetLinkMatch[0]);
        console.log('Copy and paste this URL in your browser to reset your password.');
        console.log('===============================================\n');
        // In development, consider this a "success" for testing purposes
        return true;
      }
    }
    
    return false;
  }
}

export async function sendPasswordResetEmail(
  userEmail: string, 
  resetToken: string, 
  baseUrl: string
): Promise<boolean> {
  const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;
  
  const emailParams: EmailParams = {
    to: userEmail,
    from: "tbiafore@gmail.com", // Using the same email domain as SendGrid sender identity
    subject: "Password Reset Request - The RPG Vault",
    text: `
Hello,

You requested to reset your password for The RPG Vault.

Click the link below to reset your password:
${resetLink}

This link will expire in 30 minutes for security reasons.

If you didn't request this password reset, please ignore this email.

Best regards,
The RPG Vault Team
    `,
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
    `
  };

  return await sendEmail(emailParams);
}