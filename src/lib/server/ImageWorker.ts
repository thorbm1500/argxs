import { RESOURCES } from '../../hooks.server.ts';
import type { Icon, ResourceIcon } from '$lib/components/interfaces';
import { formatNanoseconds } from '$lib/utilities';
import { readdir } from "node:fs/promises";

declare interface SizeAttributes {
	w: number,
	h: number
}

function getExtension(filename: string, extension: string): string {
	return filename.replace('.svg', extension);
}

async function getSizeAttributes(path: string): Promise<SizeAttributes> {
	const raw: string = await Bun.file(path).text();
	const data: string = raw.slice(0, raw.indexOf('>') + 1);
	const index: number = data.indexOf('viewBox') + 9;

	const viewBox: number[] = data.slice(index, data.indexOf('"', index))
		.split(' ')
		.map(v => Number.parseFloat(v));

	return { w: viewBox[2] ?? Number.NaN, h: viewBox[3] ?? Number.NaN };
}

function integerScaling(attr: SizeAttributes): SizeAttributes {
	let a: number = attr.w, b: number = attr.h;

	for (let i = 100; i > 0; i--) {
		if (!Number.isInteger(a / i) || !Number.isInteger(b / i)) continue;

		a /= i; b /= i;
		break;
	}

	if (a == attr.w || b == attr.h) {
		a /= 100; b /= 100;
	}

	if (a < 1.0 || b < 1.0) {
		a *= 10; b *= 10;
	}

	if (!Number.isInteger(a) || !Number.isInteger(b)) {
		a = Math.round(a) * 10; b = Math.round(b) * 10;
	}

	let i = 0;
	while(Number.isInteger(a / 2) && Number.isInteger(b / 2)) {
		a /= 2;
		b /= 2;
		if (i++ > 100) throw new Error(`ImageWorker#integerScaling: Stuck in endless division loop!`);
	}

	i = 0;
	attr.w = a; attr.h = b;
	while (attr.w * attr.h < 1000000) {
		attr.w += a;
		attr.h += b;
		if (i++ > 100) throw new Error(`ImageWorker#integerScaling: Stuck in endless multiplication loop!`);
	}

	return attr;
}

async function convertSVGtoPNG(icon: Icon, path: string): Promise<boolean> {
	try {
		const sizeAttributes: SizeAttributes = await getSizeAttributes(`client/resources/icons/${path}/${icon.path}`);
		console.info(`Raw dimensions: { w: ${sizeAttributes.w}, h: ${sizeAttributes.h} }`);

		if (Number.isNaN(sizeAttributes.w) || !Number.isFinite(sizeAttributes.w)
		|| Number.isNaN(sizeAttributes.h) || !Number.isFinite(sizeAttributes.h)) {
			// noinspection ExceptionCaughtLocallyJS
			console.error(`Failed to parse width/height. Results: { w: ${sizeAttributes.w}, h: ${sizeAttributes.h} }`);
		} else {
			const dimensions: SizeAttributes = integerScaling(sizeAttributes);
			console.info(`Generating PNG with dimensions: { w: ${dimensions.w}, h: ${dimensions.h} }`);

			await Bun.$`inkscape/AppRun -w ${dimensions.w.toFixed()} -h ${dimensions.h.toFixed()} --export-png-compression=7 --export-type=png client/resources/icons/${path}/${icon.path} -o client/resources/data/icons/${path}/png/${getExtension(icon.path, '.png')}`.quiet();
			return true;
		}
	} catch (err) {
		console.error(err);
	}

	return false;
}

async function generateImage(icon: Icon, path: string): Promise<void> {
	const IMAGE_PATH: string = `client/resources/data/icons/${path}/`;

	if (icon.name) console.info('  +',icon.name);

	if (!icon.path.endsWith('.svg')) {
		console.error('[ERROR] Failed. Not an SVG:', icon.path);
		return;
	}

	const PNG_FILENAME: string = getExtension(icon.path, '.png');
	const PNG_PATH: string = IMAGE_PATH.concat('png/', PNG_FILENAME);

	icon.png = PNG_FILENAME;

	if (!(await Bun.file(PNG_PATH).exists())) {
		console.log('  Generating PNG...');
		if (await convertSVGtoPNG(icon, path)) console.info(`  → PNG Generated successfully for: ${icon.path}`);
		else {
			console.error(`[ERROR] Failed to generate PNG for: ${icon.path}`);
			icon.png = undefined;
			return;
		}
	}

	icon.webp = getExtension(icon.path, '.webp');
	const WEBP_PATH: string = IMAGE_PATH.concat('webp/', icon.webp);

	if (!(await Bun.file(WEBP_PATH).exists())) {
		try {
			await Bun.file(PNG_PATH).image().webp({ lossless: true }).write(WEBP_PATH);

			if (await Bun.file(WEBP_PATH).exists()) console.info(`  → WEBP Generated successfully for: ${icon.path}`);
			else {
				// noinspection ExceptionCaughtLocallyJS
				throw new Error(`[ERROR] Failed to generate WEBP for: ${icon.path}`);
			}
		} catch (e) {
			console.error(e);
			icon.webp = undefined;
		}
	}

	icon.jpeg = getExtension(icon.path, '.jpeg');
	const JPEG_PATH: string = IMAGE_PATH.concat('jpeg/', icon.jpeg);

	if (!(await Bun.file(JPEG_PATH).exists())) {
		try {
			await Bun.file(PNG_PATH).image().jpeg({ quality: 80 }).write(JPEG_PATH);

			if (await Bun.file(JPEG_PATH).exists()) console.info(`  → JPEG Generated successfully for: ${icon.path}`);
			else {
				// noinspection ExceptionCaughtLocallyJS
				throw new Error(`[ERROR] Failed to generate JPEG for: ${icon.path}`);
			}
		} catch (e) {
			console.error(e);
			icon.jpeg = undefined;
		}
	}
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
			try {
				await Bun.file(DATA_IMAGE_PATH.concat('/png/',getExtension(file, '.png'))).delete();
			}
			catch (e) {
				console.error(e);
			}
			try {
				await Bun.file(DATA_IMAGE_PATH.concat('/webp/',getExtension(file, '.webp'))).delete();
			} catch (e) {
				console.error(e);
			}
			try {
				await Bun.file(DATA_IMAGE_PATH.concat('/jpeg/',getExtension(file, '.jpeg'))).delete();
			} catch (e) {
				console.error(e);
			}
			i++;
		}
	}

	console.info(`Completed cleanup of icons#${path}. ${i} stale images deleted [${formatNanoseconds(startTime, Bun.nanoseconds())}]`);
}

export default async function processImages(): Promise<void> {
	//Bun.$.nothrow();

	const startTime: number = Bun.nanoseconds();
	console.info('Image processing initiating...');

	await processCleanup(RESOURCES.FLAG_ICONS, 'flags');
	await processCleanup(RESOURCES.BRAND_ICONS, 'brands');

	await processGeneration(RESOURCES.FLAG_ICONS, 'flags');
	await processGeneration(RESOURCES.BRAND_ICONS, 'brands');

	console.info(`Image processing completed [${formatNanoseconds(startTime, Bun.nanoseconds())}]`);
}