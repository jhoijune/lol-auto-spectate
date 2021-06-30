import { promises as fs } from 'fs';
import { join } from 'path';

export default async () => {
  const { ASSET_PATH } = process.env;
  const structurePath =
    (ASSET_PATH && join(ASSET_PATH, 'structure.sqlite3')) ||
    join(__dirname, '..', '..', 'assets', 'structure.sqlite3');
  const buffers = await fs.readFile(structurePath);
  const dbPath =
    (ASSET_PATH && join(ASSET_PATH, 'db.sqlite3')) ||
    join(__dirname, '..', '..', 'assets', 'db.sqlite3');
  await fs.writeFile(dbPath, buffers);
};
