const bcrypt = require("bcryptjs");
const { sendMail, generateOtpEmail } = require("./mail");

const OTP_TTL_MINUTES = Number(process.env.OTP_TTL_MINUTES) || 10;

/**
 * Generate OTP for a user, store hashed OTP and expiry, and send email.
 * @param {Document} user Mongoose user document
 */
async function sendOtpToUser(user, options = {}) {
  if (!user) throw new Error("User is required");

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
    const genOpts = {
      otp,
      ttlMinutes: OTP_TTL_MINUTES,
      recipientName: user.name || user.email,
      mode: options.mode || "verify",
    };
    const { subject, html, text } = generateOtpEmail(genOpts);
    await sendMail({ to: user.email, subject, text, html });
  } catch (err) {
    const errMsg = err && err.message ? err.message : String(err);
    console.warn("Failed to send verification email (helper):", errMsg);

    // Add a notification to the user so they see the failure in-app
    try {
      user.notifications = user.notifications || [];
      user.notifications.unshift({
        title:
          options.mode === "reset"
            ? "Password reset email failed"
            : "Verification email failed",
        message:
          options.mode === "reset"
            ? `We were unable to send your password reset email: ${errMsg}. Tap 'Resend Code' to try again.`
            : `We were unable to send your verification email: ${errMsg}. Tap 'Resend Code' to try again.`,
        read: false,
      });
      await user.save();
      console.info(
        `Notification saved for ${user.email}, total notifications: ${user.notifications.length}`
      );
    } catch (nerr) {
      console.warn(
        "Failed to save notification on user:",
        nerr && nerr.message ? nerr.message : nerr
      );
    }
  }

  // Dev helper: log OTP to console when not in production so developers can test.
  if (process.env.NODE_ENV !== "production") {
    try {
      console.info(`DEV OTP for ${user.email}: ${otp}`);
    } catch (e) {
      // ignore
    }
  }

  return true;
}

module.exports = { sendOtpToUser };
