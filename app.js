:root {
    --bg-color: #f0fdf4;
    --card-bg: #ffffff;
    --text-color: #166534;
    --accent-color: #15803d;
    --border-color: #bbf7d0;
}

body.dark-mode {
    --bg-color: #052e16;
    --card-bg: #14532d;
    --text-color: #f0fdf4;
    --accent-color: #22c55e;
    --border-color: #166534;
}

body {
    background-color: var(--bg-color);
    color: var(--text-color);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    transition: all 0.3s ease;
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: var(--card-bg);
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.logo {
    font-weight: bold;
    font-size: 1.2rem;
    color: var(--accent-color);
}

.nav-controls button {
    background: transparent;
    border: 1px solid var(--accent-color);
    color: var(--text-color);
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 5px;
}

.modal {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.7);
    display: flex; justify-content: center; align-items: center;
    z-index: 1000;
}

.login-card {
    background: var(--card-bg);
    border-radius: 15px;
    overflow: hidden;
    width: 90%;
    max-width: 380px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.islamic-banner {
    background: var(--accent-color);
    color: white;
    padding: 20px;
    text-align: center;
}

.islamic-banner h3 { margin: 0 0 5px 0; font-size: 0.9rem; }
.islamic-banner p { margin: 0; font-size: 0.8rem; opacity: 0.9; }

.login-form {
    padding: 25px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.input-group {
    display: flex;
    align-items: center;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 10px;
    background: var(--bg-color);
}

.input-group i { margin-right: 10px; color: var(--accent-color); }
.input-group input { border: none; background: transparent; outline: none; width: 100%; color: var(--text-color); }

.login-btn {
    background: var(--accent-color);
    color: white;
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
}

.hidden { display: none !important; }

.dashboard { padding: 20px; max-width: 800px; margin: auto; }
.banner-card {
    background: var(--card-bg);
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    margin-bottom: 20px;
    border: 1px solid var(--border-color);
}

.profiles-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
}

.user-card {
    background: var(--card-bg);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    border: 1px solid var(--border-color);
}

.profile-img {
    width: 80px; height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--accent-color);
}
