export interface Brand extends BrandConfiguration {
	icon?: VariableIcon;
	logo?: VariableIcon;
	extra: VariableIcon[];
}

export interface BrandConfiguration {
	name: string;
	href?: string;
}

export interface Flag extends FlagConfiguration {
	flag: Icon;
	extra: Icon[];
}

export interface FlagConfiguration {
	country: string;
	href?: string;
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
	svg: string;
	name?: string;
	date_added?: string;
	source?: Source;
}

declare interface Source {
	name: string;
	href: string;
}