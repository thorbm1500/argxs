<!--svelte-ignore state_referenced_locally-->
<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { BrandIcon, Icon, PageTheme } from '$lib/components/interfaces';
	import { getContext } from 'svelte';
	import { copyToClipboard } from '$lib/utilities';
	
	let { theme = $bindable(), icon }: { theme: PageTheme, icon: BrandIcon } = $props();
	
	const sendToast: any = $derived(getContext('sendToast'));
	
	const icons: Icon[] = $state([icon.default]);
	let currentIconIndex: number = $state(0);
	if (icon.monochrome_light) icons.push(icon.monochrome_light);
	if (icon.monochrome_dark) icons.push(icon.monochrome_dark);
	if (icon.variable.length !== 0) icons.push(...icon.variable);
	
	let currentTheme: PageTheme = $state.raw(theme);
	let currentIcon: Icon = $derived(icons[currentIconIndex] ?? icon.default);
	updateCurrentIcon();
	
	let hasNewIconVariant: boolean = $derived(icon.last_updated > (Date.now() - 432000000));
	let isNewVariant: boolean = $derived(hasNewIconVariant && currentIcon.date_added !== undefined && Date.parse(currentIcon.date_added) > (Date.now() - 432000000));
	
	$effect(() => {
		if ($state.eager(theme) !== currentTheme) {
			currentTheme = theme;
			updateCurrentIcon();
		}
	});
	
	function updateCurrentIcon() {
		if (theme === 'light' || !icon.dark) {
			icons[0] = icon.default;
		} else {
			icons[0] = icon.dark;
		}
		
		currentIconIndex = 0;
	}
</script>

