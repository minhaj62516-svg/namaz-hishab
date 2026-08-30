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

// ১ থেকে ৩০ দিনের টেবিল তৈরি ও ডাটা সেভ
function renderTable() {
    const tbody = document.getElementById('tracker-table-body');
    if (!tbody) return;
    
    const savedData = JSON.parse(localStorage.getItem('namaz_tracker_data')) || {};
    const currentLang = localStorage.getItem('namaz_lang') || 'bn';
    const ongoingText = translations[currentLang].status_ongoing;
    
    let html = '';
    for (let day = 1; day <= 30; day++) {
        html += `<tr>`;
        html += `<td><strong>${day}/30</strong></td>`;
        
        for (let waqt = 1; waqt <= 10; waqt++) {
            const key = `day_${day}_waqt_${waqt}`;
            const isChecked = savedData[key] ? 'checked' : '';
            html += `<td><input type="checkbox" data-key="${key}" data-day="${day}" data-waqt="${waqt}" ${isChecked} onchange="saveCheckboxState(this)"></td>`;
        }
        
        html += `<td><span style="color: #0d9488; font-weight: bold; background: #ccfbf1; padding: 2px 6px; border-radius: 4px;">${ongoingText}</span></td>`;
        html += `</tr>`;
    }
    
    tbody.innerHTML = html;
    updateAnalytics();
}

function saveCheckboxState(checkbox) {
    const key = checkbox.getAttribute('data-key');
    const savedData = JSON.parse(localStorage.getItem('namaz_tracker_data')) || {};
    
    if (checkbox.checked) {
        savedData[key] = true;
    } else {
        delete savedData[key];
    }
    
    localStorage.setItem('namaz_tracker_data', JSON.stringify(savedData));
    updateAnalytics();
}

function updateAnalytics() {
    const savedData = JSON.parse(localStorage.getItem('namaz_tracker_data')) || {};
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
            if (savedData[`day_${day}_waqt_${w}`]) {
                minhajWaqtCount++;
                mDayCount++;
            }
        }
        if (mDayCount === 5) minhajFullDays++;

        for (let w = 6; w <= 10; w++) {
            if (savedData[`day_${day}_waqt_${w}`]) {
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

    // সকল ডাটা-কি টেক্সট আপডেট
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

document.addEventListener("DOMContentLoaded", () => {
    renderTable();
    initTheme();
    initLanguage();
});
