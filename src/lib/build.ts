import { execFileSync } from 'node:child_process';
import { site } from './site';

// The commit this build was made from, printed in the footer and linked to the repository,
// so a visitor can match the pages served to the source. Releases are named by commit
// rather than by version (.github/workflows/release.yml). Read once, at build time.
function readCommit(): string | undefined {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim() || undefined;
  } catch {
    return undefined;
  }
}

const commit = readCommit();

export const build = {
  commit,
  shortCommit: commit?.slice(0, 7),
  commitUrl: commit ? `${site.clientRepo}/commit/${commit}` : undefined,
} as const;
