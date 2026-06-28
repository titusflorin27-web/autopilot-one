import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

type DemoRequestEmailPayload = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  website: string | null;
  message: string;
  source: string;
  status: string;
  createdAt: Date;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function optionalValue(value?: string | null) {
  return value?.trim() || "Nespecificat";
}

@Injectable()
export class DemoRequestEmailService {
  private readonly logger = new Logger(DemoRequestEmailService.name);

  constructor(private readonly config: ConfigService) {}

  async sendNewDemoRequestNotification(demoRequest: DemoRequestEmailPayload) {
    const apiKey = this.config.get<string>("RESEND_API_KEY");
    const to = this.config.get<string>("DEMO_REQUEST_NOTIFICATION_TO");
    const from = this.config.get<string>("DEMO_REQUEST_NOTIFICATION_FROM");

    if (!apiKey || !to || !from) {
      this.logger.debug("Demo request email notification skipped: email provider is not configured.");
      return;
    }

    const appUrl = this.config.get<string>("APP_PUBLIC_URL") ?? "https://app.autopilot-one.com";
    const inboxUrl = `${appUrl.replace(/\/$/, "")}/demo-requests`;
    const subject = `Cerere demo nouă: ${demoRequest.name}`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: to.split(",").map((email) => email.trim()).filter(Boolean),
        reply_to: demoRequest.email,
        subject,
        text: this.buildTextEmail(demoRequest, inboxUrl),
        html: this.buildHtmlEmail(demoRequest, inboxUrl),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Resend email failed with ${response.status}: ${errorBody}`);
    }
  }

  private buildTextEmail(demoRequest: DemoRequestEmailPayload, inboxUrl: string) {
    return [
      "Cerere demo nouă în Autopilot One",
      "",
      `Nume: ${demoRequest.name}`,
      `Email: ${demoRequest.email}`,
      `Companie: ${optionalValue(demoRequest.company)}`,
      `Telefon: ${optionalValue(demoRequest.phone)}`,
      `Website: ${optionalValue(demoRequest.website)}`,
      `Sursă: ${demoRequest.source}`,
      `Status: ${demoRequest.status}`,
      "",
      "Mesaj:",
      demoRequest.message,
      "",
      `Deschide inboxul: ${inboxUrl}`,
    ].join("\n");
  }

  private buildHtmlEmail(demoRequest: DemoRequestEmailPayload, inboxUrl: string) {
    const rows = [
      ["Nume", demoRequest.name],
      ["Email", demoRequest.email],
      ["Companie", optionalValue(demoRequest.company)],
      ["Telefon", optionalValue(demoRequest.phone)],
      ["Website", optionalValue(demoRequest.website)],
      ["Sursă", demoRequest.source],
      ["Status", demoRequest.status],
    ];

    return `
      <div style="font-family: Inter, Arial, sans-serif; color: #0f172a; line-height: 1.6;">
        <h1 style="margin: 0 0 16px;">Cerere demo nouă</h1>
        <p style="margin: 0 0 20px;">A intrat o cerere demo nouă în Autopilot One.</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 640px;">
          ${rows.map(([label, value]) => `
            <tr>
              <td style="border: 1px solid #e2e8f0; padding: 10px; font-weight: 700; width: 140px;">${escapeHtml(label)}</td>
              <td style="border: 1px solid #e2e8f0; padding: 10px;">${escapeHtml(value)}</td>
            </tr>
          `).join("")}
        </table>
        <h2 style="margin: 24px 0 8px;">Mesaj</h2>
        <p style="white-space: pre-line; border: 1px solid #e2e8f0; padding: 12px; border-radius: 12px; max-width: 640px;">${escapeHtml(demoRequest.message)}</p>
        <p style="margin-top: 24px;">
          <a href="${escapeHtml(inboxUrl)}" style="background: #0f172a; color: #ffffff; padding: 12px 18px; border-radius: 999px; text-decoration: none; font-weight: 700;">Deschide Cereri demo</a>
        </p>
      </div>
    `;
  }
}
