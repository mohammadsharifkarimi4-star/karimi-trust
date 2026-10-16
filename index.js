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
            { id: "4", type: "دریافت", direction: "بستانکار", amount: "AFN 129,600+", currency: "AFN", date: "9/26/2026", status: "رسیده", desc: "قیمت ۲ هزار تنر" },
            { id: "5", type: "دریافت", direction: "بستانکار", amount: "AFN 77,350+", currency: "AFN", date: "9/19/2026", status: "رسیده", desc: "قیمت ۱۱۹۰ تنر شد" },
            { id: "6", type: "پرداخت", direction: "بدهکار", amount: "AFN 3,000-", currency: "AFN", date: "9/15/2026", status: "رسیده", desc: "برداشت نقدی از حساب" },
            { id: "7", type: "حواله", direction: "بدهکار", amount: "AFN 10,100-", currency: "AFN", date: "9/10/2026", status: "رسیده", desc: "ارسال حواله تجاری به کابل" }
        ]
    }
};

const server = http.createServer((req, res) => {
    if (req.url.startsWith('/api/check-phone')) {
        const urlParams = new URL(req.url, 'http://localhost:3000');
        const phone = urlParams.searchParams.get('phone');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        if (database[phone]) {
            res.end(JSON.stringify({ exists: true, name: database[phone].name }));
        } else {
            res.end(JSON.stringify({ exists: false }));
        }
        return;
    }

    if (req.url.startsWith('/api/login')) {
        const urlParams = new URL(req.url, 'http://localhost:3000');
        const phone = urlParams.searchParams.get('phone');
        const accountId = urlParams.searchParams.get('accountId');
        
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        if (database[phone] && database[phone].accountId === accountId) {
            res.end(JSON.stringify({ success: true, data: database[phone] }));
        } else {
            res.end(JSON.stringify({ success: false, message: 'کد شناسایی حساب نادرست است.' }));
        }
        return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>امانت‌داری کریمی مرکزی</title>
        <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700;900&display=swap" rel="stylesheet">
        <style>
            * { box-sizing: border-box; font-family: 'Vazirmatn', sans-serif; }
            body { 
                background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); 
                min-height: 100vh; 
                margin: 0; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                padding: 15px; 
            }
            .container { 
                width: 100%; 
                max-width: 460px; 
                background: rgba(255, 255, 255, 0.08); 
                backdrop-filter: blur(25px); 
                -webkit-backdrop-filter: blur(25px);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 28px; 
                box-shadow: 0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2); 
                overflow: hidden; 
                animation: fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1);
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(30px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            .header { 
                background: linear-gradient(135deg, #6a11cb, #2575fc); 
                color: white; 
                padding: 24px; 
                text-align: center; 
                font-size: 21px; 
                font-weight: 900; 
                letter-spacing: 0.5px;
                box-shadow: 0 10px 25px rgba(106, 17, 203, 0.4);
                border-bottom: 1px solid rgba(255,255,255,0.2);
            }
            .p-20 { padding: 22px; }
            .input-group { margin-bottom: 20px; }
            .input-group label { display: block; font-size: 13px; color: #dcdde1; margin-bottom: 8px; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
            .input-group input { 
                width: 100%; 
                padding: 15px 18px; 
                border: 2px solid rgba(255, 255, 255, 0.15); 
                border-radius: 14px; 
                font-size: 16px; 
                background: rgba(255, 255, 255, 0.07);
                color: #fff;
                text-align: right; 
                transition: all 0.3s ease;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
            }
            .input-group input:focus { 
                border-color: #00d2d3; 
                background: rgba(255, 255, 255, 0.12);
                outline: none; 
                box-shadow: 0 0 20px rgba(0, 210, 211, 0.4), inset 0 2px 4px rgba(0,0,0,0.2); 
            }
            .input-group input::placeholder { color: rgba(255,255,255,0.4); }
            
            .btn { 
                background: linear-gradient(135deg, #00b09b, #96c93d); 
                color: #fff; 
                border: none; 
                width: 100%; 
                padding: 15px; 
                border-radius: 14px; 
                font-size: 16px; 
                font-weight: 800; 
                cursor: pointer; 
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                box-shadow: 0 8px 20px rgba(0, 176, 155, 0.4);
                margin-top: 10px;
                text-shadow: 0 1px 2px rgba(0,0,0,0.2);
            }
            .btn:hover { 
                transform: translateY(-3px); 
                box-shadow: 0 12px 25px rgba(0, 176, 155, 0.6); 
            }
            .btn-whatsapp {
                background: linear-gradient(135deg, #25d366, #128c7e);
                box-shadow: 0 8px 20px rgba(37, 211, 102, 0.4);
            }
            .btn-whatsapp:hover {
                box-shadow: 0 12px 25px rgba(37, 211, 102, 0.6);
            }
            .btn-secondary {
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: none;
            }
            .btn-secondary:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .card { 
                background: rgba(255, 255, 255, 0.08); 
                backdrop-filter: blur(15px);
                border-radius: 18px; 
                padding: 18px; 
                margin-bottom: 15px; 
                border: 1px solid rgba(255, 255, 255, 0.15); 
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                transition: transform 0.2s;
            }
            .card:hover { transform: translateY(-2px); }
            .balance-title { font-size: 13px; color: #b2bec3; font-weight: 700; }
            .balance-amount { font-size: 26px; font-weight: 900; margin: 8px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
            .badge-creditor { color: #00d2d3; font-size: 13px; font-weight: 800; }
            .badge-debtor { color: #ff6b6b; font-size: 13px; font-weight: 800; }

            .tx-container {
                max-height: 280px;
                overflow-y: auto;
                padding-left: 5px;
            }
            .tx-container::-webkit-scrollbar { width: 5px; }
            .tx-container::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 10px; }

            .tx-item { 
                background: rgba(255, 255, 255, 0.09); 
                backdrop-filter: blur(10px);
                border-radius: 14px; 
                padding: 14px 16px; 
                margin-bottom: 12px; 
                border: 1px solid rgba(255, 255, 255, 0.15); 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                cursor: pointer; 
                transition: all 0.25s ease;
                box-shadow: 0 6px 15px rgba(0,0,0,0.15);
            }
            .tx-item:hover { 
                background: rgba(255, 255, 255, 0.16); 
                border-color: #00d2d3; 
                transform: translateX(-4px); 
            }
            .hidden { display: none !important; }
            .user-tag { background: rgba(0, 210, 211, 0.15); color: #00d2d3; border: 1px solid rgba(0, 210, 211, 0.3); padding: 6px 14px; border-radius: 12px; font-size: 13px; font-weight: 800; }
            
            .modal { 
                position: fixed; 
                top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0,0,0,0.7); 
                backdrop-filter: blur(12px);
                display: flex; justify-content: center; align-items: center; 
                opacity: 0; pointer-events: none; transition: opacity 0.3s ease; 
                z-index: 999;
            }
            .modal.active { opacity: 1; pointer-events: auto; }
            .modal-content { 
                background: rgba(30, 27, 75, 0.85); 
                backdrop-filter: blur(30px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                padding: 30px; 
                border-radius: 24px; 
                width: 90%; max-width: 420px; 
                box-shadow: 0 25px 50px rgba(0,0,0,0.6);
                transform: scale(0.85);
                transition: transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                color: #fff;
            }
            .modal.active .modal-content { transform: scale(1); }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">امانت‌داری کریمی مرکزی</div>

            <div id="step-phone" class="p-20">
                <div style="text-align: center; margin-bottom: 22px; font-weight: 800; color: #fff; font-size: 17px;">ورود به حساب کاربری</div>
                <div class="input-group">
                    <label>شماره همراه</label>
                    <input type="text" id="phone-input" placeholder="مثلا 7721878997">
                </div>
                <button class="btn" onclick="checkPhone()">شناسایی شماره</button>
            </div>

            <div id="step-notfound" class="p-20 hidden" style="text-align: center;">
                <div style="color: #ff6b6b; font-weight: 900; font-size: 17px; margin-bottom: 12px; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">شما در امانت‌داری کریمی حساب ندارید!</div>
                <p style="font-size: 14px; color: #dfe6e9; line-height: 1.8; margin-bottom: 22px;">جهت افتتاح حساب یا بررسی وضعیت، می‌توانید مستقیماً با مدیریت ارتباط برقرار کنید.</p>
                <button class="btn btn-whatsapp" onclick="contactKarimi()">ارسال پیام به کریمی (واتساپ)</button>
                <button class="btn btn-secondary" onclick="retryLogin()">تلاش مجدد</button>
            </div>

            <div id="step-account" class="p-20 hidden">
                <div id="greeting-name" style="color: #00d2d3; font-weight: 800; font-size: 17px; margin-bottom: 15px; text-align: center; text-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>
                <div class="input-group">
                    <label>کد اختصاصی حساب (AccountID)</label>
                    <input type="text" id="account-input" placeholder="مثلا c7d99b00">
                </div>
                <button class="btn" onclick="loginAccount()">ورود به حساب کاربری</button>
                <button class="btn btn-secondary" onclick="retryLogin()">بازگشت</button>
            </div>

            <div id="dashboard-section" class="p-20 hidden">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <div>
                        <div style="font-weight: 900; font-size: 19px; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.3);" id="dash-name"></div>
                        <div style="color: #b2bec3; font-size: 13px; margin-top: 3px; font-weight: 600;" id="dash-phone"></div>
                    </div>
                    <div class="user-tag" id="dash-id"></div>
                </div>

                <div style="margin-top: 15px; font-size: 14px; color: #dfe6e9; font-weight: 800;">آمار موجودی به تفکیک ارز:</div>
                <div id="balances-container" style="margin-top: 12px;"></div>

                <div style="margin-top: 25px; font-weight: 800; color: #dfe6e9; font-size: 14px; display: flex; justify-content: space-between; align-items: center;">
                    <span>ریز سوابق و تراکنش‌ها (از قدیم به جدید)</span>
                </div>
                <div id="transactions-container" class="tx-container" style="margin-top: 12px;"></div>

                <button class="btn btn-whatsapp" style="margin-top: 20px;" onclick="contactKarimi()">ارسال پیام به کریمی</button>
                <button class="btn btn-secondary" onclick="logout()">خروج از حساب</button>
            </div>
        </div>

        <div id="tx-modal" class="modal">
            <div class="modal-content">
                <h3 style="color: #00d2d3; margin-top: 0; text-align: center; font-size: 18px; font-weight: 900;">جزئیات کامل تراکنش</h3>
                <div id="modal-body" style="font-size: 14px; line-height: 2.2; color: #dfe6e9; background: rgba(255,255,255,0.06); padding: 18px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); margin-top: 15px;"></div>
                <button class="btn" style="margin-top: 22px;" onclick="closeModal()">بستن پنجره</button>
            </div>
        </div>

        <script>
            let currentUserPhone = '';
            let currentUserData = null;

            function checkPhone() {
                const phone = document.getElementById('phone-input').value;
                if(!phone) { alert('لطفاً شماره همراه را وارد کنید'); return; }
                
                fetch('/api/check-phone?phone=' + phone)
                    .then(res => res.json())
                    .then(data => {
                        currentUserPhone = phone;
                        document.getElementById('step-phone').classList.add('hidden');
                        if (data.exists) {
                            document.getElementById('step-account').classList.remove('hidden');
                            document.getElementById('greeting-name').innerText = 'سلام ' + data.name + ' عزیز 👋';
                        } else {
                            document.getElementById('step-notfound').classList.remove('hidden');
                        }
                    });
            }

            function retryLogin() {
                document.getElementById('step-notfound').classList.add('hidden');
                document.getElementById('step-account').classList.add('hidden');
                document.getElementById('step-phone').classList.remove('hidden');
                document.getElementById('phone-input').value = '';
            }

            function contactKarimi() {
                window.open('https://wa.me/9647721878997?text=سلام، در خصوص حساب امانت‌داری کریمی پیامی داشتم.', '_blank');
            }

            function loginAccount() {
                const accountId = document.getElementById('account-input').value;
                fetch(\`/api/login?phone=\${currentUserPhone}&accountId=\${accountId}\`)
                    .then(res => res.json())
                    .then(resData => {
                        if (resData.success) {
                            currentUserData = resData.data;
                            loadDashboard();
                        } else {
                            alert(resData.message);
                        }
                    });
            }

            function loadDashboard() {
                document.getElementById('step-account').classList.add('hidden');
                document.getElementById('dashboard-section').classList.remove('hidden');

                document.getElementById('dash-name').innerText = currentUserData.name;
                document.getElementById('dash-phone').innerText = currentUserData.phone;
                document.getElementById('dash-id').innerText = 'ID: ' + currentUserData.accountId;

                let balHtml = '';
                currentUserData.balances.forEach(b => {
                    balHtml += \`
                        <div class="card">
                            <div class="balance-title">ارز: \${b.currency}</div>
                            <div class="balance-amount" style="color: \${b.statusColor};">\${b.total} <small>\${b.currency}</small></div>
                            <div style="display: flex; justify-content: space-between; font-size: 13px; margin-top: 10px; font-weight: 700;">
                                <span class="badge-creditor">↓ بستانکار (+): \${b.creditor}</span>
                                <span class="badge-debtor">↑ بدهکار (-): \${b.debtor}</span>
                            </div>
                        </div>
                    \`;
                });
                document.getElementById('balances-container').innerHTML = balHtml;

                let txHtml = '';
                currentUserData.transactions.forEach((tx, index) => {
                    const color = tx.direction === 'بستانکار' ? '#00d2d3' : '#ff6b6b';
                    txHtml += \`
                        <div class="tx-item" onclick="showTxDetails('\${tx.id}')">
                            <div>
                                <div style="font-weight: 900; color: \${color}; font-size: 15px;">\${(index + 1)}. \${tx.amount}</div>
                                <div style="font-size: 12px; color: #b2bec3; margin-top: 3px; font-weight: 600;">\${tx.type} (\${tx.direction}) - \${tx.desc}</div>
                            </div>
                            <div style="font-size: 12px; color: #dfe6e9; font-weight: 700;">\${tx.date}</div>
                        </div>
                    \`;
                });
                document.getElementById('transactions-container').innerHTML = txHtml;
            }

            function showTxDetails(txId) {
                const tx = currentUserData.transactions.find(t => t.id === txId);
                if(tx) {
                    document.getElementById('modal-body').innerHTML = \`
                        <b>شماره تراکنش:</b> \${tx.id}<br>
                        <b>نوع تراکنش:</b> \${tx.type}<br>
                        <b>جهت حساب:</b> \${tx.direction}<br>
                        <b>مبلغ:</b> \${tx.amount}<br>
                        <b>تاریخ ثبت:</b> \${tx.date}<br>
                        <b>وضعیت:</b> \${tx.status}<br>
                        <b>توضیحات:</b> \${tx.desc}
                    \`;
                    document.getElementById('tx-modal').classList.add('active');
                }
            }

            function closeModal() {
                document.getElementById('tx-modal').classList.remove('active');
            }

            function logout() {
                location.reload();
            }
        </script>
    </body>
    </html>
    `);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running smoothly on port ${PORT}`);
});
