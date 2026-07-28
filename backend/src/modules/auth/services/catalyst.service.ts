import * as catalyst from 'zcatalyst-sdk-node';

let app: catalyst.CatalystApp | null = null;
try {
  if (process.env.ZOHO_PROJECT_ID && process.env.ZOHO_CLIENT_ID) {
    app = catalyst.initializeApp({
      project_id: process.env.ZOHO_PROJECT_ID,
      project_key: process.env.ZOHO_PROJECT_KEY || 'dummy_key',
      environment: 'Development',
      credential: catalyst.credential.refreshToken({
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        refresh_token: process.env.ZOHO_REFRESH_TOKEN
      })
    });
  }
} catch (e: any) {
  console.warn("Catalyst SDK could not initialize.", e.message);
}

export class CatalystService {
  async generateCustomToken(user: any): Promise<any> {
    try {
      if (!app) {
        console.warn("Catalyst not initialized, returning mock token");
        return { custom_token: "MOCK_TOKEN" };
      }
      const userManagement = app.userManagement();
      const customToken = await userManagement.generateCustomToken({
        type: 'web',
        user_details: {
          email_id: user.email || 'admin@example.com',
          first_name: user.firstName || 'App',
          last_name: user.lastName || 'User',
          org_id: 'KSP',
          role_name: user.role,
        }
      });
      return customToken;
    } catch (e: any) {
      console.warn("Catalyst Token Generation Failed (Ignoring to prevent 500 crash):", e.message);
      return { custom_token: "MOCK_TOKEN" };
    }
  }

  async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
    if (!app) {
      console.warn(`[DEV MODE] Catalyst not initialized. Simulated Email sent to ${email}: ${resetLink}`);
      return;
    }
    const mail = app.email();
    const config = {
      from_email: process.env.CATALYST_SENDER_EMAIL || 'admin@ksp.gov.in',
      to_email: [email],
      subject: 'KSP Intelligence OS - Password Reset',
      content: `Hello, <br><br> Please click the link below to reset your password: <br><br> <a href="${resetLink}">Reset Password</a><br><br>If you did not request this, please ignore this email.`,
      html_mode: true
    };
    try {
      await mail.sendMail(config);
    } catch (e) {
      console.warn("Failed to send mail via Catalyst:", e);
    }
  }
}
