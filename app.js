// ১ থেকে ৩০ দিনের টেবিল তৈরি ও ডাটা সেভ রাখার ফাংশন
function renderTable() {
    const tbody = document.getElementById('tracker-table-body');
    if (!tbody) return;
    
    // লোকাল স্টোরেজ থেকে আগে সেভ করা ডাটা আনা
    const savedData = JSON.parse(localStorage.getItem('namaz_tracker_data')) || {};
    
    let html = '';
    for (let day = 1; day <= 30; day++) {
        html += `<tr>`;
        html += `<td><strong>${day}/30</strong></td>`;
        
        // মিনহাজ এবং নাদিয়ার ১০টি ওয়াক্তের জন্য চেকবাক্স তৈরি (১-১০)
        for (let waqt = 1; waqt <= 10; waqt++) {
            const key = `day_${day}_waqt_${waqt}`;
            const isChecked = savedData[key] ? 'checked' : '';
            html += `<td><input type="checkbox" data-key="${key}" ${isChecked} onchange="saveCheckboxState(this)"></td>`;
        }
        
        html += `<td><span style="color: #0d9488; font-weight: bold; background: #ccfbf1; padding: 2px 6px; border-radius: 4px;">চলমান 🏆</span></td>`;
        html += `</tr>`;
    }
    
    tbody.innerHTML = html;
}

// টিক চিহ্ন দেওয়া বা তোলার সাথে সাথে সেভ করার ফাংশন
function saveCheckboxState(checkbox) {
    const key = checkbox.getAttribute('data-key');
    const savedData = JSON.parse(localStorage.getItem('namaz_tracker_data')) || {};
    
    if (checkbox.checked) {
        savedData[key] = true;
    } else {
        delete savedData[key];
    }
    
    localStorage.setItem('namaz_tracker_data', JSON.stringify(savedData));
}

// পেজ লোড হলেই টেবিল লোড করা
document.addEventListener("DOMContentLoaded", renderTable);
