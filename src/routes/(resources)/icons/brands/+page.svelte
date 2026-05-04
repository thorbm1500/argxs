<!--svelte-ignore state_referenced_locally-->
<script lang="ts">
	import type { BrandIcon, PageTheme } from '$lib/components/interfaces';
	import { getContext } from 'svelte';
	import BrandIconComponent from '$lib/components/BrandIconComponent.svelte';
	import { innerWidth } from 'svelte/reactivity/window';
	import { draw, fade } from 'svelte/transition';
	import { quartInOut } from 'svelte/easing';
	
	const { data } = $props();
	
	const getTheme = getContext('theme') as Function;
	let theme: PageTheme = $derived(getTheme());
	
	let iconsOnly: boolean = $state.raw(false);
	let logosOnly: boolean = $state.raw(false);
	let sorting: 'default' | 'time' | 'alphabet' = $state.raw('default');
	let order: 'desc' | 'asc' = $state.raw('desc');
	
	let brandIcons: BrandIcon[] = $derived.by(() => {
		let current = data.icons;
		
		switch ($state.eager(sorting)) {
			case 'time': {
				if (order === 'asc') current = data.iconsSortedNew.toReversed();
				else current = data.iconsSortedNew;
				break;
			}
			case 'alphabet': {
				if (order === 'asc') current = data.iconsSortedAtoZ.toReversed();
				else current = data.iconsSortedAtoZ;
				break;
			}
			default: {
				current = data.icons;
			}
		}
		
		if (iconsOnly) return current.filter(icon => icon.type === 'icon');
		else if (logosOnly) return current.filter(icon => icon.type === 'logo');
		else return current;
	});
	
	let pagMax = $derived(brandIcons.length);
	let currentPage = $state(1);
	
	let pagOffset: 24 | 48 | 96 = $state(48);
	let pagStart = $derived(Math.max(0, (currentPage - 1) * pagOffset));
	let pagEnd = $derived(Math.min(pagMax, currentPage * pagOffset));
	
	let maxPage = $derived(Math.ceil(pagMax / pagOffset));
	
	let currentIcons = $derived(brandIcons.slice(pagStart, pagEnd));
	
	let columnAmount: number = $derived.by(() => {
		let result = Math.trunc((innerWidth.current ?? 1920) / 140);
		
		while (true) {
			if (((pagOffset / result) % 2) !== 0) result--;
			else break;
		}
		
		return result;
	});
	let gridHeight = $derived(((pagOffset / columnAmount) * 7.5) + 1);
</script>

