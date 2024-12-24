// Home
const joinDiscord = document.getElementById('join-discord');
if (joinDiscord) {
  (async () => {
    const data = await fetchJson('/data/links.json');
    const discordInvite = data[data.findIndex(item => item.type === 'discord')].href;
    joinDiscord.href = discordInvite;
  })();
}

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
    minecraftDescription.innerHTML = replaceMarkdown(await fetchText('/data/minecraft/description.txt'));
  })();
}

const minecraftRule = document.getElementById('minecraft-rule');
if (minecraftRule) {
  (async () => {
    minecraftRule.innerHTML = replaceMarkdown(await fetchText('/data/minecraft/rule.txt'));
  })();
}

// Staff
(async () => {
  const socials = {
    twitter: "https://twitter.com/"
  };
  const users = await fetchJson('/data/users.json');
  const perms = ['owners', 'sub-owners', 'admins', 'moderators', 'operators', 'planners'];
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

// Donate
const donateChannel = document.getElementById('donate-channel');
if (donateChannel) {
  (async () => {
    donateChannel.href = (await fetchJson('/data/donate/data.json')).channel;
  })();
}

const goDonate = document.getElementById('go-donate');
if (goDonate) {
  (async () => {
    goDonate.href = (await fetchJson('/data/donate/data.json')).channel;
  })();
}

const donateDescriptions = document.querySelectorAll('.donate-description');
donateDescriptions.forEach(async (description) => {
  const dataPath = description.getAttribute('data-path');
  if (dataPath) {
    try {
      const text = await fetchText(`/data/donate/${dataPath}.txt`);
      description.innerHTML = replaceMarkdown(text);
    } catch (error) {
      console.error(`Failed to fetch or process markdown for ${dataPath}:`, error);
    }
  }
});

const donators = document.getElementById('donators');
if (donators) {
  (async () => {
    const data = await fetchJson('/data/donate/users.json');
    const allDonators = data.donators;
    const donatorsCount = document.getElementById('donators-count');
    if (donatorsCount) donatorsCount.textContent = allDonators.length.toLocaleString();

    for (let i = 0; i < data.anonymous; i++) {
      allDonators.push({ name: '匿名', id: 'anonymous' });
    }
    for (const user of allDonators) {
      const userData = user.id === 'anonymous' ? { avatarUrl: '/img/assets/anonymous.png', username: 'anonymous' } : await getDiscordUserInfo(user.id);
      const member = document.createElement('div');
      member.className = 'donator';
      member.innerHTML = `
        <img src="${userData.avatarUrl}" title="${user.name}" alt="${user.name}">
        <div class="donator-name">
          <h3><a href="https://discord.com/users/${user.id}" target="_blank">${user.name}</a></h3>
          <h5>ID: ${user.id === 'anonymous' ? `<code id="anonymous-id">${userData.username}</code>` : userData.username}</h5>
        </div>
      `
      donators.appendChild(member);
    }
  })();
}

// Format History
function formatHistory(content) {
  if (!content.endsWith('<br>')) content += '<br>';
  content = content.replace(/(.*?)\<br\>/g, '<p class="history-content">$1</p>');
  content = content.replace(/'(.*?)'/g, '<span class="history-description">$1</span>');
  content = content.replace(/\<p class="history-content"\>!!(.*?)!!\<\/p\>/g, '<h2 class="history-year">$1</h2>');
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  content = content.replace(/\b(\d{2}\/\d{2})\b/g, '<span class="history-date">$1</span>');
  content = content.replace(/\\n/g, '<br>');

  return replaceLinkAndImage(content);
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