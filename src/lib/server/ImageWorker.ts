import { RESOURCES } from '../../hooks.server.ts';
import type { Icon, ResourceIcon } from '$lib/components/interfaces';
import * as fs from 'fs/promises';

function getPNGExtension(filename: string) {
	return filename.replace('.svg','.png')
}

function getWEBPExtension(filename: string) {
	return filename.replace('.svg','.webp')
}

function getJPEGExtension(filename: string) {
	return filename.replace('.svg','.jpeg')
}

function integerScaling(width: number, height: number, target: number = 1000): { w:number, h: number } {
	if (width > 1000 && height > 1000) {
		if (width % 1 === 0 && height % 1 === 0) return { w: width, h: height };

		width /= 2;
		height /= 2;
	}

	let a: number = height > width ? 1 : width / height;
	let b: number = height < width ? 1 : height / width;

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

	const diff: number = target - Math.min(width,height);
	return { w: width + (diff * a), h: height + (diff * b) };
}

async function convertSVGtoPNG(icon: Icon, path: string) {
	const pngPath: string = `resources/data/icons/${path}/png/` + getPNGExtension(icon.path);

	if (await Bun.file(pngPath).exists()) {
		icon.png = icon.path.replace('.svg','.png');
		return;
	}

	try {
		const size = (await Bun.$`inkscape/AppRun -W -H client/resources/icons/${path}/${icon.path}`.text()).split('\n');
		let width = Number.parseFloat(size[0] ?? 'nan');
		let height = Number.parseFloat(size[1] ?? 'nan');

		if (Number.isNaN(height) || Number.isNaN(width)) {
			console.error('Failed to parse width/height. Result:',size);
			return;
		}

		let dimensions = integerScaling(width,height);

		await Bun.$`inkscape/AppRun -w ${dimensions.w} -h ${dimensions.h} --export-background=none --export-png-compression=7 --export-type=png client/resources/icons/${path}/${icon.path} -o client/${pngPath}`;

		icon.png = getPNGExtension(icon.path);

		//await Bun.file("static/dk.png").image().resize(width / 2, height / 2, { fit: "inside" }).webp({ quality: 80 }).write("static/dk.webp");
	} catch (err) {
		console.error(err)
	}
}

async function generateResourceIconPNG(icon: Icon, path: string)  {
	if (!icon.path.endsWith('.svg') || icon.png) return;
		console.info(`Processing image: '${icon.path}'`);
	if (!icon.png) {
		console.info('Generating PNG...');
		await convertSVGtoPNG(icon, path);
	}
}

let generatedPNGs: string[] = [];

async function processPNGs(icon: ResourceIcon, path: string) {
	// Check if the PNG has already been generated.
	if (!generatedPNGs.includes(getPNGExtension(icon.default.path))) {
		await generateResourceIconPNG(icon.default, path);
	}

	// Check if a dark icon exists, and if its PNG has already been generated.
	if (icon.dark && !generatedPNGs.includes(getPNGExtension(icon.dark.path))) {
		await generateResourceIconPNG(icon.dark, path)
	}

	for (const variableIcon of icon.variable) {
		// Check if the PNG has already been generated.
		if (!generatedPNGs.includes(getPNGExtension(variableIcon.path))) {
			await generateResourceIconPNG(variableIcon, path);
		}
	}
}

async function processList(list: ResourceIcon[], path: string) {
	const startTime: number = Bun.nanoseconds();
	console.info(`Processing icons#${path}...`);

	generatedPNGs = await fs.readdir(`resources/data/icons/${path}/png/`);

	for (const icon of list) {
		console.info('Current: ', icon.name);
		await processPNGs(icon, path);
	}

	console.info(`Completed generation of icons#${path} [${((Bun.nanoseconds() - startTime) / 1000000000).toFixed(2)}]`);
}

export default async function processImages() {
	const startTime: number = Bun.nanoseconds();
	console.info('Image processing initiating...');

	await processList(RESOURCES.FLAG_ICONS, 'flags');
	await processList(RESOURCES.BRAND_ICONS, 'brands');

	console.info(`Image processing completed [${((Bun.nanoseconds() - startTime) / 1000000000).toFixed(2)}s]`);
}