<section class="content-header">
	<div class="text">
		<h1 class="title">
			Brand Icons
		</h1>
		<div class="subtitle">
			<p>
				argxs currently showcases a total of <strong style="color: color-mix(var(--theme-color-accent) 80%, var(--theme-ui-white) 20%);">{data.totalAmount}</strong> different brand icons &
				logos, consisting of <strong style="color: color-mix(var(--theme-color-accent) 80%, var(--theme-ui-white) 20%);">{data.iconAmount}</strong> icons, and <strong style="color:
				color-mix(var(--theme-color-accent) 80%, var(--theme-ui-white) 20%);">{data.logoAmount}</strong> logos.
			</p>
		</div>
	</div>
	<div class="actions">
		<div class="sorting">
			{#if sorting !== 'default'}
				<button transition:fade={{duration: 325, easing: quartInOut}} title="Clear Sort Filter" class="sort-action" onclick="{() => sorting = 'default'}">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path transition:draw|global={{duration: 1100, easing: quartInOut}}
						      d="M12 16l3.644 3.644a1.21 1.21 0 0 0 1.712 0l2.288 -2.288a1.21 1.21 0 0 0 0 -1.712l-3.644 -3.644l3.644 -3.644a1.21 1.21 0 0 0 0 -1.712l-2.288 -2.288a1.21 1.21 0 0 0 -1.712 0l-3.644 3.644l-3.644 -3.644a1.21 1.21 0 0 0 -1.712 0l-2.288 2.288a1.21 1.21 0 0 0 0 1.712l3.644 3.644l-3.644 3.644a1.21 1.21 0 0 0 0 1.712l2.288 2.288a1.21 1.21 0 0 0 1.712 0m3.644 -3.644" />
					</svg>
				</button>
			{/if}
			<button class="sort-action" onclick="{() =>  {
						if (sorting !== 'alphabet') {
							sorting = 'alphabet';
							order = 'desc';
						} else {
							order = order === 'desc' ? 'asc' : 'desc';
						}
					}}">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					{#if sorting === 'alphabet'}
						{#if order === 'asc'}
							<path in:draw|global={{duration: 350}} d="M15 10v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4" />
							<path in:draw|global={{duration: 350}} d="M19 21h-4l4 -7h-4" />
						{:else}
							<path in:draw|global={{duration: 350}} d="M15 21v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4" />
							<path in:draw|global={{duration: 350}} d="M19 10h-4l4 -7h-4" />
						{/if}
						<path d="M4 15l3 3l3 -3" />
						<path d="M7 6v12" />
					{:else}
						<path in:draw|global={{duration: 350}} d="M16 8h4l-4 8h4" />
						<path in:draw|global={{duration: 350}} d="M4 16v-6a2 2 0 1 1 4 0v6" />
						<path d="M4 13h4" />
						<path d="M11 12h2" />
					{/if}
				</svg>
				Name
			</button>
			<button class="sort-action" onclick="{() =>  {
						if (sorting !== 'time') {
							sorting = 'time';
							order = 'desc';
						} else {
							order = order === 'desc' ? 'asc' : 'desc';
						}
					}}">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					{#if sorting === 'time'}
						<path d="M20.984 12.535a9 9 0 1 0 -8.431 8.448" />
						<path d="M12 7v5l2.5 2.5" />
						<path d="M19 22v-6" />
						{#if order === 'asc'}
							<path in:draw|global={{duration: 350}} d="M22 19l-3 -3l-3 3" />
						{:else}
							<path in:draw|global={{duration: 350}} d="M22 19l-3 3l-3 -3" />
						{/if}
					{:else}
						<path d="M20.943 13.016a9 9 0 1 0 -8.915 7.984" />
						<path d="M16 22l5 -5" />
						<path d="M21 21.5v-4.5h-4.5" />
						<path d="M12 7v5l2 2" />
					{/if}
				</svg>
				Date Added
			</button>
		</div>
		<div class="filter">
			<button class="sort-action icons-only {!iconsOnly && !logosOnly ? 'active' : 'inactive'}" onclick="{() => {
			currentPage = 1;
			iconsOnly = false;
			logosOnly = false;
		}}">
				All
			</button>
			<button class="sort-action icons-only {iconsOnly ? 'active' : 'inactive'}" onclick="{() => {
			currentPage = 1;
			iconsOnly = !iconsOnly;
			if (iconsOnly) logosOnly = false;
		}}">
				Icons Only
			</button>
			<button class="sort-action logos-only {logosOnly ? 'active' : 'inactive'}" onclick="{() => {
			currentPage = 1;
			logosOnly = !logosOnly;
			if (logosOnly) iconsOnly = false;
		}}">
				Logos Only
			</button>
		</div>
	</div>
</section>

<section class="brand-icons-sec" style="height: calc(((var(--current-width) - 12rem) / var(--column-amount)) - 7rem + {gridHeight}rem)">
	<div class="icons" style:--current-width={(innerWidth.current ?? 1920) + 'px'} style:--column-amount={columnAmount}
	     style="row-gap:calc(((var(--current-width) - 12rem) / var(--column-amount)) - 7rem);grid-template-columns: repeat(var(--column-amount), 7rem);">
		{#each currentIcons as icon}
			{#key icon}
				<BrandIconComponent bind:theme icon={icon} />
			{/key}
		{/each}
	</div>
</section>

<div class="pagination-actions">
	<button title="First Page" class="action {currentPage > 3 ? 'shown' : 'hidden'}" onclick="{() => currentPage = 1}">
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round">
			<path d="M5 12h6m3 0h1.5m3 0h.5" />
			<path d="M5 12l4 4" />
			<path d="M5 12l4 -4" />
		</svg>
	</button>
	<button class="action {currentPage > 2 ? 'shown' : 'hidden'}" onclick="{() => currentPage -= 2}">{currentPage - 2}</button>
	<button class="action {currentPage > 1 ? 'shown' : 'hidden'}" onclick="{() => currentPage--}">{currentPage - 1}</button>
	<p class="action current-page">{currentPage}</p>
	<button class="action {(currentPage) < maxPage ? 'shown' : 'hidden'}" onclick="{() => currentPage++}">{currentPage + 1}</button>
	<button class="action {(currentPage + 1) < maxPage ? 'shown' : 'hidden'}" onclick="{() => currentPage += 2}">{currentPage + 2}</button>
	<button title="Last Page" class="action {(currentPage + 2) < maxPage ? 'shown' : 'hidden'}" onclick="{() => currentPage = maxPage}">
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round">
			<path d="M5 12h.5m3 0h1.5m3 0h6" />
			<path d="M15 16l4 -4" />
			<path d="M15 8l4 4" />
		</svg>
	</button>
	<button class="sort-action row-amount" onclick="{() => {
			currentPage = 1;
			switch (pagOffset) {
				case 24: {
					pagOffset = 48;
					break;
				}
				case 48: {
					pagOffset = 96;
					break;
				}
				case 96: {
					pagOffset = 24;
					break;
				}
			}
		}}">
		Items: {pagOffset}
	</button>
