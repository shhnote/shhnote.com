// Show/hide buttons on passphrase fields. A phase-1 stand-in: the `@shhnote/client/ui`
// controller takes this over when the flows are wired.
for (const button of document.querySelectorAll<HTMLButtonElement>('[data-shh-pwd-toggle]')) {
  const input = button.closest('[data-shh-pwd-input]')?.querySelector<HTMLInputElement>('input');
  if (!input) continue;
  button.addEventListener('click', () => {
    const show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    button.setAttribute('aria-pressed', show ? 'true' : 'false');
  });
}
