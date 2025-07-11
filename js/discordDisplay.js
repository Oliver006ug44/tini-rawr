const userId = "1186743277785972907";
const card = document.getElementById("discord-card");

const statusMap = {
    online: { text: "Online", class: "status-online", emoji: "🟢" },
    idle: { text: "Idle", class: "status-idle", emoji: "🌙" },
    dnd: { text: "Do Not Disturb", class: "status-dnd", emoji: "⛔" },
    offline: { text: "Offline", class: "status-offline", emoji: "⚫" },
};

function renderCard(user, status) {
    const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;

    card.innerHTML = `
      <div class="discord-card-inner">
        <img class="discord-avatar" src="${avatarUrl}" alt="${user.username}'s avatar" />
        <div class="discord-info">
          <div class="discord-username">${user.username}</div>
          <div class="discord-status">
            <span class="status-dot ${statusMap[status]?.class || 'status-offline'}"></span>
            ${statusMap[status]?.emoji || '⚫'} ${statusMap[status]?.text || 'Offline'}
          </div>
        </div>
      </div>
    `;
}

function showLoading() {
    card.innerHTML = `<div class="loading">Loading...</div>`;
}

function showError() {
    card.innerHTML = `
      <div class="error">Failed to load Discord profile 💔</div>
      <button class="retry-btn" onclick="init()">Retry</button>
    `;
}

function init() {
    showLoading();

    const ws = new WebSocket("wss://api.lanyard.rest/socket");

    ws.addEventListener("open", () => {
        ws.send(JSON.stringify({
            op: 2,
            d: { subscribe_to_id: userId }
        }));
    });

    ws.addEventListener("message", (event) => {
        const payload = JSON.parse(event.data);
        if (payload.op === 0 && payload.d.discord_user) {
            const user = payload.d.discord_user;
            const status = payload.d.discord_status || 'offline';
            renderCard(user, status);
        }
    });

    ws.addEventListener("error", () => {
        showError();
    });

    ws.addEventListener("close", () => {
        setTimeout(init, 3000);
    });
}

init();
