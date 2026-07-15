import { RESOURCES } from '../../hooks.server.ts';
import type { Icon, ResourceIcon } from '$lib/components/interfaces';
import { formatNanoseconds } from '$lib/utilities';
import { readdir } from "node:fs/promises";

const IMAGE_RES_TARGET: number = 1000000;

function getPNGExtension(filename: string): string {
	return filename.replace('.svg', '.png');
}

function getWEBPExtension(filename: string) {
	return filename.replace('.svg', '.webp');
}

function getJPEGExtension(filename: string) {
	return filename.replace('.svg', '.jpeg');
}

function integerScaling(width: number, height: number): { w: number, h: number } {
	let a: number = 1;
	let b: number = 1;

	width = width / 4;
	height = height / 4;

	if (width !== height) {
		if (width < height) a = width / height;
		else if (width > height) b = height / width;

		if (a % .25 !== 0 || b % .25 !== 0) {
			a = Math.round(a * 3);
			b = Math.round(b * 3);
		}

		const multiplier: 2 | 3 = a % .25 === 0 || b % .25 === 0 ? 2 : 3;
		for (let i = 0; i < 20; i++) {
			if (a % 1 !== 0 || b % 1 !== 0) {
				a *= multiplier;
				b *= multiplier;
			} else break;
		}
	}

	let diff: number = Math.sqrt(IMAGE_RES_TARGET / (a * b));
	diff = diff % 1 === 0 ? diff : Math.trunc(diff) + 1;

	return { w: diff * a, h: diff * b };
}

async function convertSVGtoPNG(icon: Icon, path: string): Promise<void> {
	try {
		const size: string[] = (await Bun.$`inkscape/AppRun -W -H client/resources/icons/${path}/${icon.path}`.quiet().text()).split('\n');
		let width: number = Number.parseFloat(size[0] ?? 'nan');
		let height: number = Number.parseFloat(size[1] ?? 'nan');

		if (Number.isNaN(height) || Number.isNaN(width)) {
			console.error('Failed to parse width/height. Result:', size);
			return;
		}

		let dimensions = integerScaling(width, height);

		await Bun.$`inkscape/AppRun -w ${dimensions.w.toFixed()} -h ${dimensions.h.toFixed()} --export-png-compression=7 --export-type=png client/resources/icons/${path}/${icon.path} -o client/resources/data/icons/${path}/png/${getPNGExtension(icon.path)}`.quiet();
	} catch (err) {
		console.error(err);
	}
}

async function generateImage(icon: Icon, path: string): Promise<void> {
	const IMAGE_PATH: string = `client/resources/data/icons/${path}/`;

	if (icon.name) console.info('  +',icon.name);

	if (!icon.path.endsWith('.svg')) {
		console.error('[ERROR] Failed. Not an SVG:', icon.path);
		return;
	}

	const PNG_PATH: string = IMAGE_PATH.concat('png/', getPNGExtension(icon.path));

	// Check if the PNG has already been generated.
	if (!(await Bun.file(PNG_PATH).exists())) {
		await convertSVGtoPNG(icon, path);

		// Check again to make sure the PNG was generated successfully.
		if (!(await Bun.file(PNG_PATH).exists())) {
			console.error('[ERROR] Failed to generate PNG for:', icon.path);
			return;
		} else {
			console.info('  → PNG Generated successfully for:', icon.path);
		}
	}

	icon.png = getPNGExtension(icon.path);

	const WEBP_PATH: string = IMAGE_PATH.concat('webp/', getWEBPExtension(icon.path));
	let isWEBPGenerated: boolean = await Bun.file(WEBP_PATH).exists();

	// Check if the WEBP has already been generated.
	if (!isWEBPGenerated) {
		try {
			await Bun.file(PNG_PATH).image().webp({ lossless: true }).write(WEBP_PATH);
		} catch (e) {
			console.error(e);
		}

		isWEBPGenerated = await Bun.file(WEBP_PATH).exists();

		// Check again to make sure the WEBP was generated successfully.
		if (!isWEBPGenerated) {
			console.error('[ERROR] Failed to generate WEBP for:', icon.path);
		} else {
			console.info('  → WEBP Generated successfully for:', icon.path);
		}
	}

	if (isWEBPGenerated) icon.webp = getWEBPExtension(icon.path);

	const JPEG_PATH: string = IMAGE_PATH.concat('jpeg/', getJPEGExtension(icon.path));
	let isJPEGGenerated: boolean = await Bun.file(JPEG_PATH).exists();

	// Check if the JPEG has already been generated.
	if (!isJPEGGenerated) {
		try {
			await Bun.file(PNG_PATH).image().jpeg({ quality: 80 }).write(JPEG_PATH);
		} catch (e) {
			console.error(e);
		}

		isJPEGGenerated = await Bun.file(JPEG_PATH).exists();

		// Check again to make sure the JPEG was generated successfully.
		if (!isJPEGGenerated) {
			console.error('[ERROR] Failed to generate JPEG for:', icon.path);
		} else {
			console.info('  → JPEG Generated successfully for:', icon.path);
		}
	}

	if(isJPEGGenerated) icon.jpeg = getJPEGExtension(icon.path);
}

async function processGeneration(list: ResourceIcon[], path: string): Promise<void> {
	const startTime: number = Bun.nanoseconds();
	console.info(`Initiating image generation for icons#${path}...`);

	for (const icon of list) {
		console.info('Current: ', icon.name);

		await generateImage(icon.default, path);

		if (icon.dark) await generateImage(icon.dark, path);

		for (const variableIcon of icon.variable) {
			await generateImage(variableIcon, path);
		}
	}
	console.info(`Completed generation of icons#${path} [${formatNanoseconds(startTime, Bun.nanoseconds())}]`);
}

async function processCleanup(list: ResourceIcon[], path: string): Promise<void> {
	const startTime: number = Bun.nanoseconds();
	console.info(`Initiating image cleanup for icons#${path}...`);

	const DATA_IMAGE_PATH: string = `client/resources/data/icons/${path}`;
	const existingFiles: string[] = [];

	for (const icon of list) {
		existingFiles.push(icon.default.path);
		if (icon.dark) existingFiles.push(icon.dark.path);

		for (const v of icon.variable) {
			existingFiles.push(v.path);
		}
	}

	let i = 0;

	for (const file of await readdir(DATA_IMAGE_PATH.concat('/png'))) {
		const fileName: string = file.replace('.png','.svg');
		if (!existingFiles.includes(fileName)) {
			await Bun.file(DATA_IMAGE_PATH.concat('/png/',getPNGExtension(file))).delete();
			await Bun.file(DATA_IMAGE_PATH.concat('/webp/',getWEBPExtension(file))).delete();
			await Bun.file(DATA_IMAGE_PATH.concat('/jpeg/',getJPEGExtension(file))).delete();
			i++;
		}
	}

	console.info(`Completed cleanup of icons#${path}. ${i} stale images deleted [${formatNanoseconds(startTime, Bun.nanoseconds())}]`);
}

export default async function processImages(): Promise<void> {
	Bun.$.nothrow();

	const startTime: number = Bun.nanoseconds();
	console.info('Image processing initiating...');

	await processCleanup(RESOURCES.FLAG_ICONS, 'flags');
	await processCleanup(RESOURCES.BRAND_ICONS, 'brands');

	await processGeneration(RESOURCES.FLAG_ICONS, 'flags');
	await processGeneration(RESOURCES.BRAND_ICONS, 'brands');

	console.info(`Image processing completed [${formatNanoseconds(startTime, Bun.nanoseconds())}]`);
}