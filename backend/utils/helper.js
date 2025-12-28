const bcrypt = require('bcryptjs');
const { sendMail, generateOtpEmail } = require('./mail');

const OTP_TTL_MINUTES = Number(process.env.OTP_TTL_MINUTES) || 10;

/**
 * Generate OTP for a user, store hashed OTP and expiry, and send email.
 * @param {Document} user Mongoose user document
 */
async function sendOtpToUser(user) {
  if (!user) throw new Error('User is required');

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  user.emailVerification = {
    otpHash,
    expiresAt,
    attempts: 0,
    sentAt: new Date(),
  };

  await user.save();

  try {
    const { subject, html, text } = generateOtpEmail(
      otp,
      OTP_TTL_MINUTES,
      user.name || user.email
    );
    await sendMail({ to: user.email, subject, text, html });
  } catch (err) {
    console.warn('Failed to send verification email (helper):', err && err.message ? err.message : err);
  }

  return true;
}

module.exports = { sendOtpToUser };
