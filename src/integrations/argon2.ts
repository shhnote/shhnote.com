import { copyFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { createReadStream, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import type { AstroIntegration } from 'astro';

// Serves `@shhnote/client`'s Argon2id module from this origin at `/argon2.wasm` (the URL the
// pages pass to the controllers as `argon2Url`, see src/lib/instance.ts). The build copies
// it to `dist/argon2.wasm`; the dev server answers the same path.
const require = createRequire(import.meta.url);
const source = require.resolve('@shhnote/client/argon2.wasm');
const path = '/argon2.wasm';

export function argon2(): AstroIntegration {
  return {
    name: 'argon2-wasm',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [
              {
                name: 'argon2-wasm-dev',
                configureServer(server) {
                  server.middlewares.use((req, res, next) => {
                    if ((req.url ?? '').split('?')[0] !== path) return next();
                    res.setHeader('Content-Type', 'application/wasm');
                    res.setHeader('Content-Length', statSync(source).size);
                    createReadStream(source).pipe(res);
                  });
                },
              },
            ],
          },
        });
      },
      'astro:build:done': async ({ dir }) => {
        await copyFile(source, join(fileURLToPath(dir), path));
      },
    },
  };
}
