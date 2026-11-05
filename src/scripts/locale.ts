// An explicit language choice. Picking a language in the switcher stores it (the same
// mechanism as the theme: localStorage when the browser allows it); every page then
// compares the stored choice with its own language and, when they differ, replaces
// itself with the same page in the chosen language, keeping the query and the fragment
// (a share link's secret lives in the fragment and must survive the hop). The target
// is taken from the page's own hreflang alternates, so a page that is not built in the
// chosen language stays as it is. Nothing happens without a stored choice, so a first
// visit lands where the link or the server's Accept-Language redirect pointed. The
// switcher is plain links and works without this script.
const KEY = 'shhnote-locale';

function stored(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function remember(locale: string): void {
  try {
    localStorage.setItem(KEY, locale);
  } catch {
    /* storage unavailable: the link still navigates */
  }
}

const choice = stored();
const here = document.documentElement.lang;
if (choice && choice !== here) {
  const alternate = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${CSS.escape(choice)}"]`);
  if (alternate) {
    const target = new URL(alternate.href).pathname + location.search + location.hash;
    if (target !== location.pathname + location.search + location.hash) location.replace(target);
  }
}

document.addEventListener('click', (event) => {
  const link = (event.target as Element | null)?.closest<HTMLElement>('[data-shh-locale-choice]');
  const locale = link?.dataset['shhLocaleChoice'];
  if (locale) remember(locale);
});
