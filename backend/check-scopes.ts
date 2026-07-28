import https from 'https';

const clientId = '1000.G99RNNASA4R4A0MEMDQWJKK2J5PJWQ';

async function check(scopes: string) {
  return new Promise((resolve) => {
    https.get(`https://accounts.zoho.com/oauth/v2/auth?client_id=${clientId}&response_type=code&redirect_uri=http://localhost:4000/oauth/callback&scope=${scopes}`, (res) => {
      resolve(res.statusCode);
    });
  });
}

async function run() {
  const combos = [
    'ZohoCatalyst.projects.ALL,ZohoCatalyst.users.ALL,ZohoCatalyst.modules.ALL',
    'ZohoCatalyst.projects.ALL,ZohoCatalyst.users.ALL,ZohoCatalyst.modules.ALL,ZohoCatalyst.admin.ALL',
    'ZohoCatalyst.projects.ALL,ZohoCatalyst.users.ALL,ZohoCatalyst.modules.ALL,ZohoCatalyst.authentication.ALL'
  ];
  for (const combo of combos) {
    const status = await check(combo);
    console.log(`[${status}] ${combo}`);
  }
}
run();
