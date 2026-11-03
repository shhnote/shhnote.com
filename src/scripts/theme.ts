// Theme menu: light, dark or system. The choice lives in localStorage only (no cookie,
// nothing sent). `data-theme` on <html> drives the tokens; "system" follows the OS.
const KEY = 'theme';
const root = document.documentElement;

type Theme = 'light' | 'dark' | 'system';
const themes: readonly Theme[] = ['light', 'dark', 'system'];

function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && (themes as readonly string[]).includes(value);
}

function read(): Theme {
  try {
    const v = localStorage.getItem(KEY);
    return isTheme(v) ? v : 'system';
  } catch {
    return 'system';
  }
}

function apply(theme: Theme): void {
  root.setAttribute('data-theme', theme);
  for (const option of document.querySelectorAll<HTMLButtonElement>('[data-theme-option]')) {
    option.setAttribute('aria-checked', option.dataset['themeOption'] === theme ? 'true' : 'false');
  }
}

apply(read());

for (const option of document.querySelectorAll<HTMLButtonElement>('[data-theme-option]')) {
  option.addEventListener('click', () => {
    const next = option.dataset['themeOption'];
    if (!isTheme(next)) return;
    apply(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage blocked: the choice lasts for this page only */
    }
    option.closest('details')?.removeAttribute('open');
  });
}

// One open menu at a time; click outside or Escape closes.
const menus = document.querySelectorAll<HTMLDetailsElement>('details.menu');
for (const menu of menus) {
  menu.addEventListener('toggle', () => {
    if (!menu.open) return;
    for (const other of menus) if (other !== menu) other.removeAttribute('open');
  });
}
document.addEventListener('click', (event) => {
  for (const menu of menus) {
    if (menu.open && !menu.contains(event.target as Node)) menu.removeAttribute('open');
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  for (const menu of menus) {
    if (menu.open) {
      menu.removeAttribute('open');
      menu.querySelector<HTMLElement>('summary')?.focus();
    }
  }
});
