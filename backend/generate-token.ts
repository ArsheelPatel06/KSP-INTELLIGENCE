require('dotenv').config({ path: './.env' });

async function generate() {
  const code = process.argv[2];
  if (!code) {
    console.error("Please provide the code!");
    process.exit(1);
  }

  try {
    const params = new URLSearchParams();
    params.append('code', code);
    params.append('client_id', process.env.ZOHO_CLIENT_ID as string);
    params.append('client_secret', process.env.ZOHO_CLIENT_SECRET as string);
    params.append('grant_type', 'authorization_code');
    // For Self Clients, we do not strictly need a redirect_uri

    console.log("Using Client ID:", process.env.ZOHO_CLIENT_ID);

    // Try .COM
    const resCom = await fetch('https://accounts.zoho.com/oauth/v2/token', {
      method: 'POST',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const dataCom = await resCom.json();
    if (dataCom.refresh_token) {
      console.log("\n✅ SUCCESS from .COM! Paste this into ZOHO_REFRESH_TOKEN:\n");
      console.log(dataCom.refresh_token);
      return;
    }

    // Try .IN
    const resIn = await fetch('https://accounts.zoho.in/oauth/v2/token', {
      method: 'POST',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const dataIn = await resIn.json();
    if (dataIn.refresh_token) {
      console.log("\n✅ SUCCESS from .IN! Paste this into ZOHO_REFRESH_TOKEN:\n");
      console.log(dataIn.refresh_token);
      return;
    }

    console.log("Failed on both!", { COM: dataCom, IN: dataIn });
  } catch (e: any) {
    console.error("Failed!", e.message);
  }
}
generate();
