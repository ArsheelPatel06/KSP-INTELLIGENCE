process.env.X_ZOHO_CATALYST_ACCOUNTS_URL = 'https://accounts.zoho.in';
process.env.X_ZOHO_CATALYST_CONSOLE_URL = 'https://api.catalyst.zoho.in';
require('dotenv').config({ path: './backend/.env' });
const catalyst = require('zcatalyst-sdk-node');

try {
  const app = catalyst.initializeApp({
    project_id: process.env.ZOHO_PROJECT_ID,
    project_key: 'dummy',
    environment: 'Development',
    credential: catalyst.credential.refreshToken({
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      refresh_token: process.env.ZOHO_REFRESH_TOKEN
    })
  });
  console.log("Initialize worked! Testing Token...");
  app.userManagement().generateCustomToken({
      type: 'web',
      user_details: { email_id: 'test@example.com', first_name: 't', last_name: 't', org_id: 'KSP', role_name: 'SuperAdmin' }
  }).then(token => console.log("Success! Token fetched:", token)).catch((e: any) => console.error("Token fail:", e));
} catch (e: any) {
  console.error("Initialize failed:", e.message);
}

