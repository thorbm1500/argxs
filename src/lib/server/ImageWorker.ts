import { RESOURCES } from '../../hooks.server.ts';
import type { Icon, ResourceIcon } from '$lib/components/interfaces';

function getPNGExtension(filename: string) {
	return filename.replace('.svg', '.png');
}

function getWEBPExtension(filename: string) {
	return filename.replace('.svg', '.webp');
}

function getJPEGExtension(filename: string) {
	return filename.replace('.svg', '.jpeg');
}

function integerScaling(width: number, height: number, target: number = 1000): { w: number, h: number } {
	if (width > 1000 && height > 1000) {
		if (width % 1 === 0 && height % 1 === 0) return { w: width, h: height };

		width = width / 4;
		height = height / 4;
	}

	let a: number = 1;
	let b: number = 1;

	if (width < height) {
		a = width / height;
	} else if (width > height) {
		b = height / width;
	}

	if (a !== b) {
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

	const diff: number = target - Math.min(width, height);
	return { w: width + (diff * a), h: height + (diff * b) };
}

async function imageExists(path: string) {
	return (await Bun.$`ls ${path}`.text()).length !== 0;
}

async function convertSVGtoPNG(icon: Icon, path: string) {
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

async function process(icon: Icon, path: string) {
	const IMAGE_PATH: string = `client/resources/data/icons/${path}/`;

	if (icon.name) console.info('  +',icon.name);

	if (!icon.path.endsWith('.svg')) {
		console.error('[ERROR] Failed. Not an SVG:', icon.path);
		return;
	}

	const PNG_PATH: string = IMAGE_PATH.concat('png/', getPNGExtension(icon.path));

	// Check if the PNG has already been generated.
	if (!(await imageExists(PNG_PATH))) {
		await convertSVGtoPNG(icon, path);

		// Check again to make sure the PNG was generated successfully.
		if (!(await imageExists(PNG_PATH))) {
			console.error('[ERROR] Failed to generate PNG for:', icon.path);
			return;
		} else {
			console.info('  → PNG Generated successfully for:', icon.path);
		}
	}

	icon.png = getPNGExtension(icon.path);

	const WEBP_PATH: string = IMAGE_PATH.concat('webp/', getWEBPExtension(icon.path));
	let isWEBPGenerated: boolean = await imageExists(WEBP_PATH);

	// Check if the WEBP has already been generated.
	if (!isWEBPGenerated) {
		try {
			await Bun.file(PNG_PATH).image().webp({ lossless: true }).write(WEBP_PATH);
		} catch (e) {
			console.error(e);
		}

		isWEBPGenerated = await imageExists(WEBP_PATH);

		// Check again to make sure the WEBP was generated successfully.
		if (!isWEBPGenerated) {
			console.error('[ERROR] Failed to generate WEBP for:', icon.path);
		} else {
			console.info('  → WEBP Generated successfully for:', icon.path);
		}
	}

	if (isWEBPGenerated) icon.webp = getWEBPExtension(icon.path);

	const JPEG_PATH: string = IMAGE_PATH.concat('jpeg/', getJPEGExtension(icon.path));
	let isJPEGGenerated: boolean = await imageExists(JPEG_PATH);

	// Check if the JPEG has already been generated.
	if (!isJPEGGenerated) {
		try {
			await Bun.file(PNG_PATH).image().jpeg({ quality: 80 }).write(JPEG_PATH);
		} catch (e) {
			console.error(e);
		}

		isJPEGGenerated = await imageExists(JPEG_PATH);

		// Check again to make sure the JPEG was generated successfully.
		if (!isJPEGGenerated) {
			console.error('[ERROR] Failed to generate JPEG for:', icon.path);
		} else {
			console.info('  → JPEG Generated successfully for:', icon.path);
		}
	}

	if(isJPEGGenerated) icon.jpeg = getJPEGExtension(icon.path);
}

async function processList(list: ResourceIcon[], path: string) {
	const startTime: number = Bun.nanoseconds();
	console.info(`Processing icons#${path}...`);

	for (const icon of list) {
		console.info('Current: ', icon.name);

		await process(icon.default, path);

		if (icon.dark) await process(icon.dark, path);

		for (const variableIcon of icon.variable) {
			await process(variableIcon, path);
		}
	}
	console.info(`Completed generation of icons#${path} [${((Bun.nanoseconds() - startTime) / 1000000000).toFixed(2)}s]`);
}

export default async function processImages() {
	Bun.$.nothrow();

	const startTime: number = Bun.nanoseconds();
	console.info('Image processing initiating...');

	await processList(RESOURCES.FLAG_ICONS, 'flags');
	await processList(RESOURCES.BRAND_ICONS, 'brands');

	console.info(`Image processing completed [${((Bun.nanoseconds() - startTime) / 1000000000).toFixed(2)}s]`);
}