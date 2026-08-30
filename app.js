function renderTable() {
    const tbody = document.getElementById('tracker-table-body');
    if (!tbody) return;
    
    let html = '';
    for (let i = 1; i <= 30; i++) {
        html += `
        <tr>
            <td><strong>${i}/30</strong></td>
            <td><input type="checkbox"></td>
            <td><input type="checkbox"></td>
            <td><input type="checkbox"></td>
            <td><input type="checkbox"></td>
            <td><input type="checkbox"></td>
            <td><input type="checkbox"></td>
            <td><input type="checkbox"></td>
            <td><input type="checkbox"></td>
            <td><input type="checkbox"></td>
            <td><input type="checkbox"></td>
            <td><span style="color: #0d9488; font-weight: bold; background: #ccfbf1; padding: 2px 6px; border-radius: 4px;">চলমান 🏆</span></td>
        </tr>
        `;
    }
    tbody.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", renderTable);
