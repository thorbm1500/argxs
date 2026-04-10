import type { PageServerLoad } from './$types';
import * as fs from 'node:fs/promises';
import type { Dirent } from 'node:fs';

export const load: PageServerLoad = async () => {
	const files: string[] = [];
	const dir = await fs.opendir(process.cwd() + "/icons/flags");
	let file: Dirent | null = dir.readSync();

	while (file !== null) {
		if (file.isFile()) {
			files.push(await Bun.file(file.parentPath + "/" + file.name).text());
		}
		file = dir.readSync();
	}

	return {
		files
	}
};