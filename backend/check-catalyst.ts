require('dotenv').config({ path: './backend/.env' });

async function test() {
  try {
    // 1. Get Access Token
    const tokenRes = await fetch('https://accounts.zoho.com/oauth/v2/token', {
      method: 'POST',
      body: new URLSearchParams({
        refresh_token: process.env.ZOHO_REFRESH_TOKEN as string,
        client_id: process.env.ZOHO_CLIENT_ID as string,
        client_secret: process.env.ZOHO_CLIENT_SECRET as string,
        grant_type: 'refresh_token'
      })
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
        console.error("Failed to get access token:", tokenData);
        return;
    }
    console.log("Got access token!", tokenData.access_token.substring(0, 10));

    // 2. Hit .COM Catalyst API
    const catalystRes = await fetch(`https://api.catalyst.zoho.com/baas/v1/project/${process.env.ZOHO_PROJECT_ID}/authentication/custom-token`, {
      method: 'POST',
      body: JSON.stringify({ type: 'web', user_details: { email_id: 'test@example.com', first_name: 't', last_name: 't', org_id: 'KSP', role_name: 'SuperAdmin' } }),
      headers: { 'Authorization': `Zoho-oauthtoken ${tokenData.access_token}`, 'Content-Type': 'application/json' }
    });
    
    const data = await catalystRes.text();
    console.log(".COM Response:", catalystRes.status, data.substring(0, 100));

    // 3. Hit .IN Catalyst API
    const catalystResIn = await fetch(`https://api.catalyst.zoho.in/baas/v1/project/${process.env.ZOHO_PROJECT_ID}/authentication/custom-token`, {
      method: 'POST',
      body: JSON.stringify({ type: 'web', user_details: { email_id: 'test@example.com', first_name: 't', last_name: 't', org_id: 'KSP', role_name: 'SuperAdmin' } }),
      headers: { 'Authorization': `Zoho-oauthtoken ${tokenData.access_token}`, 'Content-Type': 'application/json' }
    });
    
    const dataIn = await catalystResIn.text();
    console.log(".IN Response:", catalystResIn.status, dataIn.substring(0, 100));

  } catch (e: any) {
    console.error("Failed!", e.message);
  }
}
test();
