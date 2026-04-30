export interface Icon {
	name?: string,
	svg: string,
	href?: string,
	date_added?: string,
	source?: Source
}

declare interface Source {
	name: string;
	href: string;
}

export interface BrandJson {
	name: string,
	href?: string,
	assets: VariableIcon[]
}

export interface BrandIcon extends VariableIcon {
	name: string,
	href?: string
}

export interface VariableIcon {
	default: Icon,
	dark?: Icon,
	monochrome?: Icon,
	monochrome_white?: Icon,
	monochrome_black?: Icon,
	variable?: Icon
}

export interface Flag {
	country: string,
	flags: Icon[]
}

export interface ColorCombos {
	combos: ColorCombo[];
}

export interface ColorCombo {
	name: string,
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