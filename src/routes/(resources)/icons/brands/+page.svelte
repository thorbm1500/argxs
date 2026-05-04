<!--svelte-ignore state_referenced_locally-->
<script lang="ts">
	import type { BrandIcon, PageTheme } from '$lib/components/interfaces';
	import { getContext } from 'svelte';
	import BrandIconComponent from '$lib/components/BrandIconComponent.svelte';
	
	const { data } = $props();
	
	const getTheme = getContext('theme') as Function;
	let theme: PageTheme = $derived(getTheme());
	
	let iconsOnly: boolean = $state.raw(false);
	let logosOnly: boolean = $state.raw(false);
	let sorting: 'default' | 'newestFirst' | 'oldestFirst' | 'AtoZ' | 'ZtoA' = $state.raw('default');
	
	let brandIcons: BrandIcon[] = $derived.by(() => {
		let current = data.icons;
		
		switch ($state.eager(sorting)) {
			case 'newestFirst': {
				current = data.iconsSortedNew;
				break;
			}
			case 'oldestFirst': {
				current = data.iconsSortedNew.toReversed();
				break;
			}
			case 'AtoZ': {
				current = data.iconsSortedAtoZ;
				break;
			}
			case 'ZtoA': {
				current = data.iconsSortedAtoZ.toReversed();
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
	
	const pagOffset = 48;
	let pagStart = $derived(Math.max(0, (currentPage - 1) * pagOffset));
	let pagEnd = $derived(Math.min(pagMax, currentPage * pagOffset));
	
	let maxPage = $derived(Math.ceil(pagMax / pagOffset));
	
	let currentIcons = $derived(brandIcons.slice(pagStart, pagEnd));
</script>

<section class="content-header">
	<div class="text">
		<h1 class="title">
			Brand Icons
		</h1>
		<div class="subtitle">
			<!--todo: Write subtitle-->
			<p>
				argxs currently showcases a total of <strong style="color: color-mix(var(--theme-color-accent) 80%, var(--theme-ui-white) 20%);">{data.totalAmount}</strong> different brand icons &
				logos. Of these, <strong style="color: color-mix(var(--theme-color-accent) 80%, var(--theme-ui-white) 20%);">{data.iconAmount}</strong> are icons, and <strong style="color:
				color-mix(var(--theme-color-accent) 80%, var(--theme-ui-white) 20%);">{data.logoAmount}</strong> are logos.
			</p>
		</div>
	</div>
	<div class="actions">
		<button class="sort-action icons-only" onclick="{() => {
			if (iconsOnly) {
				iconsOnly = false;
				logosOnly = true;
			} else if (logosOnly) {
				logosOnly = false;
			} else {
				iconsOnly = true;
			}
		}}">
			{#if iconsOnly}
				Icons Only
			{:else if logosOnly}
				Logos Only
			{:else}
				Icons & Logos
			{/if}
		</button>
		<div class="dropdown">
			<button class="sort-action sort-by">Sort By</button>
			<ul class="items">
				<li>
					<button class="item" onclick='{() => {
					switch (sorting) {
						case "AtoZ": {sorting = "ZtoA"; break;}
						case "ZtoA": {sorting = "default"; break;}
						default: {sorting = "AtoZ"; break;}
					}}}'>
						{#if sorting === 'AtoZ'}
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M15 10v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4" />
								<path d="M19 21h-4l4 -7h-4" />
								<path d="M4 15l3 3l3 -3" />
								<path d="M7 6v12" />
							</svg>
						{:else if sorting === 'ZtoA'}
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M15 21v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4" />
								<path d="M19 10h-4l4 -7h-4" />
								<path d="M4 15l3 3l3 -3" />
								<path d="M7 6v12" />
							</svg>
						{:else}
							<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
								<path d="M16 8h4l-4 8h4" />
								<path d="M4 16v-6a2 2 0 1 1 4 0v6" />
								<path d="M4 13h4" />
								<path d="M11 12h2" />
							</svg>
						{/if}
						Name
					</button>
				</li>
				<li>
					<button class="item" onclick='{() => {
					switch (sorting) {
						case "newestFirst": {sorting = "oldestFirst"; break;}
						case "oldestFirst": {sorting = "default"; break;}
						default: {sorting = "newestFirst"; break;}
					}}}'>
						{#if sorting === 'newestFirst'}
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M20.984 12.535a9 9 0 1 0 -8.431 8.448" />
								<path d="M12 7v5l3 3" />
								<path d="M19 16v6" />
								<path d="M22 19l-3 3l-3 -3" />
							</svg>
						{:else if sorting === 'oldestFirst'}
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
							     stroke-linejoin="round">
								<path d="M20.983 12.548a9 9 0 1 0 -8.45 8.436" />
								<path d="M19 22v-6" />
								<path d="M22 19l-3 -3l-3 3" />
								<path d="M12 7v5l2.5 2.5" />
							</svg>
						{:else}
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M20.943 13.016a9 9 0 1 0 -8.915 7.984" />
								<path d="M16 22l5 -5" />
								<path d="M21 21.5v-4.5h-4.5" />
								<path d="M12 7v5l2 2" />
							</svg>
						{/if}
						Date Added
					</button>
				</li>
			</ul>
		</div>
	</div>
</section>

<section class="theme-grid-content-layout">
	<div class="icons">
		{#each currentIcons as icon}
			{#key icon}
				<BrandIconComponent bind:theme icon={icon} />
			{/key}
		{/each}
	</div>
</section>
<div class="pagination-actions">
	<button title="First Page" class="action {currentPage > 3 ? 'shown' : 'hidden'}" onclick="{() => currentPage = 1}">
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">
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
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">
			<path d="M5 12h.5m3 0h1.5m3 0h6" />
			<path d="M15 16l4 -4" />
			<path d="M15 8l4 4" />
		</svg>
	</button>
</div>

<style>
	/* Desktop & Tablet */
	@media (width >= 44rem) {
		.theme-grid-content-layout .icons {
			grid-template-columns: repeat(calc((100vw - 9rem) / 9rem), 9rem) !important;
		}
		
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
	
	.theme-grid-content-layout {
		height: 34rem !important;
	}
	
	.pagination-actions {
		display:         flex;
		flex-flow:       row nowrap;
		align-items:     center;
		justify-content: center;
		gap:             .5rem;
		
		margin-top:      1rem;
		width:           100%;
		
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
			
			background-image: linear-gradient(to bottom, color-mix(var(--theme-ui-container) 90%, var(--theme-ui-container) 10%) 0%, var(--theme-ui-container) 100%);
			border:           2px solid var(--theme-ui-line);
			border-radius:    1rem;
			
			&.shown {
				opacity: 1;
			}
			
			&.hidden {
				opacity:        0;
				pointer-events: none !important;
			}
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
			flex-flow:       row nowrap;
			align-items:     center;
			justify-content: flex-end;
			gap:             1rem;
			
			.sort-action {
				font-weight:   650;
				border-radius: .75rem;
				padding:       .5rem .8rem;
				background:    var(--theme-ui-container);
				
				cursor:        pointer;
			}
			
			.dropdown {
				position: relative;
				display:  inline-block;
				
				.items, .items .item {
					cursor: pointer;
				}
				
				&:hover .items {
					display:    block;
					transition: ease all 0.3s;
					z-index:    1000 !important;
				}
				
				.items {
					display:            none;
					position:           absolute;
					background:         var(--theme-ui-container);
					width:              max-content;
					border-radius:      .6rem;
					justify-self:       center;
					margin-left:        .8rem;
					box-shadow:         .15rem .15rem .65rem -.05rem rgba(from var(--theme-ui-black) r g b / .15);
					-webkit-box-shadow: .15rem .15rem .65rem -.05rem rgba(from var(--theme-ui-black) r g b / .15);
					
					.item {
						display:     flex;
						flex-flow:   row nowrap;
						gap:         .5rem;
						
						padding:     .75rem 1rem;
						width:       100%;
						text-align:  start;
						font-weight: 500;
						
						&:hover {
							background:    var(--theme-ui-container-hover);
							border-radius: .6rem;
						}
					}
				}
			}
		}
	}
</style>