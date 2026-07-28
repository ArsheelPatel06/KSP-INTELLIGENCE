require('dotenv').config({ path: './backend/.env' });
import https from 'https';

const clientId = process.env.ZOHO_CLIENT_ID;
const scopes = [
  'ZohoCatalyst.users.ALL',
  'ZohoCatalyst.users.CREATE',
  'ZohoCatalyst.usermanagement.ALL',
  'ZohoCatalyst.modules.ALL',
  'ZohoCatalyst.projects.ALL'
];

async function checkScope(scope: string) {
  return new Promise((resolve) => {
    https.get(`https://accounts.zoho.com/oauth/v2/auth?scope=${scope}&client_id=${clientId}&response_type=code&redirect_uri=http://localhost:4000/oauth/callback`, (res) => {
      resolve(res.headers.location || 'no-redirect');
    });
  });
}

async function run() {
  for (const scope of scopes) {
    const loc = await checkScope(scope);
    console.log(`SCOPE: ${scope} -> Redirect: ${loc}`);
  }
}
run();
