declare interface Source {
	name: string,
	href: string
}

export interface Brand {
	info: BrandInfo,
	icons?: Icon[],
	logos?: Icon[]
}

export interface BrandInfo {
	name: string,
	href?: string,
	source?: Source
}

export interface Icon {
	regular: string,
	dark?: string
}

export interface Flag {
	country: string,
	icons: {
		default: string,
		square?: string,
		circular?: string,
		extras?: string[]
	},
	source?: Source
}