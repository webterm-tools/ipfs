import { LockExistsError } from 'ipfs-repo/errors';
import path from 'path';
import debug from 'debug';
import {
  lock as properLock,
  check
} from 'proper-lockfile';
const log = debug('ipfs:repo:lock:fs');
const lockFile = 'repo.lock';
const STALE_TIME = 20000;
const lock = async dir => {
  const file = path.join(dir, lockFile);
  log('locking %s', file);
  let release;
  try {
    release = await properLock(dir, {
      lockfilePath: file,
      stale: STALE_TIME
    });
  } catch (err) {
    if (err.code === 'ELOCKED') {
      throw new LockExistsError(`Lock already being held for file: ${ file }`);
    } else {
      throw err;
    }
  }
  return { close: release };
};
const locked = dir => {
  const file = path.join(dir, lockFile);
  return check(dir, {
    lockfilePath: file,
    stale: STALE_TIME
  });
};
export const FSLock = {
  lock,
  locked
};
export const MemoryLock = FSLock