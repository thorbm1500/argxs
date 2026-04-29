import type { Brand, ColorCombo, ColorCombos, Flag } from '$lib/components/interfaces';
import * as fs from 'node:fs/promises';

const root: string = process.cwd() + (process.cwd().endsWith('/') ? '' : '/') + (Bun.env.NODE_ENV === 'production' ? 'resources' : 'src/lib/resources');

export class Resources {
	readonly BRAND_ICONS: Brand[] = [];
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
			this.BRAND_ICONS.push(Bun.JSON5.parse(await Bun.file(path.concat('/', brand)).text()) as Brand);
		}

		let amount = 0;
		for (const brand of this.BRAND_ICONS) {
			if (!brand.assets || brand.assets.length === 0) continue;

			for (const icon of brand.assets) {
				if (icon.default) amount++;
				if (icon.dark) amount++;
				if (icon.monochrome) amount++;
				if (icon.monochrome_white) amount++;
				if (icon.monochrome_black) amount++;
				if (icon.variable) amount++;
			}
		}

		this.BRAND_ICON_AMOUNT = amount;
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