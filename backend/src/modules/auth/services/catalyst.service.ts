import * as catalyst from 'zcatalyst-sdk-node';

// This initializes Catalyst if the necessary env vars are present.
// Since it is running on Railway, it needs standard Catalyst credentials via env.
let app: catalyst.CatalystApp | null = null;
try {
  app = catalyst.initialize({
    project_id: process.env.ZOHO_PROJECT_ID,
    client_id: process.env.ZOHO_CLIENT_ID,
    client_secret: process.env.ZOHO_CLIENT_SECRET,
    refresh_token: process.env.ZOHO_REFRESH_TOKEN
  });
} catch (e) {
  console.warn("Catalyst SDK could not initialize. Please ensure ZOHO_* environment variables are set in Railway.", e);
}

export class CatalystService {
  async generateCustomToken(user: any): Promise<any> {
    if (!app) {
      throw new Error("Catalyst App is not initialized");
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
  }

  async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
    if (!app) {
      console.warn(`[DEV MODE] Catalyst not initialized. Simulated Email sent to ${email}: ${resetLink}`);
      return;
    }
    const mail = app.email();
    const config = {
      from_email: process.env.CATALYST_SENDER_EMAIL || 'admin@ksp.gov.in', // User needs to configure this
      to_email: [email],
      subject: 'KSP Intelligence OS - Password Reset',
      content: `Hello, <br><br> Please click the link below to reset your password: <br><br> <a href="${resetLink}">Reset Password</a><br><br>If you did not request this, please ignore this email.`,
      html_mode: true
    };
    await mail.sendMail(config);
  }
}
