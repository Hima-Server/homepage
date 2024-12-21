const body = document.body;
const main = document.getElementsByClassName('main-content')[0];

// Base
async function fetchJson(path) {
  console.log(`Try to fetch ${path}.`);
  const response = await fetch(path);
  if (!response.ok) return console.error(`Failed to fetch ${path}.`);
  const rawData = await response.text();
  const data = JSON.parse(rawData);
  console.log(`Successfully fetched ${path}.`, data);
  return data;
};

async function fetchText(path) {
  console.log(`Try to fetch ${path}.`);
  const response = await fetch(path);
  if (!response.ok) return console.error(`Failed to fetch ${path}.`);
  const rawData = await response.text();
  let data = rawData;
  if (data.endsWith('\n')) data = data.slice(0, -1);
  data = data.replace(/\n/g, '<br>');
  console.log(`Successfully fetched ${path}.`, data);
  return data;
};
function replaceLinkAndImage(markdownText) {
  markdownText = markdownText.replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" title="$1" alt="$1">');
  markdownText = markdownText.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank">$1</a>');

  return markdownText;
}

function replaceMarkdown(markdownText) {
  markdownText = markdownText.replace(/\<br\>/g, '\n');

  const escapePlaceholders = {};

  markdownText = markdownText.replace(/\\\\/g, (match, offset) => {
    const placeholder = `&ESCAPEDBACKSLASH!!${offset}!!;`;
    escapePlaceholders[placeholder] = '\\';
    return placeholder;
  });

  markdownText = markdownText.replace(/\\([*_~|`>[\]()\-!])/g, (match, p1, offset) => {
    const placeholder = `&ESCAPEDCHAR!!${offset}!!;`;
    escapePlaceholders[placeholder] = p1;
    return placeholder;
  });

  markdownText = markdownText.replace(/```([a-zA-Z]*)\n([\s\S]*?)\n```/gim, '<pre><code class="language-$1">$2</code></pre>');
  markdownText = markdownText.replace(/`([^`]+)`/gim, '<code>$1</code>');

  markdownText = markdownText.replace(/^###### (.*?)$\n/gim, '<h6>$1</h6>');
  markdownText = markdownText.replace(/^##### (.*?)$\n/gim, '<h5>$1</h5>');
  markdownText = markdownText.replace(/^#### (.*?)$\n/gim, '<h4>$1</h4>');
  markdownText = markdownText.replace(/^### (.*?)$\n/gim, '<h3>$1</h3>');
  markdownText = markdownText.replace(/^## (.*?)$\n/gim, '<h2>$1</h2>');
  markdownText = markdownText.replace(/^# (.*?)$\n/gim, '<h1>$1</h1>');

  markdownText = markdownText.replace(/^---\n/gim, '<hr>');

  markdownText = markdownText.replace(/\*\*\*(.*?)\*\*\*/gim, '<strong><em>$1</em></strong>');
  markdownText = markdownText.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  markdownText = markdownText.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  markdownText = markdownText.replace(/~~(.*?)~~/gim, '<del>$1</del>');

  markdownText = markdownText.replace(/___(.*?)___/gim, '<u><strong>$1</strong></u>');
  markdownText = markdownText.replace(/__(.*?)__/gim, '<u>$1</u>');
  markdownText = markdownText.replace(/_(.*?)_/gim, '<em>$1</em>');

  markdownText = markdownText.replace(/\|\|(.*?)\|\|/gim, '<mark>$1</mark>');

  markdownText = markdownText.replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" title="$1" alt="$1">');
  markdownText = markdownText.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank">$1</a>');

  markdownText = markdownText.replace(/(\d+\.\s+.*(?:\n\d+\.\s+.*)*)/gim, (match) => {
    const items = match
      .split('\n')
      .map(line => line.replace(/^\d+\.\s+(.*)/gim, '<li>$1</li>'))
      .join('');
    return `<ol>${items}</ol>`;
  });

  markdownText = markdownText.replace(/(\-\s+.*(?:\n\-\s+.*)*)/gim, (match) => {
    const items = match
      .split('\n')
      .map(line => line.replace(/^\-\s+(.*)/gim, '<li>$1</li>'))
      .join('');
    return `<ul>${items}</ul>`;
  });

  markdownText = markdownText.replace(/> (.*$)\n/gim, '<blockquote>$1</blockquote>');

  for (const placeholder in escapePlaceholders) {
    const value = escapePlaceholders[placeholder];
    const regex = new RegExp(placeholder, 'g');
    markdownText = markdownText.replace(regex, value);
  }

  return markdownText.replace(/\n/g, '<br>');
}

async function getDiscordUserInfo(userId) {
  const url = `https://avatar-cyan.vercel.app/api/${userId}`;
  return (await fetchJson(url)).avatarUrl;
}

// Redirect
document.addEventListener('click', (event) => {
  const target = event.target;

  const link = target.closest('a');
  if (link) {
    const currentDomain = window.location.hostname;
    const linkHost = new URL(link.href).hostname;

    if (linkHost !== currentDomain) {
      event.preventDefault();
      const redirectUrl = link.href;

      window.open(`redirect.html?url=${encodeURIComponent(redirectUrl)}`, '_blank');
    }
  }
});

// Page Top
const pagetop = document.getElementById('pagetop');
if (pagetop) {
  const number = Math.floor(Math.random() * 10);
  pagetop.style.backgroundImage = `url("/img/top-background/${number}.png")`
  const home = document.createElement('div');
  home.id = 'home';

  const logo = document.createElement('img');
  logo.className = 'logo';
  logo.src = '/img/logo.png';
  logo.title = '暇人鯖';
  logo.alt = '暇人鯖';
  home.appendChild(logo);

  pagetop.appendChild(home);
}

// Menu
let menuToggle, menuToggleIcon, menu;

function switchMenuToggleIcon(bool) {
  menuToggle.classList.toggle('rotated', bool);
  setTimeout(() => {
    menuToggle.textContent = bool ? '✕' : '≡';
  }, 50);
}

(async () => {
  menuToggle = document.createElement('button');
  menuToggle.className = 'menu-toggle';
  menuToggle.textContent = '≡';
  menuToggleIcon = false;
  body.appendChild(menuToggle);

  menu = document.createElement('div');
  menu.className = 'menu';

  const space = document.createElement('div');
  space.className = 'menu-space';
  space.innerHTML = '<h2>Menu</h2>';
  menu.appendChild(space);

  const list = document.createElement('ul');
  const pages = await fetchJson('/data/pages.json');
  for (const page of pages) {
    const link = document.createElement('li');
    link.innerHTML = `<a href="${page.href}"${page.blank ? 'target="_blank"' : ''}>${page.title}</a>`;
    list.appendChild(link);
  }
  menu.appendChild(list);
  body.appendChild(menu);
})();

menuToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  menu.classList.toggle('active');
  menuToggleIcon = !menuToggleIcon;
  switchMenuToggleIcon(menuToggleIcon);
});

body.addEventListener('click', (e) => {
  if (menu.classList.contains('active') && !menu.contains(e.target) && e.target !== menuToggle) {
    menu.classList.remove('active');
    menuToggleIcon = !menuToggleIcon;
    switchMenuToggleIcon(menuToggleIcon);
  }
});

menu.addEventListener('click', (e) => {
  e.stopPropagation();
});

// Social Links
(async () => {
  const socialLinks = document.createElement('div');
  socialLinks.className = 'social-links';

  const links = await fetchJson('/data/links.json');
  for (const link of links) {
    const a = document.createElement('a');
    a.href = link.href;
    a.target = '_blank';
    a.innerHTML = `<img src="/img/svg/${link.type}_w.svg" title="${link.type}" alt="${link.type}">`
    socialLinks.appendChild(a);
  }
  body.appendChild(socialLinks);
})();

// Footer
const footer = document.createElement('footer');
footer.innerHTML = `<p>© 2023 - 2024 暇人鯖 All rights reserved.<p>`
body.appendChild(footer);