</div>

<!--suppress CssUnusedSymbol -->
<style>
	/* Desktop & Tablet */
	@media (width >= 44rem) {
		.content-header {
			.text {
				.title {
					font-size: 3rem;
				}
				
				.subtitle {
					font-size: 0.95rem;
				}
			}
		}
	}
	
	/* Phone */
	@media (width < 44rem) {
		.content-header {
			.text {
				.title {
					font-size: 2rem;
				}
				
				.subtitle {
					font-size: 0.8rem;
				}
			}
		}
	}
	
	:global(.main-container) {
		padding: 3rem 6rem 0 6rem !important;
	}
	
	.brand-icons-sec {
		.icons {
			display:         grid;
			justify-content: space-between;
		}
	}
	
	.pagination-actions {
		position:        relative;
		
		display:         flex;
		flex-flow:       row nowrap;
		align-items:     center;
		justify-content: center;
		gap:             .5rem;
		
		margin-top:      1.75rem;
		width:           100%;
		
		user-select:     none !important;
		
		button.action {
			cursor: pointer;
		}
		
		.action {
			display:          flex;
			align-items:      center;
			justify-content:  center;
			width:            3rem;
			height:           3rem;
			
			font-family:      'Funnel Display', sans-serif;
			font-size:        1.35rem;
			font-weight:      900;
			
			background-image: var(--theme-ui-gradient-bg);
			border-radius:    .95rem;
			
			&.shown {
				opacity: 1;
				
				&:hover {
					transform:  scale(1.035);
					transition: 25ms ease-out;
				}
				
				&:active {
					transform:  scale(0.99);
					transition: transform 0s linear !important;
				}
			}
			
			&.hidden {
				opacity:        0;
				pointer-events: none !important;
			}
		}
		
		.sort-action {
			position: absolute;
			right:    0;
		}
	}
	
	.sort-action {
		display:          inline-flex;
		align-items:      center;
		justify-content:  center;
		gap:              .25rem;
		
		padding:          .5rem .8rem;
		
		background-image: var(--theme-ui-gradient-bg);
		border-radius:    .75rem;
		
		font-size:        .9rem;
		font-weight:      650;
		
		cursor:           pointer;
		
		transform:        scale(1);
		transition:       transform 350ms ease-out;
		
		svg {
			width:  1.35rem;
			height: 1.35rem;
		}
		
		&:hover {
			transform:  scale(1.025);
			transition: transform 0s linear !important;
		}
		
		&:active {
			transform:  scale(.975);
			transition: transform 0s linear !important;
		}
	}
	
	.content-header {
		display:         flex;
		flex-flow:       row nowrap;
		align-items:     flex-end;
		justify-content: space-between;
		
		padding-bottom:  2rem;
		user-select:     none;
		
		.text {
			.title {
				font-family:      'Funnel Display', sans-serif;
				font-weight:      900;
				
				background-image: var(--theme-text-gradient);
				background-clip:  text;
				color:            transparent;
				
				max-height:       6.75rem;
			}
			
			.subtitle {
				font-weight: 500;
				
				color:       var(--theme-text-third);
			}
		}
		
		.actions {
			display:         flex;
			flex-flow:       column nowrap;
			align-items:     flex-end;
			justify-content: flex-end;
			gap:             .5rem;
			
			.sort-action {
				&.inactive {
					filter: grayscale(.5) brightness(.8);
				}
				
				&.active {
					filter: none;
				}
			}
		}
	}
</style>