require('dotenv').config({ path: './.env' });
async function test() {
  const url = `https://accounts.zoho.com/oauth/v2/token?client_id=${process.env.ZOHO_CLIENT_ID}&client_secret=${process.env.ZOHO_CLIENT_SECRET}&grant_type=client_credentials`;
  try {
    const res = await fetch(url, { method: 'POST' });
    const data = await res.json();
    console.log(".COM response:", data);
  } catch (e) {
    console.error(e);
  }
}
test();
