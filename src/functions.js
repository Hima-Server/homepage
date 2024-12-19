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

function replaceMarkdownCodes(input) {
  return input.replace(/`(.*?)`/g, '<code>$1</code>');
}

function replaceMarkdownLinks(input) {
  return input.replace(/\[(.+?)\]\((https?:\/\/\S+?)\)/g, (match, text, url) => {
    return `<a href="${url}" target="_blank">${text}</a>`;
  });
}

async function getDiscordUserInfo(userId) {
  const url = `https://avatar-cyan.vercel.app/api/${userId}`;
  return (await fetchJson(url)).avatarUrl;
}

const body = document.body;
const main = document.getElementsByClassName('main-content')[0];

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
    menuToggle.textContent = bool ? '×' : '≡';
  }, 300);
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
