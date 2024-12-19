// Minecraft
const isWorking = document.getElementById('minecraft-is-working');
if (isWorking) {
  (async () => {
    const data = await fetchJson('/data/minecraft/data.json');
    isWorking.textContent = data.is_working ? "現在、暇人鯖ではマイクラ鯖が稼働中！" : "現在、暇人鯖ではマイクラ鯖が停止中";
  })();
}

const minecraftDescription = document.getElementById('minecraft-description');
if (minecraftDescription) {
  (async () => {
    minecraftDescription.innerHTML = replaceMarkdownCodes(await fetchText('/data/minecraft/description.txt'));
  })();
}

// Staff
(async () => {
  const socials = {
    twitter: "https://twitter.com/"
  };
  const users = await fetchJson('/data/users.json');
  const perms = ['owners', 'admins', 'moderators', 'operators', 'planners'];
  for (const perm of perms) {
    const members = document.getElementById(perm);
    if (members) {
      for (const user of users[perm]) {
        const data = await getDiscordUserInfo(user.id);
        const member = document.createElement('div');
        member.className = 'member';
        member.innerHTML = `
          <h3><a href="https://discord.com/users/${user.id}" target="_blank">${user.name}</a></h3>
          <h5>ID: ${data.username}</h5>
        `;
        const description = document.createElement('div');
        description.className = 'member-description';
        description.innerHTML = `
          <img src="${data.avatarUrl}" title="${data.username}" alt="${data.username}">
          ${user.social ? `<a class="social-${user.social.type}" href="${socials[user.social.type]}${user.social.href}" target="_blank">${user.social.href}</a>` : ''}
          <p>${user.description ?? '---' }</p>
        `;
        member.appendChild(description);
        members.appendChild(member);
      }
    }
  }
})();

// Format History
function formatHistory(content) {
  if (!content.endsWith('<br>')) content = `${content}<br>`;
  content = content.replace(/(.*?)\<br\>/g, '<p class="history-content">$1</p>');
  content = content.replace(/'(.*?)'/g, '<span class="history-description">$1</span>');
  content = content.replace(/\<p class="history-content"\>!!(.*?)!!\<\/p\>/g, '<h2 class="history-year">$1</h2>');
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  content = content.replace(/\b(\d{2}\/\d{2})\b/g, '<span class="history-date">$1</span>');
  content = content.replace(/\\n/g, '<br>');
  content = replaceMarkdownLinks(content);

  return content;
}

// History
const history = document.getElementById('history');
if (history) {
  (async () => {
    const data = await fetchText('/data/history.txt');
    const historyData = formatHistory(data);
    history.innerHTML = `<p>${historyData}</p>`
  })();
}