// Page chrome from the client package: the theme choice (light / dark / match system),
// the <details> menus (close on outside click, focus loss and Escape) and the show/hide
// buttons on passphrase fields.
import { ApiError, getConfig } from '@shhnote/client';
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

// GET /config, through the package's shared `getConfig`, so the create page's own read of
// /config is the same single request. Not on the secret pages, which must send nothing
// before a trusted activation (conformance item 2); they keep the static "—".
//
// The footer shows the server's version from it. An instance whose setup is not finished
// answers 503 `not_configured` to every public call: then the page's content gives way to
// the layout's setup notice, as the server's own pages do. Any other failure (network,
// another error) leaves the page as it is.
const secretPage = document.querySelector('[data-shh-page="reveal"], [data-shh-page="burn"], [data-shh-page="report"]');
if (!secretPage) {
  getConfig(apiBase)
    .then((config) => {
      for (const slot of document.querySelectorAll<HTMLElement>('[data-shh-server-version]')) {
        slot.textContent = config.server_version;
      }
    })
    .catch((error: unknown) => {
      if (error instanceof ApiError && error.code === 'not_configured') showSetup();
    });
}

function showSetup(): void {
  const setup = document.querySelector<HTMLElement>('[data-shh-setup]');
  const main = setup?.parentElement;
  if (!setup || !main) return;
  for (const child of main.children) {
    if (child !== setup) (child as HTMLElement).hidden = true;
  }
  setup.hidden = false;
  const heading = setup.querySelector('h1')?.textContent;
  if (heading) document.title = heading;
}
