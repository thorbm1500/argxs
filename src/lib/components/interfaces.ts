export type PageTheme = 'light' | 'dark';

export interface SEO {
	title: string,
	description?: string
}

export type IconType = 'icon' | 'logo' | 'country' | 'state';

export interface Icon {
	/** The name of the icon */
	name: string,
	/** An external site linked to the icon */
	href?: string,
	/** The theme of the icon, if the icon has one. This is specifically for icons that are hard to see in other themes than what they have been made for, such as all white or all black icons<br>
	 * `Note:` This should be left undefined, if the icon is visible in all themes */
	theme?: string | PageTheme,
	/** Whether the icon is animated or not<br>
	 * `Default:` False<br>
	 * `Note:` This should be left undefined, if the icon is not animated, as it will default to false during initiation */
	animated: boolean,
	/** The path to the icon */
	path: string,
	type?: IconType,
	tags: string[],
	/** The date of which the icon was added or updated */
	date_added: string,
	/** The date of which the icon was last modified. This value is equal to 'date_added' if no value has been set. */
	last_modified: string,
	/** The version of which the icon was added or updated */
	version: string,
	/** Whether the icon was added this version, and thus should be marked as "NEW" */
	isNew: boolean,
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
	type: IconType | 'undefined',
	/** An epoch in milliseconds of the last time an icon of this collection was updated or added<br>
	 * `Note:` This is to be set during loading, and not to be defined in the brand configurations */
	last_updated: number,
	/** The newest found version tag of all icons of the collection<br>
	 * `Note:` This is to be set during loading, and not to be defined in the brand configurations */
	latest_version?: string,
	/** Used for marking icons with "NEW" tag, if an icon in the collection was added in the current version<br>
	 * `Note:` This is to be set during loading, and not to be defined in the brand configurations */
	hasNewVariant: boolean,
	tags: string[],
	/** The default version of the icon. This will in most cases be the light themed version of the icon.<br>
	 * `Note:` In the case that the icon only has one version of either light or dark, it shall be defined here */
	default: Icon,
	/** The dark themed version of the icon */
	dark?: Icon,
	/** A list of extra icons, in some way related to this icon */
	variable: Icon[],
	config: Brand | Flag
}

declare interface IconConfig {
	/** The name of the icon */
	name: string,
	/** An external site linked to the icon */
	href?: string,
	/** The icon's type. Mostly used for sorting the icons */
	type?: 'icon' | 'logo' | 'country' | 'state',
	tags: string[],
	/** An epoch in milliseconds of the last time an icon of this collection was updated or added<br>
	 * `Note:` This is to be set during loading, and not to be defined in the brand configurations */
	last_updated: number,
	/** The default version of the icon. This will in most cases be the light themed version of the icon.<br>
	 * `Note:` In the case that the icon only has one version of either light or dark, it shall be defined here */
	default: Icon,
	/** A list of extra icons, in some way related to this icon */
	variable: Icon[]
}

export interface BrandColor {
	hex: string,
	rgb: string,
	cmyk?: string,
	pantone?: string
}

export interface Brand {
	name: string,
	href?: string,
	tags: string[],
	assets: BrandIcon[],
	colors?: {
		primary?: BrandColor[],
		accent?: BrandColor[],
		colors?: BrandColor[]
	}
}

export interface BrandIcon extends IconConfig {
	/** The dark themed version of the icon */
	dark?: Icon,
}

export interface Flag {
	/** The name of the country or flag */
	name: string,
	/** An external site linked to the icon */
	href?: string,
	/** The icon's type. Mostly used for sorting the icons */
	type: 'country' | 'state' | 'undefined',
	tags: string[],
	/** Flags linked to the country, such as the country's national flag, state flags, etc. */
	flags: FlagIcon[]
	/** Note: Not to be used. Simply suppresses IDE errors */
	colors?: {
		primary?: BrandColor[],
		accent?: BrandColor[],
		colors?: BrandColor[]
	}
}

export interface FlagIcon extends IconConfig {}

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