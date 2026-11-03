import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

// Facts the controllers read from the <body> (`data-shh-*`): the API base and the asset
// version that cache-busts `argon2.wasm`. In production the API is on this origin.
export const apiBase: string = import.meta.env.PUBLIC_SHH_API_BASE ?? '/api/v1';

// The instance's `max_blob_bytes` (GET /config), so a reveal refuses an oversized body before
// buffering it even if /config has not answered yet (conformance item 6). 64 MiB here.
export const maxBlobBytes: number = Number(import.meta.env.PUBLIC_SHH_MAX_BLOB_BYTES ?? 67108864);

// The package does not export its package.json; find it next to the module it does export.
const require = createRequire(import.meta.url);
const packageDir = dirname(require.resolve('@shhnote/client/argon2.wasm'));
export const clientVersion: string = (
  JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8')) as { version: string }
).version;

/** The URL the client package requests the Argon2 module from (see `argon2Url` in `/ui`). */
export const argon2Url = `/static/argon2.wasm?v=${clientVersion}`;
