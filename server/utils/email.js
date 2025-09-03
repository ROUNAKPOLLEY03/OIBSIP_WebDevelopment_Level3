import nodemailer from "nodemailer";

// Create reusable transporter object using Gmail SMTP
const createTransporter = () => {
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log(
    "EMAIL_PASSWORD:",
    process.env.EMAIL_PASSWORD ? "Loaded" : "Missing"
  );
  return nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASSWORD, // Your Gmail App Password (not regular password!)
    },
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = createTransporter();

    const resetURL = `${process.env.CLIENT_URL}/resetPassword/${resetToken}`;

    const mailOptions = {
      from: `Pizza App <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request - Pizza App",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e53e3e;">Password Reset Request</h2>
          <p>Hi there!</p>
          <p>You requested a password reset for your Pizza App account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetURL}" 
             style="background-color: #e53e3e; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block; 
                    margin: 20px 0;">
            Reset Password
          </a>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetURL}</p>
          <p><strong>This link will expire in 10 minutes.</strong></p>
          <p>If you didn't request this reset, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Pizza App Team<br>
            This is an automated message, please do not reply.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

// Send email verification email
export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const transporter = createTransporter();

    const verifyURL = `${process.env.CLIENT_URL}/verifyEmail/${verificationToken}`;

    const mailOptions = {
      from: `Pizza App <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email - Pizza App",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #38a169;">Welcome to Pizza App! 🍕</h2>
          <p>Hi there!</p>
          <p>Thanks for signing up! Please verify your email address to complete your registration.</p>
          <a href="${verifyURL}" 
             style="background-color: #38a169; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; display: inline-block; 
                    margin: 20px 0;">
            Verify Email
          </a>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666;">${verifyURL}</p>
          <p><strong>This link will expire in 24 hours.</strong></p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Pizza App Team<br>
            This is an automated message, please do not reply.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
};
