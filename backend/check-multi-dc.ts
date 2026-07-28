require('dotenv').config({ path: './.env' });
async function test() {
  try {
    // 1. Get Access Token from .COM
    const tokenRes = await fetch(`https://accounts.zoho.com/oauth/v2/token?refresh_token=${process.env.ZOHO_REFRESH_TOKEN}&client_id=${process.env.ZOHO_CLIENT_ID}&client_secret=${process.env.ZOHO_CLIENT_SECRET}&grant_type=refresh_token`, { method: 'POST' });
    const tokenData = await tokenRes.json();
    console.log("Got .COM access token:", !!tokenData.access_token);
    
    // 2. Hit .IN Catalyst API with .COM access token
    const url = `https://api.catalyst.zoho.in/baas/v1/project/${process.env.ZOHO_PROJECT_ID}/authentication/custom-token`;
    const catalystRes = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ type: 'web', user_details: { email_id: 'test@example.com', first_name: 't', last_name: 't', org_id: 'KSP', role_name: 'SuperAdmin' } }),
      headers: { 'Authorization': `Zoho-oauthtoken ${tokenData.access_token}`, 'Content-Type': 'application/json' }
    });
    const data = await catalystRes.text();
    console.log(".IN API Response:", catalystRes.status, data.substring(0, 200));
  } catch (e: any) {
    console.error(e);
  }
}
test();
