// Page chrome from the client package: the theme choice (light / dark / match system),
// the <details> menus (close on outside click, focus loss and Escape) and the show/hide
// buttons on passphrase fields.
import { getConfig } from '@shhnote/client';
import { wireMenus, wirePasswordToggles, wireTheme } from '@shhnote/client/ui';
import { apiBase } from '../lib/instance';

wireTheme();
wireMenus();
wirePasswordToggles();

// Browser chrome colour: the two <meta name="theme-color"> tags in the head follow the
// system scheme only, which is right without JavaScript. Once a theme can be chosen
// (light, dark, either high-contrast variant), keep them at the page's own background
// token, re-read whenever `data-theme` changes or the system scheme flips.
const themeMetas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');
function syncThemeColor(): void {
  const background = getComputedStyle(document.documentElement).getPropertyValue('--color-background').trim();
  if (!background) return;
  for (const meta of themeMetas) meta.content = background;
}
if (themeMetas.length > 0) {
  syncThemeColor();
  new MutationObserver(syncThemeColor).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', syncThemeColor);
}

// Footer: the server's version from GET /config, through the package's shared `getConfig`,
// so the create page's own read of /config is the same single request. Not on the secret
// pages, which must send nothing before a trusted activation (conformance item 2); they
// keep the static "—".
const secretPage = document.querySelector('[data-shh-page="reveal"], [data-shh-page="burn"], [data-shh-page="report"]');
const versionSlots = document.querySelectorAll<HTMLElement>('[data-shh-server-version]');
if (!secretPage && versionSlots.length > 0) {
  getConfig(apiBase)
    .then((config) => {
      for (const slot of versionSlots) slot.textContent = config.server_version;
    })
    .catch(() => {});
}
