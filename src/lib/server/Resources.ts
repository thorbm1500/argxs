import type { Brand, ChangeLog, ColorCombo, ColorCombos, Flag, ResourceIcon } from '$lib/components/interfaces';
import * as fs from 'node:fs/promises';
import { compareVersionTags } from '$lib/utilities';
import { VERSION } from '../../hooks.server.ts';

const root: string = process.cwd() + (process.cwd().endsWith('/') ? '' : '/') + (Bun.env.NODE_ENV === 'production' ? 'resources' : 'src/lib/resources');

export class Resources {
	readonly BRAND_ICONS: ResourceIcon[] = [];
	readonly BRAND_ICONS_SORTED_NEW: ResourceIcon[] = [];
	readonly BRAND_ICONS_SORTED_AtoZ: ResourceIcon[] = [];
	BRAND_ICON_AMOUNT: number = 0;
	BRAND_LOGO_AMOUNT: number = 0;
	BRAND_TOTAL_AMOUNT: number = 0;
	BRAND_AMOUNT: number = 0;

	readonly FLAG_ICONS: ResourceIcon[] = [];
	readonly FLAG_ICONS_SORTED_NEW: ResourceIcon[] = [];
	readonly FLAG_ICONS_SORTED_AtoZ: ResourceIcon[] = [];

	FLAG_ICON_AMOUNT: number = 0;
	FLAG_TOTAL_AMOUNT: number = 0;

	readonly COLOR_COMBOS: ColorCombo[] = [];
	COLOR_COMBO_AMOUNT: number = 0;

	readonly CHANGELOGS: ChangeLog[] = [];

	async init(): Promise<void> {
		const startTime: number = Bun.nanoseconds();
		console.info('Initializing resources...');
		await this.loadBrandIcons();
		await this.loadFlagIcons();
		await this.loadColorCombos();
		await this.loadChangeLogs();
		console.info(`Resource loading completed [${((Bun.nanoseconds() - startTime) / 1000000).toFixed(0)}ms]`);
	}

	private async loadBrandIcons(): Promise<void> {
		console.info('Loading brand icons...');
		const path: string = root.concat('/icons/brands');

		for (const brand of await fs.readdir(path)) {
			const current: Brand = Bun.JSON5.parse(await Bun.file(path.concat('/', brand)).text()) as Brand;
			this.BRAND_AMOUNT++;

			for (const icon of current.assets) {
				const resource = {
					title: current.name,
					name: icon.name ?? current.name,
					href: current.href,
					type: icon.type,
					last_updated: 0,
					hasNewVariant: false,
					tags: [], //TODO: Implement tags
					default: icon.default,
					variable: icon.variable !== undefined ? icon.variable : []
				} as ResourceIcon;

				this.updateLatestDate(resource);

				let iconAmount = 1;

				if (icon.default.animated === undefined) icon.default.animated = false;
				icon.default.isNew = icon.default.version === VERSION;

				if (icon.dark) {
					if (icon.dark.animated === undefined) icon.dark.animated = false;
					icon.dark.isNew = icon.dark.version === VERSION;
					resource.dark = icon.dark;
					iconAmount++;
				}

				iconAmount += resource.variable.length;

				for (const icon of resource.variable) {
					if (icon.animated === undefined) icon.animated = false;
					icon.isNew = icon.version === VERSION;
				}

				if (resource.type === 'icon') this.BRAND_ICON_AMOUNT += iconAmount;
				else if (resource.type === 'logo') this.BRAND_LOGO_AMOUNT += iconAmount;
				this.BRAND_TOTAL_AMOUNT += iconAmount;

				this.BRAND_ICONS.push(resource);
			}
		}

		this.BRAND_ICONS_SORTED_NEW.push(...this.BRAND_ICONS.toSorted((a, b) => compareVersionTags(a.latest_version, b.latest_version)));
		this.BRAND_ICONS_SORTED_AtoZ.push(...this.BRAND_ICONS.toSorted((a, b) => a.name.localeCompare(b.name)));
	}

	private async loadFlagIcons(): Promise<void> {
		console.info('Loading flag icons...');
		const path: string = root.concat('/icons/flags');
		const dir: string[] = await fs.readdir(path);

		for (const flag of dir) {
			const current = Bun.JSON5.parse(await Bun.file(path.concat('/', flag)).text()) as Flag;

			for (const icon of current.flags) {
				const resource: ResourceIcon = {
					title: current.country,
					name: icon.name ?? current.country,
					href: icon.href ?? current.href,
					type: icon.type ? icon.type : (current.type ? current.type : 'undefined'),
					last_updated: 0,
					hasNewVariant: false,
					tags: current.tags !== undefined ? current.tags : [],
					default: icon.default,
					variable: icon.variable !== undefined ? icon.variable : []
				} as ResourceIcon;

				this.updateLatestDate(resource);

				if (resource.default.animated === undefined) resource.default.animated = false;
				resource.default.isNew = resource.default.version === VERSION;

				for (const flag of resource.variable) {
					if (flag.animated === undefined) flag.animated = false;
					flag.isNew = flag.version === VERSION;
				}

				this.FLAG_ICON_AMOUNT += resource.variable.length + 1;
				this.FLAG_ICONS.push(resource);
			}
		}

		this.FLAG_TOTAL_AMOUNT = this.FLAG_ICONS.length;

		this.FLAG_ICONS_SORTED_NEW.push(...this.FLAG_ICONS.toSorted((a, b) => b.last_updated - a.last_updated));
		this.FLAG_ICONS_SORTED_AtoZ.push(...this.FLAG_ICONS.toSorted((a, b) => a.name.localeCompare(b.name)));
	}

	private updateLatestDate(icon: ResourceIcon): void {
		if (compareVersionTags(icon.latest_version, icon.default.version)) icon.latest_version = icon.default.version;
		if (compareVersionTags(icon.latest_version, icon.dark?.version)) icon.latest_version = icon.dark?.version;
		if (icon.variable !== undefined) {
			for (const variable of icon.variable) {
				if (compareVersionTags(icon.latest_version, variable.version)) icon.latest_version = variable.version;
			}
		}

		if (icon.latest_version === VERSION) icon.hasNewVariant = true;

		if (icon.default.date_added) {
			const current = Date.parse(icon.default.date_added);
			if (current > icon.last_updated) icon.last_updated = current;
		}
		if (icon.dark?.date_added) {
			const current = Date.parse(icon.dark.date_added);
			if (current > icon.last_updated) icon.last_updated = current;
		}
		if (icon.variable !== undefined) {
			for (const variable of icon.variable) {
				if (!variable.date_added) continue;
				const current = Date.parse(variable.date_added);
				if (current > icon.last_updated) icon.last_updated = current;
			}
		}
	}

	private async loadColorCombos(): Promise<void> {
		console.info('Loading color combos...');
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