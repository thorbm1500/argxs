export type PageTheme = 'light' | 'dark';

export interface SEO {
	title: string,
	description?: string
}

export interface Icon {
	/** The name of the icon */
	name: string,
	/** The path to the icon */
	path: string,
	/** An external site linked to the icon */
	href?: string,
	/** The date of which the icon was added or updated */
	date_added: string,
	/** The source of the icon */
	source?: Source
	/** A path to the icon's PNG version, otherwise undefined or no PNG version exists, or if it is yet to be processed. */
	png?: string,
	/** A path to the icon's WEBP version, otherwise undefined or no WEBP version exists, or if it is yet to be processed. */
	webp?: string
	/** A path to the icon's JPEG version, otherwise undefined or no JPEG version exists, or if it is yet to be processed. */
	jpeg?: string
}

export interface Source {
	/** The name of the source */
	name: string,
	/** An external link to the source */
	href: string
}

export interface HighlightIcon {
	icon: ResourceIcon,
	iconIndex: Icon[],
	currentIcon: number
}

export interface ResourceIcon {
	/** `Brand`: Brand name<br>
	 *  `Flag`: Country name */
	title: string,
	/** Name of the icon<br>
	 * `Note:` This may be equal to title */
	name: string,
	/** An external site linked to the icon */
	href?: string,
	/** The type of icon.<br>
	 * `Note:` This is to be set during loading, and not to be defined in the brand configurations */
	type: 'icon' | 'logo' | 'other',
	/** An epoch in milliseconds of the last time an icon of this collection was updated or added<br>
	 * `Note:` This is to be set during loading, and not to be defined in the brand configurations */
	last_updated: number,
	/** The default version of the icon. This will in most cases be the light themed version of the icon.<br>
	 * `Note:` In the case that the icon only has one version of either light or dark, it shall be defined here */
	default: Icon,
	/** The dark themed version of the icon */
	dark?: Icon,
	/** A list of extra icons, in some way related to this icon */
	variable: Icon[]
}

export interface Brand {
	name: string,
	href: string,
	assets: BrandIcon[]
}

export interface BrandIcon {
	/** The name of the icon */
	name: string,
	/** An external site linked to the icon */
	href: string,
	/** The icon's type. Mostly used for sorting the icons */
	type: 'icon' | 'logo' | 'other',
	/** An epoch in milliseconds of the last time an icon of this collection was updated or added<br>
	 * `Note:` This is to be set during loading, and not to be defined in the brand configurations */
	last_updated: number,
	/** The default version of the icon. This will in most cases be the light themed version of the icon.<br>
	 * `Note:` In the case that the icon only has one version of either light or dark, it shall be defined here */
	default: Icon,
	/** The dark themed version of the icon */
	dark?: Icon,
	/** A list of extra icons, in some way related to this icon */
	variable: Icon[]
}

export interface Flag {
	/** The name of the country or flag
	 * @todo Change from `country` to `name` */
	country: string,
	/** An external site linked to the icon */
	href: string,
	/** Flags linked to the country, such as the country's national flag, state flags, etc. */
	flags: Icon[]
}

export interface ColorCombos {
	combos: ColorCombo[];
}

export interface ColorCombo {
	/** The name of the color combo */
	name: string,
	/** The source of the color combo */
	source?: Source,
	first: {
		hex: string,
		rgb?: string
	},
	second: {
		hex: string,
		rgb?: string
	}
}

export interface ChangeLog {
	version: string,
	log: string
}