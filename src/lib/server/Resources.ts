import type { Icon, Brand, VariableIcon, Flag, BrandConfiguration, FlagConfiguration } from '$lib/components/interfaces';
import type { Dir } from 'node:fs';
import * as fs from 'node:fs/promises';
import { env } from '$env/dynamic/private';

const root: string = process.cwd() + (process.cwd().endsWith('/') ? '' : '/') + (env.NODE_ENV === 'production' ? 'resources' : 'src/lib/resources');

class BrandUtil {
	static async getIcon(path: string[]): Promise<VariableIcon | null> {
		let icon: VariableIcon | null = null;

		try {
			icon = Bun.JSON5.parse(await Bun.file(path.join('/').concat('/asset.json5')).text()) as VariableIcon;
		} catch (ignored) {
			return null;
		}

		if (!!icon.default) {
			try {
				icon.default.svg = await Bun.file(path.join('/').concat('/default.svg')).text();
			} catch (ignored) {}
		}
		if (!!icon.dark) {
			try {
				icon.dark.svg = await Bun.file(path.join('/').concat('/dark.svg')).text();
			} catch (ignored) {}
		}
		if (!!icon.monochrome) {
			try {
				icon.monochrome.svg = await Bun.file(path.join('/').concat('/monochrome.svg')).text();
			} catch (ignored) {}
		}
		if (!!icon.monochrome_white) {
			try {
				icon.monochrome_white.svg = await Bun.file(path.join('/').concat('/monochrome-white.svg')).text();
			} catch (ignored) {}
		}
		if (!!icon.monochrome_black) {
			try {
				icon.monochrome_black.svg = await Bun.file(path.join('/').concat('/monochrome-black.svg')).text();
			} catch (ignored) {}
		}
		if (!!icon.variable) {
			try {
				icon.variable.svg = await Bun.file(path.join('/').concat('/variable.svg')).text();
			} catch (ignored) {}
		}

		return icon;
	}

	static async getExtraIcons(path: string): Promise<VariableIcon[]> {
		const icons: VariableIcon[] = [];

		try {
			const dir: Dir = await fs.opendir(path.concat('/assets', '/extra'));

			for await (const extra of dir) {
				const icon: VariableIcon | null = await this.getIcon([path, 'assets', 'extra', extra.name]);
				if (icon !== null) icons.push(icon);
			}
		} catch (ignored) {}

		return icons;
	}
}

class Util {
	static async getIcon(path: string[]): Promise<Icon> {
		let icon: Icon | null = null;

		try {
			icon = Bun.JSON5.parse(await Bun.file(path.join('/').concat('/asset.json5')).text()) as Icon;
		} catch (ignored) {
			return { svg: 'undefined' };
		}

		if (icon !== null) {
			try {
				icon.svg = await Bun.file(path.join('/').concat('/default.svg')).text();
			} catch (ignored) {}
		}

		return icon;
	}

	static async getExtraIcons(path: string): Promise<Icon[]> {
		const icons: Icon[] = [];

		try {
			const dir: Dir = await fs.opendir(path.concat('/assets', '/extra'));

			for await (const extra of dir) {
				const icon: Icon | null = await this.getIcon([path, 'assets', 'extra', extra.name]);
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
		console.log('Loading brand icons...');
		const dir: Dir = await fs.opendir(root.concat('/icons/brands'));

		for await (const dirent of dir) {
			if (!dirent.isDirectory()) continue;

			const path: string = dirent.parentPath.concat('/', dirent.name);
			if (!(await Bun.file(path.concat('/brand.json5')).exists())) continue;

			const conf: BrandConfiguration = Bun.JSON5.parse(await Bun.file(path.concat('/brand.json5')).text()) as BrandConfiguration;
			const brand: Brand = {
				...conf,
				extra: await BrandUtil.getExtraIcons(path)
			};
			if (conf.href) brand.href = conf.href;

			const icon: VariableIcon | null = await BrandUtil.getIcon([path, 'assets', 'icon']);
			if (icon !== null) {
				brand.icon = icon;
			}

			const logo: VariableIcon | null = await BrandUtil.getIcon([path, 'assets', 'logo']);
			if (logo !== null) {
				brand.logo = logo;
			}

			this.BRAND_ICONS.push(brand);
		}
	}

	private async loadFlagIcons(): Promise<void> {
		console.log('Loading flag icons...');
		const dir: Dir = await fs.opendir(root.concat('/icons/flags'));

		for await (const dirent of dir) {
			if (!dirent.isDirectory()) continue;

			const path: string = dirent.parentPath.concat('/', dirent.name);
			if (!(await Bun.file(path.concat('/flag.json5')).exists())) continue;

			const conf: FlagConfiguration = Bun.JSON5.parse(await Bun.file(path.concat('/flag.json5')).text()) as FlagConfiguration;

			this.FLAG_ICONS.push({
				...conf,
				flag: await Util.getIcon([path, 'assets', 'flag']),
				extra: await Util.getExtraIcons(path)
			});
		}
	}
}