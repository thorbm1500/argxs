import type { PageServerLoad } from './$types';
import * as fs from 'node:fs/promises';
import type { Dir, Dirent } from 'node:fs';
import type { Brand, BrandInfo, Icon } from '$lib/components/interfaces';

export const load: PageServerLoad = async () => {
	const brands: Brand[] = [];
	const dir: Dir = await fs.opendir(process.cwd() + '/icons/brands');
	let file: Dirent | null = dir.readSync();

	while (file !== null) {
		if (file.isDirectory()) {
			const currentPath: string = file.parentPath + '/' + file.name;

			try {
				const brand: Brand = {
					info: Bun.JSON5.parse(await Bun.file(currentPath + '/brand.json5').text()) as BrandInfo,
					icons: [],
					logos: []
				};

				try {
					const icon: Icon = {
						regular: await Bun.file(currentPath + '/icons/icon.svg').text()
					};

					try {
						icon.dark = await Bun.file(currentPath + '/icons/icon-dark.svg').text();
					} catch (ignored) {
						icon.dark = icon.regular;
					}

					brand.icons?.push(icon);
				} catch (ignored) {}

				try {
					const logo: Icon = {
						regular: await Bun.file(currentPath + '/icons/logo.svg').text()
					};

					try {
						logo.dark = await Bun.file(currentPath + '/icons/logo-dark.svg').text();
					} catch (ignored) {
						logo.dark = logo.regular;
					}

					brand.logos?.push(logo);
				} catch (ignored) {}

				brands.push(brand);
			} catch (ignored) {}
		}

		file = dir.readSync();
	}

	dir.close();

	return {
		brands
	};
};