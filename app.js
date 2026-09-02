// Firebase Configuration (লাইভ সিঙ্কের জন্য)
const firebaseConfig = {
    databaseURL: "https://namaz-hishab-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// ইউজার ক্রেডেনশিয়ালস (পাসওয়ার্ড: gando)
const USERS = [
    { email: "minhaj@gmail.com", pass: "gando" },
    { email: "nadiya@gmail.com", pass: "gando" }
];

let globalSavedData = {};

// লগইন চেক ফাংশন
function handleLogin() {
    const emailInput = document.getElementById('email').value.trim().toLowerCase();
    const passInput = document.getElementById('password').value.trim();
    const errorMsg = document.getElementById('login-error');

    const isValidUser = USERS.some(user => user.email === emailInput && user.pass === passInput);

    if (isValidUser) {
        errorMsg.style.display = 'none';
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        document.body.classList.remove('login-mode');
        
        listenToRealtimeData();
        initTheme();
        initLanguage();
    } else {
        errorMsg.innerText = "ভুল ইমেইল অথবা পাসওয়ার্ড!";
        errorMsg.style.display = 'block';
    }
}

function handleLogout() {
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('login-modal').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
    document.body.classList.add('login-mode');
}

// অনলাইন থেকে লাইভ ডাটা রিড করা
function listenToRealtimeData() {
    database.ref('namaz_tracker').on('value', (snapshot) => {
        globalSavedData = snapshot.val() || {};
        renderTable();
    });
}

// ভাষা রূপান্তরের ডিকশনারি
const translations = {
    bn: {
        login_title: "লগইন",
        login_btn: "লগইন",
        forgot_pass: "পাসওয়ার্ড ভুলে গেছেন?",
        app_title: "নমাজ হিসাব",
        mode_lbl: "মোড",
        light_btn: "লাইট",
        dark_btn: "ডার্ক",
        lang_lbl: "ভাষা",
        hero_title: "PRAYER IS THE PILLAR OF RELIGION",
        hero_subtitle: "নামাজ দ্বীনের খুটি | নামাজ অভ্যাস গড়ুন",
        leg_complete: "✔ সম্পূর্ণ",
        leg_partial: "◐ আংশিক",
        leg_remaining: "◯ বাকি",
        leg_missed: "✖ মিস",
        btn_filter: "ফিল্টার",
        th_day: "দিন",
        th_status: "দিনের অবস্থা",
        w_fajr: "ফজর",
        w_dhuhr: "জোহর",
        w_asr: "আসর",
        w_maghrib: "মাগরিব",
        w_isha: "ইশা",
        btn_see_all: "সব দিন দেখুন ↓",
        complete_lbl: "সম্পূর্ণ",
        btn_share: "শেয়ার করুন",
        status_ongoing: "চলমান 🏆",
        waqt_count_lbl: "সম্পূর্ণ ওয়াক্ত"
    },
    en: {
        login_title: "Login",
        login_btn: "Login",
        forgot_pass: "Forgot Password?",
        app_title: "Namaz Tracker",
        mode_lbl: "Mode",
        light_btn: "Light",
        dark_btn: "Dark",
        lang_lbl: "Language",
        hero_title: "PRAYER IS THE PILLAR OF RELIGION",
        hero_subtitle: "Prayer is the pillar of Islam | Build a habit of prayer",
        leg_complete: "✔ Complete",
        leg_partial: "◐ Partial",
        leg_remaining: "◯ Left",
        leg_missed: "✖ Missed",
        btn_filter: "Filter",
        th_day: "Day",
        th_status: "Day Status",
        w_fajr: "Fajr",
        w_dhuhr: "Dhuhr",
        w_asr: "Asr",
        w_maghrib: "Maghrib",
        w_isha: "Isha",
        btn_see_all: "See All Days ↓",
        complete_lbl: "Complete",
        btn_share: "Share",
        status_ongoing: "Ongoing 🏆",
        waqt_count_lbl: "Total Waqt"
    }
};

// ১ থেকে ৩০ দিনের টেবিল তৈরি
function renderTable() {
    const tbody = document.getElementById('tracker-table-body');
    if (!tbody) return;
    
    const currentLang = localStorage.getItem('namaz_lang') || 'bn';
    const ongoingText = translations[currentLang].status_ongoing;
    
    let html = '';
    for (let day = 1; day <= 30; day++) {
        html += `<tr>`;
        html += `<td><strong>${day}/30</strong></td>`;
        
        for (let waqt = 1; waqt <= 10; waqt++) {
            const key = `day_${day}_waqt_${waqt}`;
            const isChecked = globalSavedData[key] ? 'checked' : '';
            html += `<td><input type="checkbox" data-key="${key}" data-day="${day}" data-waqt="${waqt}" ${isChecked} onchange="saveCheckboxState(this)"></td>`;
        }
        
        html += `<td><span style="color: #0d9488; font-weight: bold; background: #ccfbf1; padding: 2px 6px; border-radius: 4px;">${ongoingText}</span></td>`;
        html += `</tr>`;
    }
    
    tbody.innerHTML = html;
    updateAnalytics();
}

// টিকচিহ্ন দিলে ডাটাবেসে সেভ হবে
function saveCheckboxState(checkbox) {
    const key = checkbox.getAttribute('data-key');
    
    if (checkbox.checked) {
        database.ref('namaz_tracker/' + key).set(true);
    } else {
        database.ref('namaz_tracker/' + key).remove();
    }
}

function updateAnalytics() {
    const currentLang = localStorage.getItem('namaz_lang') || 'bn';
    const waqtLbl = translations[currentLang].waqt_count_lbl;
    
    let minhajWaqtCount = 0;
    let nadiyaWaqtCount = 0;
    let minhajFullDays = 0;
    let nadiyaFullDays = 0;

    for (let day = 1; day <= 30; day++) {
        let mDayCount = 0;
        let nDayCount = 0;

        for (let w = 1; w <= 5; w++) {
            if (globalSavedData[`day_${day}_waqt_${w}`]) {
                minhajWaqtCount++;
                mDayCount++;
            }
        }
        if (mDayCount === 5) minhajFullDays++;

        for (let w = 6; w <= 10; w++) {
            if (globalSavedData[`day_${day}_waqt_${w}`]) {
                nadiyaWaqtCount++;
                nDayCount++;
            }
        }
        if (nDayCount === 5) nadiyaFullDays++;
    }

    const minhajPercent = Math.round((minhajWaqtCount / 150) * 100);
    const nadiyaPercent = Math.round((nadiyaWaqtCount / 150) * 100);

    const cards = document.querySelectorAll('.stat-card');
    if (cards.length >= 2) {
        cards[0].querySelector('.circle-progress').style.setProperty('--percent', minhajPercent);
        cards[0].querySelector('.percent-val span').innerText = `${minhajPercent}%`;
        cards[0].querySelector('.stat-list').innerHTML = `
            <li>COMPLETE: ${minhajFullDays} DAYS</li>
            <li>${waqtLbl}: ${minhajWaqtCount}/150</li>
        `;

        cards[1].querySelector('.circle-progress').style.setProperty('--percent', nadiyaPercent);
        cards[1].querySelector('.percent-val span').innerText = `${nadiyaPercent}%`;
        cards[1].querySelector('.stat-list').innerHTML = `
            <li>COMPLETE: ${nadiyaFullDays} DAYS</li>
            <li>${waqtLbl}: ${nadiyaWaqtCount}/150</li>
        `;
    }
}

// Theme Switcher Functions
function setTheme(mode) {
    const btnLight = document.getElementById('btn-theme-light');
    const btnDark = document.getElementById('btn-theme-dark');

    if (mode === 'dark') {
        document.body.classList.add('dark-mode');
        if (btnLight) btnLight.classList.remove('active');
        if (btnDark) btnDark.classList.add('active');
        localStorage.setItem('namaz_theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        if (btnLight) btnLight.classList.add('active');
        if (btnDark) btnDark.classList.remove('active');
        localStorage.setItem('namaz_theme', 'light');
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem('namaz_theme') || 'light';
    setTheme(savedTheme);
}

// Language Switcher Functions
function setLanguage(lang) {
    const btnBn = document.getElementById('btn-lang-bn');
    const btnEn = document.getElementById('btn-lang-en');

    if (lang === 'en') {
        if (btnBn) btnBn.classList.remove('active');
        if (btnEn) btnEn.classList.add('active');
    } else {
        if (btnBn) btnBn.classList.add('active');
        if (btnEn) btnEn.classList.remove('active');
    }

    localStorage.setItem('namaz_lang', lang);

    document.querySelectorAll('[data-key]').forEach(elem => {
        const key = elem.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            elem.innerText = translations[lang][key];
        }
    });

    renderTable();
}

function initLanguage() {
    const savedLang = localStorage.getItem('namaz_lang') || 'bn';
    setLanguage(savedLang);
}

// Gando AI Functions
function toggleAIChat() {
    const chatBox = document.getElementById('ai-chat-box');
    if (chatBox) {
        chatBox.classList.toggle('hidden');
    }
}

function handleAIKeyPress(event) {
    if (event.key === 'Enter') {
        sendAIMessage();
    }
}

function sendAIMessage() {
    const input = document.getElementById('ai-input');
    const msgContainer = document.getElementById('ai-messages');
    const text = input.value.trim();

    if (!text) return;

    const userDiv = document.createElement('div');
    userDiv.className = 'ai-msg user';
    userDiv.innerText = text;
    msgContainer.appendChild(userDiv);

    input.value = '';
    msgContainer.scrollTop = msgContainer.scrollHeight;

    setTimeout(() => {
        const botDiv = document.createElement('div');
        botDiv.className = 'ai-msg bot';
        botDiv.innerText = getSmartAIReply(text);
        msgContainer.appendChild(botDiv);
        msgContainer.scrollTop = msgContainer.scrollHeight;
    }, 500);
}

function getSmartAIReply(query) {
    const q = query.toLowerCase().trim();

    if (/^[0-9\s\+\-\*\/\.\(\)]+$/.test(q) && q.length > 1) {
        try {
            const result = eval(q);
            return `হিসাবের ফলাফল হলো: ${result}`;
        } catch (e) {}
    }

    if (q.includes('সালাম') || q.includes('assalamu') || q.includes('salam')) {
        return "ওয়া আলাইকুমুস সালাম ওয়া রহমাতুল্লাহ! আশা করি ভালো আছেন। আজ আপনাকে কীভাবে সাহায্য করতে পারি?";
    }
    if (q.includes('হাই') || q.includes('হ্যালো') || q.includes('hi') || q.includes('hello') || q.includes('hey')) {
        return "হ্যালো! আমি Gando AI, আপনার পার্সোনাল অ্যাসিস্ট্যান্ট। বলুন, কী কাজ করতে হবে?";
    }
    if (q.includes('কেমন আছ') || q.includes('কেমন আছেন') || q.includes('how are you')) {
        return "আলহামদুলিল্লাহ, আমি খুবই ভালো আছি! আপনি কেমন আছেন?";
    }
    if (q.includes('ভাল') || q.includes('ভালো') || q.includes('fine') || q.includes('good')) {
        return "শুনে খুব ভালো লাগলো! আলহামদুলিল্লাহ। আপনার দিনটি শুভ হোক।";
    }
    if (q.includes('ধন্যবাদ') || q.includes('thanks') || q.includes('thank you')) {
        return "আপনাকেও অনেক ধন্যবাদ! সবসময় আপনার পাশে আছি। ❤️";
    }

    if (q.includes('সময়') || q.includes('টাইম') || q.includes('time')) {
        const now = new Date();
        return `এখন সময়: ${now.toLocaleTimeString('bn-BD')}`;
    }
    if (q.includes('তারিখ') || q.includes('দিন') || q.includes('date')) {
        const now = new Date();
        return `আজকের তারিখ: ${now.toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
    }

    if (q.includes('মিনহাজ') || q.includes('minhaj')) {
        let count = 0;
        for (let d = 1; d <= 30; d++) {
            for (let w = 1; w <= 5; w++) {
                if (globalSavedData[`day_${d}_waqt_${w}`]) count++;
            }
        }
        return `মিনহাজ এ পর্যন্ত মোট ${count}/১৫০ টি ওয়াক্ত নামাজ সম্পন্ন করেছেন। মাশাআল্লাহ!`;
    }
    if (q.includes('নাদিয়া') || q.includes('নাদিয়া') || q.includes('nadiya')) {
        let count = 0;
        for (let d = 1; d <= 30; d++) {
            for (let w = 6; w <= 10; w++) {
                if (globalSavedData[`day_${d}_waqt_${w}`]) count++;
            }
        }
        return `নাদিয়া এ পর্যন্ত মোট ${count}/১৫০ টি ওয়াক্ত নামাজ সম্পন্ন করেছেন। আল্লাহ কবুল করুন!`;
    }

    const randomReplies = [
        "আমি বিষয়টি বুঝতে পেরেছি! আর কীভাবে সাহায্য করতে পারি বলুন?",
        "জি, আপনার প্রশ্নটির জন্য ধন্যবাদ!",
        "আমি একটি স্মার্ট ট্র্যাকিং AI। যেকোনো বিষয় আমাকে বলতে পারেন!"
    ];
    return randomReplies[Math.floor(Math.random() * randomReplies.length)];
        }
