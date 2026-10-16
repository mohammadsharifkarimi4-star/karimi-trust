
const http = require('http');
const https = require('https');

// لینک CSV گوگل شیت شما
const ACCOUNTS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSUbZuehG4hJ9oVt1rhT-bgNdY1Jqr_0JuzjTC5ysF6eMmoj0mqhT6rhsHCm8aSeKDAU4jdmUQj0-B0/pub?output=csv&sheet=Accounts";
const TRANSACTIONS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSUbZuehG4hJ9oVt1rhT-bgNdY1Jqr_0JuzjTC5ysF6eMmoj0mqhT6rhsHCm8aSeKDAU4jdmUQj0-B0/pub?output=csv&sheet=Transactions";

function fetchCSV(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', err => reject(err));
  });
}

function parseCSV(text) {
  const lines = text.split('\n');
  const result = [];
  if (lines.length === 0) return result;
  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const currentline = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    let obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j] ? currentline[j].trim().replace(/^["']|["']$/g, '') : '';
    }
    result.push(obj);
  }
  return result;
}

function cleanDigits(str) {
  if (!str) return '';
  return String(str).replace(/\D/g, '');
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const pathname = urlObj.pathname;

  if (pathname === '/api/check-phone') {
    const phone = urlObj.searchParams.get('phone') || '';
    try {
      const csvText = await fetchCSV(ACCOUNTS_URL);
      const accounts = parseCSV(csvText);
      const userDigits = cleanDigits(phone);

      const found = accounts.find(u => {
        const sheetPhone = cleanDigits(u.Phone || '');
        return sheetPhone && (sheetPhone.endsWith(userDigits) || userDigits.endsWith(sheetPhone.slice(-7)));
      });

      if (found) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ found: true, name: found.Name || 'مشتری گرامی' }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ found: false }));
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ found: false, error: err.toString() }));
    }
  } else if (pathname === '/api/verify-account') {
    const phone = urlObj.searchParams.get('phone') || '';
    const accountId = urlObj.searchParams.get('accountId') || '';
    try {
      const [accCsv, txCsv] = await Promise.all([fetchCSV(ACCOUNTS_URL), fetchCSV(TRANSACTIONS_URL)]);
      const accounts = parseCSV(accCsv);
      const transactions = parseCSV(txCsv);

      const userDigits = cleanDigits(phone);
      const cleanAccId = accountId.trim().toLowerCase();

      const customerRow = accounts.find(u => {
        const sheetAccId = String(u.AccountID || '').trim().toLowerCase();
        const sheetPhone = cleanDigits(u.Phone || '');
        const phoneMatches = sheetPhone && (sheetPhone.endsWith(userDigits) || userDigits.endsWith(sheetPhone.slice(-7)));
        return sheetAccId === cleanAccId && phoneMatches;
      });

      if (!customerRow) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: false, message: 'کد اختصاصی حساب (AccountID) یا شماره همراه اشتباه است.' }));
        return;
      }

      const sheetAccId = String(customerRow.AccountID || '').trim().toLowerCase();
      const customerTxs = transactions.filter(tx => String(tx.AccountID || '').trim().toLowerCase() === sheetAccId);

      let balances = {};
      customerTxs.forEach(tx => {
        let curr = (tx.Currency || 'AFN').toUpperCase();
        let amount = parseFloat(tx.Amount) || 0;
        let dir = String(tx.Direction || '');

        if (!balances[curr]) balances[curr] = { credit: 0, debit: 0, net: 0 };
        if (dir.includes('بستانکار') || dir.includes('دریافت')) balances[curr].credit += amount;
        else if (dir.includes('بدهکار') || dir.includes('پرداخت')) balances[curr].debit += amount;
      });

      for (let c in balances) {
        balances[c].net = balances[c].credit - balances[c].debit;
      }

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: true,
        customer: {
          accountId: customerRow.AccountID,
          name: customerRow.Name,
          phone: customerRow.Phone
        },
        balances: balances,
        transactions: customerTxs.reverse()
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, message: err.toString() }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
