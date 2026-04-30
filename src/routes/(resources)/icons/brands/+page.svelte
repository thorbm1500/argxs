<script lang='ts'>
	import CopyableComponent from '$lib/components/CopyableComponent.svelte';
	import type { BrandIcon } from '$lib/components/interfaces';
	import { getContext } from 'svelte';
	
	const { data } = $props();
	
	const getTheme = getContext('theme') as Function;
	let theme: 'dark' | 'light' = $derived(getTheme());
	
	let sorting: 'default' | 'newestFirst' | 'oldestFirst' | 'AtoZ' | 'ZtoA' = $state.raw('default');
	
	// svelte-ignore state_referenced_locally
	let brandIcons: BrandIcon[] = $derived.by(() => {
		switch ($state.eager(sorting)) {
			case 'default':
				return data.icons;
			case 'newestFirst':
				return data.iconsSortedNew;
			case 'oldestFirst':
				return data.iconsSortedNew.toReversed();
			case 'AtoZ':
				return data.iconsSortedAtoZ;
			case 'ZtoA':
				return data.iconsSortedAtoZ.toReversed();
			default:
				return [];
		}
	});
</script>

<section class='content-header'>
	<div class='text'>
		<h1 class='title'>
			Brand Icons
		</h1>
		<div class='subtitle'>
			<!--todo: Write subtitle-->
			<p>
				argxs currently showcases <strong style='color: color-mix(var(--theme-color-accent) 80%, var(--theme-ui-white) 20%);'>{data.iconAmount}</strong>
				different brand icons
			</p>
		</div>
	</div>
	<div class='actions'>
		<div class='dropdown'>
			<button class='trigger'>Sort By</button>
			<ul class='items'>
				<li>
					<button class='item' onclick='{() => {
					switch (sorting) {
						case "AtoZ": {sorting = "ZtoA"; break;}
						case "ZtoA": {sorting = "default"; break;}
						default: {sorting = "AtoZ"; break;}
					}}}'>
						{#if sorting === 'AtoZ'}
							<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
								<path d='M15 10v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4'/>
								<path d='M19 21h-4l4 -7h-4'/>
								<path d='M4 15l3 3l3 -3'/>
								<path d='M7 6v12'/>
							</svg>
						{:else if sorting === 'ZtoA'}
							<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
								<path d='M15 21v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4'/>
								<path d='M19 10h-4l4 -7h-4'/>
								<path d='M4 15l3 3l3 -3'/>
								<path d='M7 6v12'/>
							</svg>
						{:else}
							<svg width='25' height='25' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'>
								<path d='M16 8h4l-4 8h4'/>
								<path d='M4 16v-6a2 2 0 1 1 4 0v6'/>
								<path d='M4 13h4'/>
								<path d='M11 12h2'/>
							</svg>
						{/if}
						Name
					</button>
				</li>
				<li>
					<button class='item' onclick='{() => {
					switch (sorting) {
						case "newestFirst": {sorting = "oldestFirst"; break;}
						case "oldestFirst": {sorting = "default"; break;}
						default: {sorting = "newestFirst"; break;}
					}}}'>
						{#if sorting === 'newestFirst'}
							<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
								<path d='M20.984 12.535a9 9 0 1 0 -8.431 8.448'/>
								<path d='M12 7v5l3 3'/>
								<path d='M19 16v6'/>
								<path d='M22 19l-3 3l-3 -3'/>
							</svg>
						{:else if sorting === 'oldestFirst'}
							<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round'
							     stroke-linejoin='round'>
								<path d='M20.983 12.548a9 9 0 1 0 -8.45 8.436'/>
								<path d='M19 22v-6'/>
								<path d='M22 19l-3 -3l-3 3'/>
								<path d='M12 7v5l2.5 2.5'/>
							</svg>
						{:else}
							<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
								<path d='M20.943 13.016a9 9 0 1 0 -8.915 7.984'/>
								<path d='M16 22l5 -5'/>
								<path d='M21 21.5v-4.5h-4.5'/>
								<path d='M12 7v5l2 2'/>
							</svg>
						{/if}
						Date Added
					</button>
				</li>
			</ul>
		</div>
	</div>
</section>

<section class='theme-grid-content-layout'>
	<div class='icons'>
		{#each brandIcons as icon}
							{#if theme === 'light' || !icon.dark}
					<CopyableComponent path='/resources/icons/brands/{icon.default.svg}'
					                   name={icon.default.name ?? icon.name}
					                   href={icon.default.href ?? icon.href}
					                   source={icon.default.source}
					                   date_added={icon.default.date_added}/>
				{/if}
			{#if theme === 'light'}
					{#if icon.monochrome_black}
						<CopyableComponent path='/resources/icons/brands/{icon.monochrome_black.svg}'
						                   name={icon.monochrome_black.name ?? icon.name}
						                   href={icon.monochrome_black.href ?? icon.href}
						                   source={icon.monochrome_black.source}
						                   date_added={icon.monochrome_black.date_added}/>
					{/if}
				{:else}
					{#if icon.dark}
						<CopyableComponent path='/resources/icons/brands/{icon.dark.svg}'
						                   name={icon.dark.name ?? icon.name}
						                   href={icon.dark.href ?? icon.href}
						                   source={icon.dark.source}
						                   date_added={icon.dark.date_added}/>
					{/if}
				{#if icon.monochrome_white}
						<CopyableComponent path='/resources/icons/brands/{icon.monochrome_white.svg}'
						                   name={icon.monochrome_white.name ?? icon.name}
						                   href={icon.monochrome_white.href ?? icon.href}
						                   source={icon.monochrome_white.source}
						                   date_added={icon.monochrome_white.date_added}/>
					{/if}
				{/if}
		{/each}
	</div>
</section>

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
					
					.trigger {
						font-weight:   650;
						border-radius: .75rem;
						padding:       .5rem .8rem;
						background:    var(--theme-ui-container);
						
						cursor:        pointer;
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
						-moz-box-shadow:    .15rem .15rem .65rem -.05rem rgba(from var(--theme-ui-black) r g b / .15);
						
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