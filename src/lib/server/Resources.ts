import type { Icon, Brand, BrandIcon, Flag } from '$lib/components/interfaces';
import type { Dir } from 'node:fs';
import * as fs from 'node:fs/promises';

class BrandUtil {
	static async getIcon(path: string[]): Promise<BrandIcon | null> {
		let icon: BrandIcon | null = null;

		try {
			icon = Bun.JSON5.parse(await Bun.file(path.join("/").concat("/asset.json5")).text()) as BrandIcon;
		} catch (ignored) {
			return null;
		}

		if (!!icon.default) {
			try {
				icon.default.svg = await Bun.file(path.join("/").concat("/default.svg")).text();
			} catch (ignored) {}
		}
		if (!!icon.dark) {
			try {
				icon.dark.svg = await Bun.file(path.join("/").concat("/dark.svg")).text();
			} catch (ignored) {}
		}
		if (!!icon.monochrome) {
			try {
				icon.monochrome.svg = await Bun.file(path.join("/").concat("/monochrome.svg")).text();
			} catch (ignored) {}
		}
		if (!!icon.variable) {
			try {
				icon.variable.svg = await Bun.file(path.join("/").concat("/variable.svg")).text();
			} catch (ignored) {}
		}

		return icon;
	}

	static async getExtraIcons(path: string): Promise<BrandIcon[]> {
		const icons: BrandIcon[] = [];

		try {
			const dir: Dir = await fs.opendir(path.concat("/assets","/extra"));

			for await (const extra of dir) {
				const icon: BrandIcon | null = await this.getIcon([path,"assets","extra",extra.name]);
				if (icon !== null) icons.push(icon);
			}
		} catch (ignored) {}

		return icons;
	}
}

class Util {
	static async getIcon(path: string[]): Promise<Icon | null> {
		let icon: Icon | null = null;

		try {
			icon = Bun.JSON5.parse(await Bun.file(path.join("/").concat("/asset.json5")).text()) as Icon;
		} catch (ignored) {
			return null;
		}

		if (icon !== null) {
			try {
				icon.svg = await Bun.file(path.join("/").concat("/default.svg")).text();
			} catch (ignored) {}
		}

		return icon;
	}

	static async getExtraIcons(path: string): Promise<Icon[]> {
		const icons: Icon[] = [];

		try {
			const dir: Dir = await fs.opendir(path.concat("/assets","/extra"));

			for await (const extra of dir) {
				const icon: Icon | null = await this.getIcon([path,"assets","extra",extra.name]);
				if (icon !== null) icons.push(icon);
			}
		} catch (ignored) {}

		return icons;
	}
}

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

		for await (const dirent of dir) {
			if (!dirent.isDirectory()) continue;

			const path: string = dirent.parentPath.concat("/", dirent.name);
			if (!(await Bun.file(path.concat("/brand.json5")).exists())) continue;

			const brand: Brand = Bun.JSON5.parse(await Bun.file(path.concat("/brand.json5")).text()) as Brand;
			brand.assets = {
				extra: await BrandUtil.getExtraIcons(path)
			};

			const icon: BrandIcon | null = await BrandUtil.getIcon([path,"assets","icon"]);
			if (icon !== null) {
				brand.assets.icon = icon;
			}

			const logo: BrandIcon | null = await BrandUtil.getIcon([path,"assets","logo"]);
			if (logo !== null) {
				brand.assets.logo = logo;
			}

			this.BRAND_ICONS.push(brand);
		}
	}

	private async loadFlagIcons(): Promise<void> {
		console.log("Loading flag icons...");
		const dir: Dir = await fs.opendir(process.cwd() + (process.cwd().endsWith('/') ? '' : '/') + 'resources/icons/flags');

		for await (const dirent of dir) {
			if (!dirent.isDirectory()) continue;

			const path: string = dirent.parentPath.concat("/", dirent.name);
			if (!(await Bun.file(path.concat("/flag.json5")).exists())) continue;

			const country: Flag = Bun.JSON5.parse(await Bun.file(path.concat("/flag.json5")).text()) as Flag;

			const flag: Icon | null = await Util.getIcon([path,"assets","flag"]);
			if (flag !== null) {
				country.assets = {
					flag,
					extra: await Util.getExtraIcons(path)
				};
			}

			this.FLAG_ICONS.push(country);
		}
	}
}