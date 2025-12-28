const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT) || 587;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;

/* ---------------- TRANSPORTER ---------------- */

let transporter = null;

if (smtpHost && smtpUser && smtpPass) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465, // true only for 465
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
} else {
  console.warn("⚠️ SMTP not configured. Emails will not be sent.");
}

/* ---------------- MAILGEN ---------------- */

const mailGenerator = new Mailgen({
  theme: process.env.MAILGEN_THEME || "default",
  product: {
    name: process.env.MAIL_PRODUCT_NAME || "Curry House",
    link: process.env.MAIL_PRODUCT_LINK || "https://curryhousejar.no",
    logo: process.env.MAIL_PRODUCT_LOGO || undefined,
  },
});

/* ---------------- OTP EMAIL TEMPLATE ---------------- */

function generateOtpEmail(otpOrOptions, ttlMinutesArg, recipientName) {
  // Support two call styles:
  // 1) generateOtpEmail({ otp, ttlMinutes, recipientName })
  // 2) generateOtpEmail(otp, ttlMinutes, recipientName)
  let otp;
  let ttlMinutes = ttlMinutesArg || Number(process.env.OTP_TTL_MINUTES) || 10;
  if (otpOrOptions && typeof otpOrOptions === "object") {
    otp = otpOrOptions.otp;
    ttlMinutes = otpOrOptions.ttlMinutes || ttlMinutes;
    recipientName = otpOrOptions.recipientName || recipientName;
  } else {
    otp = otpOrOptions;
  }

  // support mode: 'verify' (default) or 'reset' for password reset emails
  const mode =
    (otpOrOptions && otpOrOptions.mode) ||
    (ttlMinutesArg && ttlMinutesArg.mode) ||
    "verify";
  const introText =
    mode === "reset"
      ? "Use the following code to reset your password."
      : "Use the following code to verify your email address.";
  const outroText =
    mode === "reset"
      ? "If you did not request a password reset, please ignore this email or contact support."
      : "If you did not request this code, you can safely ignore this email.";

  const email = {
    body: {
      name: recipientName || "Customer",
      intro: introText,
      // OTP shown as centered bold button via Mailgen action
      action: [
        {
          instructions: `This code is valid for ${ttlMinutes} minutes.`,
          button: [
            {
              text: String(otp),
              color: process.env.MAIL_BUTTON_COLOR || "#FF6B35",
            },
          ],
        },
      ],
      outro: outroText,
    },
  };

  const html = mailGenerator.generate(email);
  function escapeRegExp(string) {
    return String(string).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  const otpStr = String(otp);
  const otpRegex = new RegExp(escapeRegExp(otpStr), "g");
  const styledSpan = `<span style="display:inline-block;font-size:28px;font-weight:700;letter-spacing:1px">${otpStr}</span>`;
  const htmlStyled = html.replace(otpRegex, styledSpan);

  const text = `${otpStr}\n\n${mailGenerator.generatePlaintext(email)}`;
  const defaultVerifySubj =
    process.env.MAIL_OTP_SUBJECT || "Your Curry House verification code";
  const defaultResetSubj =
    process.env.MAIL_OTP_RESET_SUBJECT || "Curry House password reset code";
  const subject = mode === "reset" ? defaultResetSubj : defaultVerifySubj;
  return { subject, html: htmlStyled, text };
}

/* ---------------- SEND MAIL ---------------- */

async function sendMail({ to, subject, otp, ttlMinutes, html, text }) {
  if (!transporter) {
    console.warn("⚠️ sendMail called but transporter not configured");
    return;
  }

  let finalHtml = html;
  let finalText = text;
  let finalSubject = subject;

  if (otp && !finalHtml && !finalText) {
    const built = generateOtpEmail(otp, ttlMinutes);
    finalHtml = built.html;
    finalText = built.text;
    finalSubject = finalSubject || built.subject;
  }

  const message = {
    from: process.env.SMTP_FROM || smtpUser,
    to,
    subject: finalSubject,
    html: finalHtml,
    text: finalText,
  };

  return transporter.sendMail(message);
}

module.exports = { sendMail, generateOtpEmail };
