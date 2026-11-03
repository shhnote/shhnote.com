// Theme toggle. The stored preference lives in localStorage only (no cookie, nothing sent).
const KEY = 'theme';
const root = document.documentElement;

type Theme = 'dark' | 'light';

function read(): Theme | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : null;
  } catch {
    return null;
  }
}

function apply(theme: Theme): void {
  root.setAttribute('data-theme', theme);
}

const stored = read();
if (stored) apply(stored);

for (const button of document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')) {
  button.addEventListener('click', () => {
    const next: Theme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    apply(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage blocked: the choice lasts for this page only */
    }
  });
}
