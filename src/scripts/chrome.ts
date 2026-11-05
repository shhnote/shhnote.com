// Page chrome from the client package: the theme choice (light / dark / match system),
// the <details> menus (close on outside click, focus loss and Escape) and the show/hide
// buttons on passphrase fields.
import { getConfig } from '@shhnote/client';
import { wireMenus, wirePasswordToggles, wireTheme } from '@shhnote/client/ui';
import { apiBase } from '../lib/instance';

wireTheme();
wireMenus();
wirePasswordToggles();

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
