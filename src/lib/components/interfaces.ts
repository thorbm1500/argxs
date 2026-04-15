declare interface Source {
	name: string,
	href: string
}

export interface Brand {
	name: string,
	href?: string,
	assets: {
		icon?: BrandIcon,
		logo?: BrandIcon,
		extra: BrandIcon[]
	}
}

export interface BrandIcon {
	default: Icon,
	dark?: Icon,
	monochrome?: Icon,
	variable?: Icon
}

export interface Icon {
	svg: string,
	date_added?: string,
	source?: Source
}

export interface Flag {
	country: string,
	assets: {
		flag: Icon,
		extra: Icon[]
	}
}