<div class="icon">
	{#if isNewVariant}
		<div class="overlay is-new-variant">
			<div class="element marker">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M13 2l.018 .001l.016 .001l.083 .005l.011 .002h.011l.038 .009l.052 .008l.016 .006l.011 .001l.029 .011l.052 .014l.019 .009l.015 .004l.028 .014l.04 .017l.021 .012l.022 .01l.023 .015l.031 .017l.034 .024l.018 .011l.013 .012l.024 .017l.038 .034l.022 .017l.008 .01l.014 .012l.036 .041l.026 .027l.006 .009c.12 .147 .196 .322 .218 .513l.001 .012l.002 .041l.004 .064v6h5a1 1 0 0 1 .868 1.497l-.06 .091l-8 11c-.568 .783 -1.808 .38 -1.808 -.588v-6h-5a1 1 0 0 1 -.868 -1.497l.06 -.091l8 -11l.01 -.013l.018 -.024l.033 -.038l.018 -.022l.009 -.008l.013 -.014l.04 -.036l.028 -.026l.008 -.006a1 1 0 0 1 .402 -.199l.011 -.001l.027 -.005l.074 -.013l.011 -.001l.041 -.002z" />
				</svg>
				NEW
			</div>
		</div>
	{:else if hasNewIconVariant}
		<div class="overlay has-new-variant">
			<div class="element marker"></div>
		</div>
	{/if}
	<div class="overlay buttons">
		<div class="action-icons">
			<svg class="hover-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 2l.324 .001l.318 .004l.616 .017l.299 .013l.579 .034l.553 .046c4.785 .464 6.732 2.411 7.196 7.196l.046 .553l.034 .579c.005 .098 .01 .198 .013 .299l.017 .616l.005 .642l-.005 .642l-.017 .616l-.013 .299l-.034 .579l-.046 .553c-.464 4.785 -2.411 6.732 -7.196 7.196l-.553 .046l-.579 .034c-.098 .005 -.198 .01 -.299 .013l-.616 .017l-.642 .005l-.642 -.005l-.616 -.017l-.299 -.013l-.579 -.034l-.553 -.046c-4.785 -.464 -6.732 -2.411 -7.196 -7.196l-.046 -.553l-.034 -.579a28.058 28.058 0 0 1 -.013 -.299l-.017 -.616c-.003 -.21 -.005 -.424 -.005 -.642l.001 -.324l.004 -.318l.017 -.616l.013 -.299l.034 -.579l.046 -.553c.464 -4.785 2.411 -6.732 7.196 -7.196l.553 -.046l.579 -.034c.098 -.005 .198 -.01 .299 -.013l.616 -.017c.21 -.003 .424 -.005 .642 -.005zm1.707 6.293a1 1 0 0 0 -1.414 0l-3 3l-.083 .094a1 1 0 0 0 .083 1.32l3 3l.094 .083a1 1 0 0 0 1.32 -.083l.083 -.094a1 1 0 0 0 -.083 -1.32l-2.292 -2.293l2.292 -2.293l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
			</svg>
			<button class="copy-icon" title="Copy SVG" onclick="{async () => {
			if (copyToClipboard(await (await fetch('/resources/icons/brands/'+currentIcon.path)).text())) sendToast?.({ message: 'Copied', duration: 1250, type: 'copy', status: 'success' });
			}}">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M17.997 4.17a3 3 0 0 1 2.003 2.83v12a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 2.003 -2.83a4 4 0 0 0 3.997 3.83h4a4 4 0 0 0 3.98 -3.597zm-5.997 6.83a1 1 0 0 0 -1 1v1h-1a1 1 0 0 0 0 2h1v1a1 1 0 0 0 2 0v-1h1a1 1 0 0 0 0 -2h-1v-1a1 1 0 0 0 -1 -1m2 -9a2 2 0 1 1 0 4h-4a2 2 0 1 1 0 -4z" />
				</svg>
			</button>
			<a title="Download SVG" class="download-icon" href="/resources/icons/brands/{currentIcon.path}" onclick="{async () => {
				sendToast?.({ message: 'Downloaded', duration: 1250, type: 'download', status: 'success' });
			}}" download>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M13.5 16h-9.5a1 1 0 0 1 -1 -1v-10a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v7.5" />
					<path d="M7 20h5" />
					<path d="M9 16v4" />
					<path d="M19 16v6" />
					<path d="M22 19l-3 3l-3 -3" />
				</svg>
			</a>
		</div>
		{#if icons.length > 1}
			<button title="" class="element prev-icon" onclick="{() => {if (currentIconIndex > 0) currentIconIndex--; else currentIconIndex = icons.length - 1}}">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M12 2c5.523 0 10 4.477 10 10s-4.477 10 -10 10a10 10 0 1 1 0 -20m2 13v-6a1 1 0 0 0 -1.707 -.708l-3 3a1 1 0 0 0 0 1.415l3 3a1 1 0 0 0 1.414 0l.083 -.094c.14 -.18 .21 -.396 .21 -.613" />
				</svg>
			</button>
			<button title="" class="element next-icon" onclick="{() => {if (currentIconIndex < icons.length - 1) currentIconIndex++; else currentIconIndex = 0}}">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336m-5.293 4.953a1 1 0 0 0 -1.707 .707v6c0 .217 .07 .433 .21 .613l.083 .094a1 1 0 0 0 1.414 0l3 -3a1 1 0 0 0 0 -1.414z" />
				</svg>
			</button>
		{/if}
	</div>
	{#if icons.length > 1}
		<div class="overlay current-icon-amount">
			<p class="current-icon marker">
				{currentIconIndex + 1} /
			</p>
			<p class="element marker">
				{icons.length}
			</p>
		</div>
		<div class="overlay icon-amount">
			<p class="element marker">
				{icons.length}
			</p>
		</div>
	{/if}
	<div class="hover-fx">
		<!--svelte-ignore a11y_missing_attribute-->
		<img src="/resources/icons/brands/{currentIcon.path}" loading="lazy" />
	</div>
	<img in:fade src="/resources/icons/brands/{currentIcon.path}" alt={icon.name} loading="lazy" />
</div>

<style>
	:global .dark .icon {
		background-image: linear-gradient(to bottom, color-mix(var(--theme-ui-line), var(--theme-color-primary) 7.5%) 0%, var(--theme-ui-line) 80%) !important;
	}
	
	.icon {
		display:           flex;
		align-items:       center;
		justify-content:   center;
		
		width:             7rem;
		height:            7rem;
		overflow:          visible;
		
		padding:           .35rem;
		
		background-image:  linear-gradient(to top, color-mix(var(--theme-ui-line), var(--theme-color-primary) 7.5%) 0%, var(--theme-ui-line) 80%);
		border:            1px solid var(--theme-ui-line);
		border-radius:     .75rem;
		
		cursor:            pointer;
		user-select:       none !important;
		-webkit-user-drag: none !important;
		
		z-index:           5000;
		
		transition:        border-color 150ms ease;
		
		.hover-fx {
			position:       absolute;
			height:         inherit;
			width:          inherit;
			overflow:       hidden;
			align-content:  center;
			pointer-events: none !important;
			
			mask-image:     radial-gradient(transparent 0%, white 32.5%);
			
			img {
				justify-self: center;
				mask-image:   linear-gradient(to top, white 0%, transparent 80%);
				mask-type:    alpha;
				height:       100%;
				width:        100%;
				padding:      .25rem;
				
				opacity:      0;
				transform:    scale(3) !important;
				filter:       blur(2px);
				
				z-index:      500;
			}
		}
		
		.buttons {
			.element, .copy-icon, .download-icon {
				svg {
					transition: color 500ms 100ms ease-out,
					            stroke 500ms 100ms ease-out;
				}
			}
			
			.element, .copy-icon {
				&:active svg {
					fill:       var(--theme-color-accent);
					transform:  scale(.9);
					transition: fill 0ms transform 0ms !important;
				}
			}
			
			.download-icon {
				&:active svg {
					stroke:     var(--theme-color-accent);
					transform:  scale(.9);
					transition: stroke 0ms transform 0ms !important;
				}
			}
			
			.action-icons {
				position:   absolute;
				top:        -.75rem;
				right:      .5rem;
				opacity:    0;
				
				transition: 150ms ease-outz;
				
				svg {
					color:      var(--theme-text-third);
					transition: 150ms ease-out;
				}
				
				.hover-icon, .copy-icon, .download-icon {
					position:   absolute;
					transform:  scale(.85);
					
					cursor:     pointer;
					
					transition: transform 150ms ease-in;
				}
				
				.copy-icon, .download-icon {
					opacity: 0;
				}
				
				.hover-icon, .copy-icon {
					right: 0;
				}
				
				.download-icon {
					right: 1.5rem;
				}
				
				.hover-icon:hover {
					opacity: 0;
				}
				
				&:hover {
					.hover-icon {
						opacity:    0;
						transition: transform 150ms ease-in;
					}
					
					.copy-icon, .download-icon {
						opacity:        1;
						pointer-events: all;
						transform:      scale(1);
						
						transition:     50ms ease-in;
						
						&:hover svg {
							color:      var(--theme-color-primary);
							
							transition: 50ms ease-in;
						}
					}
				}
			}
		}
		
		&:hover {
			filter:       brightness(1.05);
			border-color: var(--theme-ui-line-highlight);
			
			transition:   border-color 50ms ease;
			
			img {
				pointer-events: none !important;
				transform:      scale(1.25);
				
				transition:     100ms ease;
			}
			
			.hover-fx {
				img {
					opacity: .12;
				}
			}
			
			.icon-amount {
				opacity: 0;
			}
			
			.current-icon-amount {
				opacity: 1;
			}
			
			.buttons {
				.action-icons {
					opacity:    1 !important;
					
					transition: 100ms ease;
					
					.hover-icon {
						transform: scale(1);
					}
				}
				
				.element {
					transform:  scale(1);
					transition: 100ms ease;
					
					svg {
						opacity:    1;
						filter:     blur(0);
						color:      var(--theme-color-primary);
						
						transition: 100ms ease;
					}
				}
			}
		}
		
		img {
			width:      80%;
			height:     100%;
			max-height: 2.25rem;
			max-width:  4.25rem;
			
			z-index:    500;
			
			transition: 250ms ease,
			            transform 350ms ease-out;
		}
		
		.overlay {
			position: absolute;
			width:    7rem !important;
			height:   7rem !important;
		}
		
		.overlay .element {
			position: relative;
		}
		
		.icon-amount {
			opacity:     1;
			
			display:     flex;
			align-items: flex-end;
		}
		
		.current-icon-amount {
			opacity:     0;
			
			display:     flex;
			flex-flow:   row nowrap;
			align-items: flex-end;
			gap:         .2rem;
		}
		
		.icon-amount, .current-icon-amount {
			margin-left:   1.25rem;
			margin-bottom: .5rem;
			
			.marker {
				font-size:   .75rem;
				font-weight: 900;
				font-family: 'Bricolage Grotesque Variable','Funnel Sans', sans-serif;
				color:       var(--theme-text-third);
			}
		}
		
		.buttons {
			display:         flex;
			flex-flow:       row nowrap;
			align-items:     flex-end;
			justify-content: center;
			gap:             .075rem;
			
			z-index:         10000;
			
			.element {
				cursor:        pointer;
				transform:     scale(.9);
				transition:    200ms ease-in;
				margin-bottom: -.75rem;
				
				svg {
					opacity:    0;
					filter:     blur(2px);
					color:      var(--theme-color-secondary);
					transition: 200ms ease-in;
				}
			}
		}
		
		.has-new-variant .marker {
			top:           .5rem;
			left:          .5rem;
			height:        .5rem;
			width:         .5rem;
			
			border-radius: 100%;
			background:    var(--theme-text-new);
		}
		
		.is-new-variant .marker {
			top:               .5rem;
			left:              .5rem;
			
			display:           flex;
			align-items:       center;
			justify-content:   flex-start;
			gap:               .1rem;
			
			font-family:       'Funnel Display', sans-serif;
			font-weight:       900;
			font-size:         .6rem;
			
			color:             var(--theme-text-new);
			background-repeat: repeat;
			background-clip:   text;
			
			height:            fit-content;
			
			transition:        200ms ease-in;
			
			svg {
				width:  .6rem;
				height: .6rem;
			}
		}
	}
</style>