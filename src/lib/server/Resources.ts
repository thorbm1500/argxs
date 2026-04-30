import type { BrandIcon, BrandJson, ColorCombo, ColorCombos, Flag } from '$lib/components/interfaces';
import * as fs from 'node:fs/promises';

const root: string = process.cwd() + (process.cwd().endsWith('/') ? '' : '/') + (Bun.env.NODE_ENV === 'production' ? 'resources' : 'src/lib/resources');

export class Resources {
	readonly BRAND_ICONS: BrandIcon[] = [];
	readonly BRAND_ICONS_SORTED_NEW: BrandIcon[] = [];
	readonly BRAND_ICONS_SORTED_AtoZ: BrandIcon[] = [];
	BRAND_ICON_AMOUNT: number = 0;

	readonly FLAG_ICONS: Flag[] = [];
	FLAG_ICON_AMOUNT: number = 0;

	readonly COLOR_COMBOS: ColorCombo[] = [];
	COLOR_COMBO_AMOUNT: number = 0;

	async init(): Promise<void> {
		const startTime: number = Bun.nanoseconds();
		console.log('Initializing resources...');
		await this.loadBrandIcons();
		await this.loadFlagIcons();
		await this.loadColorCombos();
		console.log(`Resource loading completed [${((Bun.nanoseconds() - startTime) / 1000000).toFixed(0)}ms]`);
	}

	private async loadBrandIcons(): Promise<void> {
		console.info('Loading brand icons...');
		const path = root.concat('/icons/brands');
		const dir: string[] = await fs.readdir(path);

		for (const brand of dir) {
			const current: BrandJson = Bun.JSON5.parse(await Bun.file(path.concat('/', brand)).text()) as BrandJson;
			for (const icon of current.assets) {
				this.BRAND_ICONS.push({
					name: current.name,
					href: current.href,
					...icon
				});
			}
		}

		this.BRAND_ICONS_SORTED_NEW.push(...this.BRAND_ICONS.toSorted((a,b) => this.getLatestDateFromIcon(b) - this.getLatestDateFromIcon(a)));
		this.BRAND_ICONS_SORTED_AtoZ.push(...this.BRAND_ICONS.toSorted((a,b) => a.name.localeCompare(b.name)));

		let amount = 0;
		for (const icon of this.BRAND_ICONS) {
			if (icon.default) amount++;
			if (icon.dark) amount++;
			if (icon.monochrome) amount++;
			if (icon.monochrome_white) amount++;
			if (icon.monochrome_black) amount++;
			if (icon.variable) amount++;
		}

		this.BRAND_ICON_AMOUNT = amount;
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
		if (icon.monochrome_white?.date_added) {
			let current = Date.parse(icon.monochrome_white.date_added);
			if (current > result) result = current;
		}
		if (icon.monochrome_black?.date_added) {
			let current = Date.parse(icon.monochrome_black.date_added);
			if (current > result) result = current;
		}
		if (icon.variable?.date_added) {
			let current = Date.parse(icon.variable.date_added);
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
}