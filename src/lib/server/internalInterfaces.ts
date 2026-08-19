import { RESOURCES } from '../../hooks.server.ts';

export function getDefaultSEODescription(): string {
	return "[Human-Made] Your #1 source of Web Development Resources! Offering more than +" + `${RESOURCES.TOTAL_ICON_AMOUNT_ROUNDED}` + " SVG brand logos & icons, country flags, and more. Always Free. Always Open Source.";
}

export function getDefaultSEOTitle(): string {
	return "argxs ▪ Web Development Resources";
}