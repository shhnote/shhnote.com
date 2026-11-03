import { copyFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { createReadStream, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import type { AstroIntegration } from 'astro';

// Serves `@shhnote/client`'s Argon2id module from this origin. The build writes it to
// `dist/argon2.wasm` (the site's own path) and `dist/static/argon2.wasm` (the path the
// package's controllers request, `/static/argon2.wasm?v=…`); the dev server answers both.
const require = createRequire(import.meta.url);
const source = require.resolve('@shhnote/client/argon2.wasm');
const paths = ['/argon2.wasm', '/static/argon2.wasm'];

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
                    const path = (req.url ?? '').split('?')[0];
                    if (!paths.includes(path)) return next();
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
        const out = fileURLToPath(dir);
        for (const path of paths) {
          const target = join(out, path);
          await mkdir(join(target, '..'), { recursive: true });
          await copyFile(source, target);
        }
      },
    },
  };
}
