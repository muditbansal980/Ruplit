import { env } from "../config/env.js";

interface SendMailParams {
  to: string;
  subject: string;
  htmlContent: string;
}

/**
 * Provider-agnostic email service.
 * Currently uses Brevo (formerly Sendinblue) HTTP API.
 * Swap the implementation below to change providers.
 */
export async function sendMail({
  to,
  subject,
  htmlContent,
}: SendMailParams): Promise<void> {
  const apiKey = env.BREVO_API_KEY;

  if (!apiKey || apiKey === "your_brevo_api_key_here") {
    console.warn(
      `[Email] Brevo API key not configured. Skipping email to ${to}: "${subject}"`
    );
    return;
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
        accept: "application/json",
      },
      body: JSON.stringify({
        // Brevo auto-uses the account's default sender when sender is omitted.
        // This avoids the "unverified sender" problem.
        sender: { email: "muditban2008@gmail.com", name: "Bank Sahayak" },
        to: [{ email: to }],
        subject,
        htmlContent,
      }),
    });

    const responseBody = await response.json();

    if (!response.ok) {
      // Brevo returns error details in the body
      const errorMsg =
        (responseBody as any)?.message ||
        (responseBody as any)?.error?.message ||
        JSON.stringify(responseBody);
      console.error(`[Email] Brevo API error (${response.status}):`, errorMsg);
      throw new Error(`Email send failed: ${response.status} — ${errorMsg}`);
    }

    console.log(`[Email] Sent to ${to}: "${subject}" (Brevo msgId: ${(responseBody as any)?.messageId})`);
  } catch (err) {
    console.error("[Email] Failed to send:", err);
    // Don't throw — email failure shouldn't block the request
  }
}

/**
 * Send expense notification email to a friend.
 */
export async function sendExpenseNotification(params: {
  to: string;
  fromName: string;
  amount: number;
  description: string;
}): Promise<void> {
  const { to, fromName, amount, description } = params;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
      <h2 style="color: #1a1a1a;">Bank Sahayak — Expense Notification</h2>
      <p style="font-size: 16px; color: #333;">
        <strong>${fromName}</strong> has logged an expense with you.
      </p>
      <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p style="margin: 0; font-size: 24px; font-weight: bold; color: #1a1a1a;">
          ₹${amount.toLocaleString("en-IN")}
        </p>
        <p style="margin: 8px 0 0; color: #666;">${description}</p>
      </div>
      <p style="font-size: 14px; color: #999;">
        This means you owe ₹${amount.toLocaleString("en-IN")} to ${fromName}.
      </p>
    </div>
  `;

  await sendMail({
    to,
    subject: `${fromName} logged ₹${amount} expense with you — Bank Sahayak`,
    htmlContent,
  });
}
