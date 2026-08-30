// ১ থেকে ৩০ দিনের টেবিল তৈরি ও ডাটা সেভ রাখার ফাংশন
function renderTable() {
    const tbody = document.getElementById('tracker-table-body');
    if (!tbody) return;
    
    const savedData = JSON.parse(localStorage.getItem('namaz_tracker_data')) || {};
    
    let html = '';
    for (let day = 1; day <= 30; day++) {
        html += `<tr>`;
        html += `<td><strong>${day}/30</strong></td>`;
        
        // ১ থেকে ৫: মিনহাজের ওয়াক্ত | ৬ থেকে ১০: নাদিয়ার ওয়াক্ত
        for (let waqt = 1; waqt <= 10; waqt++) {
            const key = `day_${day}_waqt_${waqt}`;
            const isChecked = savedData[key] ? 'checked' : '';
            html += `<td><input type="checkbox" data-key="${key}" data-day="${day}" data-waqt="${waqt}" ${isChecked} onchange="saveCheckboxState(this)"></td>`;
        }
        
        html += `<td><span style="color: #0d9488; font-weight: bold; background: #ccfbf1; padding: 2px 6px; border-radius: 4px;">চলমান 🏆</span></td>`;
        html += `</tr>`;
    }
    
    tbody.innerHTML = html;
    updateAnalytics(); // পার্সেন্টেজ হিসাব
}

// টিক চিহ্ন সেভ করার ফাংশন
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

// পার্সেন্টেজ ও ওয়াক্ত অটো-ক্যালকুলেট করার ফাংশন
function updateAnalytics() {
    const savedData = JSON.parse(localStorage.getItem('namaz_tracker_data')) || {};
    
    let minhajWaqtCount = 0;
    let nadiyaWaqtCount = 0;
    let minhajFullDays = 0;
    let nadiyaFullDays = 0;

    for (let day = 1; day <= 30; day++) {
        let mDayCount = 0;
        let nDayCount = 0;

        // মিনহাজ (ওয়াক্ত ১-৫)
        for (let w = 1; w <= 5; w++) {
            if (savedData[`day_${day}_waqt_${w}`]) {
                minhajWaqtCount++;
                mDayCount++;
            }
        }
        if (mDayCount === 5) minhajFullDays++;

        // নাদিয়া (ওয়াক্ত ৬-১০)
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
            <li>সম্পূর্ণ ওয়াক্ত: ${minhajWaqtCount}/150</li>
        `;

        cards[1].querySelector('.circle-progress').style.setProperty('--percent', nadiyaPercent);
        cards[1].querySelector('.percent-val span').innerText = `${nadiyaPercent}%`;
        cards[1].querySelector('.stat-list').innerHTML = `
            <li>COMPLETE: ${nadiyaFullDays} DAYS</li>
            <li>সম্পূর্ণ ওয়াক্ত: ${nadiyaWaqtCount}/150</li>
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

document.addEventListener("DOMContentLoaded", () => {
    renderTable();
    initTheme();
});
