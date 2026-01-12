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

// Send rejection notification email for venue registration
export const sendRejectionNotificationEmail = async (email, name, venueName, rejectedSection, rejectionReason) => {
  const sectionLabels = {
    venueName: 'Venue Name',
    phone: 'Phone Number',
    location: 'Location',
    profileImage: 'Profile Image',
    venueImages: 'Venue Images',
    citizenshipFront: 'Citizenship (Front)',
    citizenshipBack: 'Citizenship (Back)',
    businessRegistration: 'Business Registration',
    panCard: 'PAN Card',
  };

  const sectionLabel = sectionLabels[rejectedSection] || rejectedSection;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #5d0f0f; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">Saan - Registration Update</h1>
      </div>
      <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333;">Hello ${name},</p>
        <p style="font-size: 16px; color: #333;">We've reviewed your venue registration for <strong>${venueName}</strong> and found an issue that requires your attention.</p>

        <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 15px 20px; border-radius: 0 8px 8px 0; margin: 20px 0;">
          <p style="margin: 0 0 8px 0; font-size: 14px; color: #991b1b; font-weight: 600;">
            <span style="margin-right: 8px;">❌</span>Section Rejected: ${sectionLabel}
          </p>
          <p style="margin: 0; font-size: 14px; color: #b91c1c;">
            <strong>Reason:</strong> ${rejectionReason}
          </p>
        </div>

        <div style="background-color: #fff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #1f2937;">What You Need To Do:</h3>
          <ol style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px;">
            <li style="margin-bottom: 8px;">Log in to your Saan account</li>
            <li style="margin-bottom: 8px;">Go to Venue Registration</li>
            <li style="margin-bottom: 8px;">Update the rejected section with correct information</li>
            <li>Submit your registration again for review</li>
          </ol>
        </div>

        <p style="font-size: 14px; color: #666;">
          <strong>Note:</strong> Only the rejected section needs to be corrected. All other approved sections are locked and cannot be modified.
        </p>

        <div style="text-align: center; margin: 25px 0;">
          <a href="http://localhost:5173/venue-owner/registration"
             style="display: inline-block; background-color: #5d0f0f; color: white; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: 600; font-size: 14px;">
            Update Registration
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          If you have any questions, please contact our support team.<br>
          This is an automated message from Saan App. Please do not reply.
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Saan App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Action Required: Update Your Venue Registration - ${sectionLabel}`,
    html,
  });
};

// Send approval notification email for venue registration
export const sendApprovalNotificationEmail = async (email, name, venueName) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #059669; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">🎉 Congratulations!</h1>
      </div>
      <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333;">Hello ${name},</p>
        <p style="font-size: 16px; color: #333;">Great news! Your venue registration has been <strong>approved</strong>.</p>

        <div style="background-color: #d1fae5; border-left: 4px solid #059669; padding: 20px; border-radius: 0 8px 8px 0; margin: 20px 0; text-align: center;">
          <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
          <h2 style="margin: 0 0 8px 0; font-size: 22px; color: #065f46;">${venueName}</h2>
          <p style="margin: 0; font-size: 14px; color: #047857; font-weight: 600;">
            Your venue is now verified and active!
          </p>
        </div>

        <div style="background-color: #fff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #1f2937;">What's Next?</h3>
          <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px;">
            <li style="margin-bottom: 8px;">Your venue is now visible to users on Saan</li>
            <li style="margin-bottom: 8px;">You can manage your venue details from your dashboard</li>
            <li style="margin-bottom: 8px;">Start receiving bookings and inquiries</li>
            <li>Keep your venue information updated for best results</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 25px 0;">
          <a href="http://localhost:5173/venue-owner/dashboard"
             style="display: inline-block; background-color: #059669; color: white; text-decoration: none; padding: 14px 35px; border-radius: 8px; font-weight: 600; font-size: 14px;">
            Go to Dashboard
          </a>
        </div>

        <p style="font-size: 14px; color: #666; text-align: center;">
          Thank you for choosing Saan to showcase your venue!
        </p>

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">
          If you have any questions, please contact our support team.<br>
          This is an automated message from Saan App. Please do not reply.
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Saan App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🎉 Congratulations! Your Venue "${venueName}" is Now Verified - Saan`,
    html,
  });
};
