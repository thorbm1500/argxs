import type { Brand, BrandInfo, Flag, Icon } from '$lib/components/interfaces';
import type { Dir, Dirent } from 'node:fs';
import * as fs from 'node:fs/promises';

export class Resources {
	readonly BRAND_ICONS: Brand[] = [];
	readonly FLAG_ICONS: Flag[] = [];

	async init(): Promise<void> {
		const startTime: number = Bun.nanoseconds();
		console.log('Initializing resources...');
		await this.loadBrandIcons();
		await this.loadFlagIcons();
		console.log(`Resource loading completed [${((Bun.nanoseconds() - startTime) / 1000000).toFixed(0)}ms]`);
	}

	private async loadBrandIcons(): Promise<void> {
		console.log("Loading brand icons...");
		const dir: Dir = await fs.opendir(process.cwd() + (process.cwd().endsWith('/') ? '' : '/') + 'resources/icons/brands');
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

					this.BRAND_ICONS.push(brand);
				} catch (ignored) {}
			}

			file = dir.readSync();
		}

		await dir.close();
	}

	private async loadFlagIcons(): Promise<void> {
		console.log("Loading flag icons...");
		const dir: Dir = await fs.opendir(process.cwd() + (process.cwd().endsWith('/') ? '' : '/') + 'resources/icons/flags');
		let file: Dirent | null = dir.readSync();

		while (file !== null) {
			if (file.isDirectory()) {
				const currentPath: string = file.parentPath + '/' + file.name;

				try {
					const country: Flag = Bun.JSON5.parse(await Bun.file(currentPath + '/flag.json5').text()) as Flag;
					country.icons = {
						default: await Bun.file(currentPath + '/default.svg').text(),
						extras: []
					}

					try {
						const extras: Dir = await fs.opendir(currentPath + '/extras');
						let extra: Dirent | null = extras.readSync();

						while (extra !== null) {
							try {
								country.icons.extras?.push(await Bun.file(extras.path + '/' + extra.name).text());
							} catch (ignored) {}
							extra = extras.readSync();
						}
					} catch (ignored) {}

					this.FLAG_ICONS.push(country);
				} catch (ignored) {}
			}

			file = dir.readSync();
		}

		await dir.close();
	}
}