// Page chrome from the client package: the theme choice (light / dark / match system),
// the <details> menus (close on outside click, focus loss and Escape) and the show/hide
// buttons on passphrase fields.
import { wireMenus, wirePasswordToggles, wireTheme } from '@shhnote/client/ui';

wireTheme();
wireMenus();
wirePasswordToggles();
