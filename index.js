const http = require('http');

const database = {
  "7721878997": {
    name: "شریف کریمی",
    phone: "+9647721878997",
    accountId: "c7d99b00",
    balances: [
      { currency: "AFN", total: "-50,411", creditor: "17,403,454", debtor: "17,353,043", statusColor: "#ff4757" },
      { currency: "USD", total: "0", creditor: "14,789", debtor: "14,789", statusColor: "#2ed573" }
    ],
    transactions: [
      { id: "1", type: "حواله", direction: "بدهکار", amount: "AFN 10,100-", currency: "AFN", date: "10/4/2026", status: "رسیده", desc: "فرستنده حسن جعفری، گیرنده موسی، ولایت دایکندی" },
      { id: "2", type: "پرداخت", direction: "بدهکار", amount: "AFN 10,000-", currency: "AFN", date: "10/8/2026", status: "رسیده", desc: "کردیت حساب" },
      { id: "3", type: "دریافت", direction: "بستانکار", amount: "AFN 3,100+", currency: "AFN", date: "10/11/2026", status: "رسیده", desc: "قیمت ۲۹۰۰ تومان" },
      { id: "4", type: "دریافت", direction: "بستانکار", amount: "AFN 129,600+", currency: "AFN", date: "9/26/2026", status: "رسیده", desc: "قیمت ۲ هزار تتر" },
      { id: "5", type: "دریافت", direction: "بستانکار", amount: "AFN 77,350+", currency: "AFN", date: "9/19/2026", status: "رسیده", desc: "قیمت ۱۱۹۰ تتر شد" },
      { id: "6", type: "پرداخت", direction: "بدهکار", amount: "AFN 3,000-", currency: "AFN", date: "9/15/2026", status: "رسیده", desc: "برداشت نقدی از حساب" },
      { id: "7", type: "حواله", direction: "بدهکار", amount: "AFN 10,100-", currency: "AFN", date: "9/10/2026", status: "رسیده", desc: "ارسال حواله تجاری به کابل" }
    ]
  }
};

const server = http.createServer((req, res) => {
  const urlParams = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  
  // API endpoints
  if (urlParams.pathname === '/api/check-phone') {
    const phone = urlParams.searchParams.get('phone');
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    if (database[phone]) {
      res.end(JSON.stringify({ exists: true, name: database[phone].name }));
    } else {
      res.end(JSON.stringify({ exists: false }));
    }
    return;
  }

  if (urlParams.pathname === '/api/login') {
    const phone = urlParams.searchParams.get('phone');
    const accountId = urlParams.searchParams.get('accountId');
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    if (database[phone] && database[phone].accountId === accountId) {
      res.end(JSON.stringify({ success: true, data: database[phone] }));
    } else {
      res.end(JSON.stringify({ success: false, message: 'اطلاعات ورود اشتباه است' }));
    }
    return;
  }

  // HTML Interface
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(`
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>صرافی و خدمات مالی کریمی</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: Tahoma, Arial, sans-serif; }
        body { background-color: #f4f6f9; color: #333; padding: 15px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        h2 { text-align: center; color: #2c3e50; margin-bottom: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 6px; font-size: 16px; text-align: center; }
        button { width: 100%; padding: 12px; background-color: #27ae60; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; font-weight: bold; }
        button:hover { background-color: #219150; }
        .card { background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; margin-bottom: 15px; }
        .balance-box { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .tx-item { border-bottom: 1px solid #eee; padding: 10px 0; font-size: 14px; }
        .tx-item:last-child { border-bottom: none; }
        .badge { padding: 3px 8px; border-radius: 4px; color: #fff; font-size: 12px; }
        .hidden { display: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>سامانه حسابداری کریمی</h2>
        
        <!-- Login Form -->
        <div id="loginSection">
          <div class="form-group">
            <label>شماره تلفن:</label>
            <input type="text" id="phoneInput" placeholder="مثال: 7721878997" value="7721878997">
          </div>
          <div class="form-group">
            <label>کد حساب (رمز عبور):</label>
            <input type="password" id="accountIdInput" placeholder="کد حساب را وارد کنید" value="c7d99b00">
          </div>
          <button onclick="login()">ورود به سامانه</button>
          <p id="errorMsg" style="color: red; text-align: center; margin-top: 10px;"></p>
        </div>

        <!-- Dashboard Section -->
        <div id="dashboardSection" class="hidden">
          <h3 id="welcomeMsg" style="margin-bottom: 15px;"></h3>
          
          <div class="card">
            <h4>موجودی حساب‌ها</h4>
            <div id="balancesContainer"></div>
          </div>

          <div class="card">
            <h4>آخرین تراکنش‌ها</h4>
            <div id="transactionsContainer"></div>
          </div>
          <button onclick="logout()" style="background-color: #e74c3c;">خروج</button>
        </div>
      </div>

      <script>
        async function login() {
          const phone = document.getElementById('phoneInput').value.trim();
          const accountId = document.getElementById('accountIdInput').value.trim();
          const errorMsg = document.getElementById('errorMsg');
          
          const res = await fetch('/api/login?phone=' + encodeURIComponent(phone) + '&accountId=' + encodeURIComponent(accountId));
          const result = await res.json();
          
          if(result.success) {
            document.getElementById('loginSection').classList.add('hidden');
            document.getElementById('dashboardSection').classList.remove('hidden');
            document.getElementById('welcomeMsg').innerText = 'خوش آمدید، ' + result.data.name;
            
            // Render Balances
            let balHtml = '';
            result.data.balances.forEach(b => {
              balHtml += '<div class="balance-box"><span>ارز: ' + b.currency + '</span><span style="color:' + b.statusColor + '; font-weight:bold;">' + b.total + '</span></div>';
            });
            document.getElementById('balancesContainer').innerHTML = balHtml;

            // Render Transactions
            let txHtml = '';
            result.data.transactions.forEach(t => {
              txHtml += '<div class="tx-item"><div><strong>' + t.type + '</strong> (' + t.date + ') - <span style="color:#27ae60">' + t.amount + '</span></div><div style="color:#666; font-size:12px; margin-top:3px;">' + t.desc + '</div></div>';
            });
            document.getElementById('transactionsContainer').innerHTML = txHtml;
          } else {
            errorMsg.innerText = result.message;
          }
        }

        function logout() {
          document.getElementById('dashboardSection').classList.add('hidden');
          document.getElementById('loginSection').classList.remove('hidden');
        }
      </script>
    </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log('Server running on port ' + PORT));
