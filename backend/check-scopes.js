const https = require('https');
https.get('https://catalyst.zoho.com/help/api/user-management.html', (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => console.log(data.match(/ZohoCatalyst\.[A-Za-z0-9_\.]+/g)));
});
