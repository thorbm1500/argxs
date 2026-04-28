export interface Brand {
	name: string,
	href?: string,
	assets: VariableIcon[]
}

export interface Flag {
	country: string;
	flags: Icon[]
}

export interface VariableIcon {
	default: Icon;
	dark?: Icon;
	monochrome?: Icon;
	monochrome_white?: Icon;
	monochrome_black?: Icon;
	variable?: Icon;
}

export interface Icon {
	name?: string,
	svg: string,
	date_added?: string,
	source?: Source
}

declare interface Source {
	name: string;
	href: string;
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