export interface Brand {
	info: BrandInfo,
	icons?: Icon[],
	logos?: Icon[]
}

export interface BrandInfo {
	name: string,
	href?: string,
	source?: {
		name: string,
		href: string
	}
}

export interface Icon {
	regular: string,
	dark?: string
}