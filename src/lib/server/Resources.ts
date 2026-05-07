import type { Brand, BrandIcon, ChangeLog, ColorCombo, ColorCombos, Flag } from '$lib/components/interfaces';
import * as fs from 'node:fs/promises';

const root: string = process.cwd() + (process.cwd().endsWith('/') ? '' : '/') + (Bun.env.NODE_ENV === 'production' ? 'resources' : 'src/lib/resources');

export class Resources {
	readonly BRAND_ICONS: BrandIcon[] = [];
	readonly BRAND_ICONS_SORTED_NEW: BrandIcon[] = [];
	readonly BRAND_ICONS_SORTED_AtoZ: BrandIcon[] = [];
	BRAND_ICON_AMOUNT: number = 0;
	BRAND_LOGO_AMOUNT: number = 0;
	BRAND_TOTAL_AMOUNT: number = 0;

	readonly FLAG_ICONS: Flag[] = [];
	FLAG_ICON_AMOUNT: number = 0;

	readonly COLOR_COMBOS: ColorCombo[] = [];
	COLOR_COMBO_AMOUNT: number = 0;

	readonly CHANGELOGS: ChangeLog[] = [];

	async init(): Promise<void> {
		const startTime: number = Bun.nanoseconds();
		console.log('Initializing resources...');
		await this.loadBrandIcons();
		await this.loadFlagIcons();
		await this.loadColorCombos();
		await this.loadChangeLogs();
		console.log(`Resource loading completed [${((Bun.nanoseconds() - startTime) / 1000000).toFixed(0)}ms]`);
	}

	private async loadBrandIcons(): Promise<void> {
		console.info('Loading brand icons...');
		const path: string = root.concat('/icons/brands');

		for (const brand of await fs.readdir(path)) {
			const current: Brand = Bun.JSON5.parse(await Bun.file(path.concat('/', brand)).text()) as Brand;
			for (const icon of current.assets) {
				icon.brand = current.name;
				let iconAmount = 1;

				if (icon.dark) iconAmount++;
				if (icon.monochrome_light) iconAmount++;
				if (icon.monochrome_dark) iconAmount++;
				if (icon.variable !== undefined) iconAmount += icon.variable.length;
				else icon.variable = [];

				icon.amount = iconAmount;

				if (icon.type === 'icon') this.BRAND_ICON_AMOUNT += iconAmount;
				else if (icon.type === 'logo') this.BRAND_LOGO_AMOUNT += iconAmount;
				this.BRAND_TOTAL_AMOUNT += iconAmount;

				icon.last_updated = this.getLatestDateFromIcon(icon);

				if (current.href && icon.href === undefined) icon.href = current.href;
				if (icon.name === undefined) icon.name = current.name;

				this.BRAND_ICONS.push(icon);
			}
		}

		this.BRAND_ICONS_SORTED_NEW.push(...this.BRAND_ICONS.toSorted((a, b) => this.getLatestDateFromIcon(b) - this.getLatestDateFromIcon(a)));
		this.BRAND_ICONS_SORTED_AtoZ.push(...this.BRAND_ICONS.toSorted((a, b) => a.name.localeCompare(b.name)));
	}

	private getLatestDateFromIcon(icon: BrandIcon): number {
		let result = 0;
		if (icon.default.date_added) {
			let current = Date.parse(icon.default.date_added);
			if (current > result) result = current;
		}
		if (icon.dark?.date_added) {
			let current = Date.parse(icon.dark.date_added);
			if (current > result) result = current;
		}
		if (icon.monochrome_light?.date_added) {
			let current = Date.parse(icon.monochrome_light.date_added);
			if (current > result) result = current;
		}
		if (icon.monochrome_dark?.date_added) {
			let current = Date.parse(icon.monochrome_dark.date_added);
			if (current > result) result = current;
		}
		for (const variable of icon.variable) {
			if (!variable.date_added) continue;
			let current = Date.parse(variable.date_added);
			if (current > result) result = current;
		}

		return result;
	}

	private async loadFlagIcons(): Promise<void> {
		console.info('Loading flag icons...');
		const path = root.concat('/icons/flags');
		const dir: string[] = await fs.readdir(path);

		for (const flag of dir) {
			this.FLAG_ICONS.push(Bun.JSON5.parse(await Bun.file(path.concat('/', flag)).text()) as Flag);
		}

		let amount = 0;
		for (const flag of this.FLAG_ICONS) {
			if (!flag.flags) continue;
			amount += flag.flags.length;
		}

		this.FLAG_ICON_AMOUNT = amount;
	}

	private async loadColorCombos(): Promise<void> {
		console.log('Loading color combos...');
		const conf: ColorCombos = Bun.JSON5.parse(await Bun.file(root.concat('/colors/combos/combos.json5')).text()) as ColorCombos;
		this.COLOR_COMBOS.push(...conf.combos);
		this.COLOR_COMBO_AMOUNT = this.COLOR_COMBOS.length;
	}

	private async loadChangeLogs(): Promise<void> {
		console.info('Loading changelogs...');
		const path = root.replace('/resources', '/server/resources').concat('/changelogs');
		const dir: string[] = await fs.readdir(path);

		for (const changelog of dir) {
			this.CHANGELOGS.push({
				version: changelog,
				log: await Bun.file(path.concat('/', changelog, '/CHANGELOG.md')).text()
			});
		}

		this.CHANGELOGS.sort((a, b) => {
			const partsA = a.version.split('.');
			const partsB = b.version.split('.');

			if (partsA[0] === partsB[0]) {
				if (partsA[1] === partsB[1]) {
					if (partsA[2] === partsB[2]) {
						return 0;
					} else {
						return Number.parseInt(partsB[2] ?? '0') - Number.parseInt(partsA[2] ?? '0');
					}
				} else {
					return Number.parseInt(partsB[1] ?? '0') - Number.parseInt(partsA[1] ?? '0');
				}
			} else {
				return Number.parseInt(partsB[0] ?? '0') - Number.parseInt(partsA[0] ?? '0');
			}
		});
	}
}