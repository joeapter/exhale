import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.migadu.com",
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = `EXHALE <${process.env.SMTP_USER ?? "booking@exhale.co.il"}>`;
const ADMIN = process.env.EMAIL_TO ?? "booking@exhale.co.il";

// ── Registration: confirmation to guest ───────────────────────────────────────
export async function sendRegistrationConfirmation(data: {
  firstName: string;
  lastName: string;
  email: string;
  packageName: string;
  paymentType: string;
  amountDue: number;
  confirmationRef: string;
}) {
  const amount = new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 0,
  }).format(data.amountDue / 100);

  await transporter.sendMail({
    from: FROM,
    to: data.email,
    subject: `Your place is reserved — EXHALE Desert Escape`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #3D2E22;">
        <p style="font-size: 1.5rem; font-weight: 300; margin-bottom: 1.5rem;">
          ${data.firstName},
        </p>
        <p style="line-height: 1.8; margin-bottom: 1rem;">
          Your place at <strong>EXHALE Desert Escape</strong> (June 7–9, Noor Glamping) is reserved.
        </p>
        <p style="line-height: 1.8; margin-bottom: 1rem;">
          <strong>Package:</strong> ${data.packageName}<br>
          <strong>Payment:</strong> ${data.paymentType === "DEPOSIT" ? "Deposit" : "Full payment"} — ${amount}<br>
          <strong>Reference:</strong> ${data.confirmationRef}
        </p>
        <p style="line-height: 1.8; margin-bottom: 1rem;">
          We'll be in touch shortly with arrival details, a packing list, and everything you need to know before June.
        </p>
        <p style="line-height: 1.8; margin-bottom: 2rem;">
          If you have any questions in the meantime, reply to this email or reach us at booking@exhale.co.il.
        </p>
        <p style="line-height: 1.8; color: #7A6A5A; font-style: italic;">
          We can't wait to welcome you to the desert.
        </p>
        <p style="line-height: 1.8;">— The EXHALE Team</p>
        <hr style="border: none; border-top: 1px solid #E4D8C9; margin: 2rem 0;">
        <p style="font-size: 0.75rem; color: #9B8F84;">
          EXHALE Desert Escape · exhale.co.il · booking@exhale.co.il
        </p>
      </div>
    `,
  });
}

// ── Registration: notification to admin ───────────────────────────────────────
export async function sendRegistrationNotification(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  packageName: string;
  paymentType: string;
  amountDue: number;
  confirmationRef: string;
  roomingPref: string;
  dietaryNeeds?: string;
  healthNotes?: string;
  additionalNotes?: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRel?: string;
}) {
  const amount = new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 0,
  }).format(data.amountDue / 100);

  await transporter.sendMail({
    from: FROM,
    to: ADMIN,
    subject: `New registration: ${data.firstName} ${data.lastName} — ${data.packageName}`,
    html: `
      <div style="font-family: monospace; max-width: 560px; margin: 0 auto; color: #3D2E22;">
        <h2 style="font-family: Georgia, serif; font-weight: 300;">New Registration</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 4px 8px; color: #7A6A5A;">Ref</td><td style="padding: 4px 8px;">${data.confirmationRef}</td></tr>
          <tr><td style="padding: 4px 8px; color: #7A6A5A;">Name</td><td style="padding: 4px 8px;">${data.firstName} ${data.lastName}</td></tr>
          <tr><td style="padding: 4px 8px; color: #7A6A5A;">Email</td><td style="padding: 4px 8px;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td style="padding: 4px 8px; color: #7A6A5A;">Phone</td><td style="padding: 4px 8px;">${data.phone ?? "—"}</td></tr>
          <tr><td style="padding: 4px 8px; color: #7A6A5A;">Package</td><td style="padding: 4px 8px;">${data.packageName}</td></tr>
          <tr><td style="padding: 4px 8px; color: #7A6A5A;">Payment</td><td style="padding: 4px 8px;">${data.paymentType === "DEPOSIT" ? "Deposit" : "Full"} — ${amount}</td></tr>
          <tr><td style="padding: 4px 8px; color: #7A6A5A;">Rooming</td><td style="padding: 4px 8px;">${data.roomingPref}</td></tr>
          <tr><td style="padding: 4px 8px; color: #7A6A5A;">Dietary</td><td style="padding: 4px 8px;">${data.dietaryNeeds || "—"}</td></tr>
          <tr><td style="padding: 4px 8px; color: #7A6A5A;">Health</td><td style="padding: 4px 8px;">${data.healthNotes || "—"}</td></tr>
          <tr><td style="padding: 4px 8px; color: #7A6A5A;">Notes</td><td style="padding: 4px 8px;">${data.additionalNotes || "—"}</td></tr>
          <tr><td style="padding: 4px 8px; color: #7A6A5A;">Emergency</td><td style="padding: 4px 8px;">${data.emergencyName} · ${data.emergencyPhone}${data.emergencyRel ? ` (${data.emergencyRel})` : ""}</td></tr>
        </table>
      </div>
    `,
  });
}

// ── Contact form: notification to admin ───────────────────────────────────────
export async function sendContactNotification(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  await transporter.sendMail({
    from: FROM,
    to: ADMIN,
    replyTo: data.email,
    subject: `Contact: ${data.subject || "New message"} — ${data.name}`,
    html: `
      <div style="font-family: monospace; max-width: 560px; margin: 0 auto; color: #3D2E22;">
        <h2 style="font-family: Georgia, serif; font-weight: 300;">Contact Form</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem;">
          <tr><td style="padding: 4px 8px; color: #7A6A5A;">Name</td><td style="padding: 4px 8px;">${data.name}</td></tr>
          <tr><td style="padding: 4px 8px; color: #7A6A5A;">Email</td><td style="padding: 4px 8px;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td style="padding: 4px 8px; color: #7A6A5A;">Subject</td><td style="padding: 4px 8px;">${data.subject || "—"}</td></tr>
        </table>
        <p style="white-space: pre-wrap; line-height: 1.8;">${data.message}</p>
      </div>
    `,
  });
}
