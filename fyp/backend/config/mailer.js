import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Saan App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export const sendOtpEmail = async (email, otp, name) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #5d0f0f; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Saan - Email Verification</h1>
      </div>
      <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333;">Hello ${name},</p>
        <p style="font-size: 16px; color: #333;">Thank you for signing up! Please use the following OTP to verify your email address:</p>
        <div style="background-color: #5d0f0f; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 10px; letter-spacing: 8px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="font-size: 14px; color: #666;">This OTP will expire in <strong>10 minutes</strong>.</p>
        <p style="font-size: 14px; color: #666;">If you didn't request this verification, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">This is an automated message from Saan App. Please do not reply.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Saan App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email - Saan App",
    html,
  });
};
