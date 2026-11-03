// Page chrome from the client package: the theme choice (light / dark / match system),
// the <details> menus (close on outside click, focus loss and Escape) and the show/hide
// buttons on passphrase fields.
import { apiFrom, wireMenus, wirePasswordToggles, wireTheme } from '@shhnote/client/ui';

wireTheme();
wireMenus();
wirePasswordToggles();

// Footer: the server's version from GET /config. Not on the secret pages, which must send
// nothing before a trusted activation (conformance item 2); they keep the static "—".
const secretPage = document.querySelector('[data-shh-page="reveal"], [data-shh-page="burn"], [data-shh-page="report"]');
const versionSlots = document.querySelectorAll<HTMLElement>('[data-shh-server-version]');
if (!secretPage && versionSlots.length > 0) {
  apiFrom(document.body)
    .config()
    .then((config) => {
      // `server_version` is in the response but not (yet) in the package's InstanceConfig type.
      const version = (config as { server_version?: string }).server_version ?? '—';
      for (const slot of versionSlots) slot.textContent = version;
    })
    .catch(() => {});
}
