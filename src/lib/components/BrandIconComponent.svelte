<!--svelte-ignore state_referenced_locally-->
<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { Icon, PageTheme, HighlightIcon, ResourceIcon } from '$lib/components/interfaces';
	import type { Attachment } from 'svelte/attachments';
	import { getContext } from 'svelte';
	
	let { highlightedIcon = $bindable(), theme = $bindable(), type, icon }: { highlightedIcon: HighlightIcon | undefined, theme: PageTheme, type: string, icon: ResourceIcon } = $props();
	
	let isActive: boolean = $state(false);
	let isButton: boolean = $state(false);
	
	const getScrollY: Function | undefined = getContext('scrollY');
	let scrollY: number = $derived(getScrollY?.() ?? 0);
	
	const icons: Icon[] = $derived.by(() => {
		const icons: Icon[] = [];
		
		if (theme === 'light' || !icon.default.theme) icons.push(icon.default);
		else if (icon.default.theme === theme) {
			icons.push(icon.default);
		}
		
		if (theme === 'dark' && icon.dark && (!icon.dark.theme || icon.dark.theme === theme)) {
			icons.push(icon.dark);
		}
		
		for (const i of icon.variable) {
			if (!i.theme || i.theme === theme) icons.push(i);
		}
		
		return icons;
	});
	
	let currentIconIndex: number = $state(0);
	
	let currentTheme: PageTheme = $state(theme);
	let currentIcon: Icon = $derived(icons[currentIconIndex] ?? icon.default);
	let isImageLoading: boolean = $state(true);
	
	let hasNewIconVariant: boolean = $derived(icon.last_updated > (Date.now() - 1209600000));
	let isNewVariant: boolean = $derived(hasNewIconVariant && currentIcon.date_added !== undefined && Date.parse(currentIcon.date_added) > (Date.now() - 1209600000));
	
	$effect(() => {
		if (theme !== currentTheme) {
			currentTheme = theme;
			
			if (highlightedIcon === undefined
				|| highlightedIcon.icon.default.path !== icon.default.path
				|| currentIcon.theme === undefined) return;
			
			highlightedIcon = currentIcon.theme !== theme ? undefined : { icon, iconIndex: icons, currentIcon: currentIconIndex };
		}
	});
	
	const accessibilityTab: Attachment = (element) => {
		element.setAttribute('tabindex', '0');
		
		element.addEventListener('focus', (event) => {
			isButton = /element (prev|next)-icon/.test((event.target as HTMLElement).className);
			isActive = true;
		});
		element.addEventListener('focusout', (event) => {
			isButton = /element (prev|next)-icon/.test((event.target as HTMLElement).className);
			isActive = false;
		});
	};
	
	const externalLink: Attachment = (element) => {
		element.addEventListener('mousedown', (event) => {
			if (!(event.target as HTMLElement)?.className.includes('overlay buttons')) return;
			event.preventDefault();
			isActive = false;
			isButton = false;
			
			highlightedIcon = { icon, iconIndex: icons, currentIcon: currentIconIndex };
		});
		
		element.addEventListener('keydown', (event) => {
			if (event.isTrusted && (event as KeyboardEvent).key === 'Enter') {
				// Ignore event in case of switching between icons
				if (/element (prev|next)-icon/.test((event.target as HTMLElement).className)) return;
				event.preventDefault();
				(element as HTMLElement).blur();
				
				highlightedIcon = { icon, iconIndex: icons, currentIcon: currentIconIndex };
			}
		});
		
		return () => {
			if (highlightedIcon !== undefined && highlightedIcon.icon.default.path === icon.default.path) highlightedIcon = undefined;
		};
	};
	
	const mouseGlow: Attachment = (element) => {
		const mouseBlurContainer = document.createElement('div');
		mouseBlurContainer.className = 'blur-container';
		mouseBlurContainer.style.position = 'absolute';
		mouseBlurContainer.style.width = '7rem';
		mouseBlurContainer.style.height = '7rem';
		mouseBlurContainer.style.top = '0';
		mouseBlurContainer.style.left = '0';
		mouseBlurContainer.style.borderRadius = '1rem';
		mouseBlurContainer.style.pointerEvents = 'none';
		mouseBlurContainer.style.overflow = 'hidden';
		mouseBlurContainer.style.zIndex = '400';
		mouseBlurContainer.style.boxSizing = 'content-box';
		mouseBlurContainer.style.filter = 'saturate(1.1)';
		mouseBlurContainer.style.transition = 'opacity 500ms ease';
		
		const mouseBlurElement = document.createElement('div');
		mouseBlurElement.className = 'element blur-child';
		mouseBlurElement.style.position = 'absolute';
		mouseBlurElement.style.width = '1rem';
		mouseBlurElement.style.height = '1rem';
		mouseBlurElement.style.zIndex = '-1';
		mouseBlurElement.style.backgroundColor = 'white';
		mouseBlurElement.style.pointerEvents = 'none';
		mouseBlurElement.style.filter = 'blur(1.5rem) brightness(2) saturate(2)';
		mouseBlurElement.style.opacity = '.75';
		mouseBlurElement.style.marginTop = 'calc(-' + element.getBoundingClientRect().y + 'px - .5rem)';
		mouseBlurElement.style.marginLeft = 'calc(-' + element.getBoundingClientRect().x + 'px - .75rem)';
		mouseBlurElement.style.mixBlendMode = 'soft-light';
		
		mouseBlurContainer.appendChild(mouseBlurElement);
		
		element.appendChild(mouseBlurContainer);
		
		const mouseMoveEvent: EventListener = (event: Event) => {
			if (highlightedIcon) {
				mouseBlurContainer.style.opacity = '0';
			} else {
				mouseBlurContainer.style.opacity = '1';
				mouseBlurElement.style.top = ((event as MouseEvent).y + scrollY) + 'px';
				mouseBlurElement.style.left = (event as MouseEvent).x + 'px';
			}
		};
		
		window.addEventListener('mousemove', mouseMoveEvent);
		
		return () => {
			window.removeEventListener('mousemove', mouseMoveEvent);
			
			mouseBlurElement.remove();
			mouseBlurContainer.remove();
		};
	};
	
	const iconImage: Attachment = (element) => {
		(element as HTMLImageElement).onloadstart = () => {
			isImageLoading = true;
		};
		(element as HTMLImageElement).onload = () => {
			isImageLoading = false;
		};
		
		if (document.readyState === 'complete' || document.readyState === 'interactive') {
			(element as HTMLImageElement).src = `/resources/icons/${type}/${currentIcon.path}`;
		} else {
			document.addEventListener('DOMContentLoaded', () => (element as HTMLImageElement).src = `/resources/icons/${type}/${currentIcon.path}`);
		}
		
		return () => {
		};
	};
</script>

<div id="brand-icon" style="position:absolute;width:100%;height:100%;background:white;border-radius:inherit;" hidden inert></div>
<!--svelte-ignore a11y_no_noninteractive_tabindex-->
<div class="icon theme-transition-all {$state.eager(isImageLoading) ? 'loading' : ''} {isActive ? (isButton ? 'active button' : 'active') : ''}" {@attach mouseGlow} {@attach externalLink}
     {@attach accessibilityTab}>
	{#if currentIcon.animated}
		<div class="overlay animated" inert>
			<div class="element marker">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke-width=".4" stroke="currentColor">
					<path d="M14.143 11.486a1 1 0 0 1 1.714 1.028c-1.502 2.505 -2.41 4.89 -2.87 7.65c-.16 .956 -1.448 1.15 -1.881 .283c-2.06 -4.12 -3.858 -4.976 -6.79 -3.998a1 1 0 1 1 -.632 -1.898c3.2 -1.067 5.656 -.373 7.803 2.623l.091 .13l.011 -.04c.522 -1.828 1.267 -3.55 2.273 -5.3l.28 -.478z" />
					<path d="M18 4a3 3 0 1 0 0 6a3 3 0 0 0 0 -6" />
				</svg>
			</div>
		</div>
	{/if}
	{#if isNewVariant}
		<div class="overlay is-new-variant" inert>
			<div class="element marker">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
					<path d="M13 2l.018 .001l.016 .001l.083 .005l.011 .002h.011l.038 .009l.052 .008l.016 .006l.011 .001l.029 .011l.052 .014l.019 .009l.015 .004l.028 .014l.04 .017l.021 .012l.022 .01l.023 .015l.031 .017l.034 .024l.018 .011l.013 .012l.024 .017l.038 .034l.022 .017l.008 .01l.014 .012l.036 .041l.026 .027l.006 .009c.12 .147 .196 .322 .218 .513l.001 .012l.002 .041l.004 .064v6h5a1 1 0 0 1 .868 1.497l-.06 .091l-8 11c-.568 .783 -1.808 .38 -1.808 -.588v-6h-5a1 1 0 0 1 -.868 -1.497l.06 -.091l8 -11l.01 -.013l.018 -.024l.033 -.038l.018 -.022l.009 -.008l.013 -.014l.04 -.036l.028 -.026l.008 -.006a1 1 0 0 1 .402 -.199l.011 -.001l.027 -.005l.074 -.013l.011 -.001l.041 -.002z" />
				</svg>
				NEW
			</div>
		</div>
	{:else if hasNewIconVariant}
		<div class="overlay has-new-variant" inert>
			<div class="element marker"></div>
		</div>
	{/if}
	<div class="overlay buttons">
		{#if icons.length > 1}
			<button title="" class="element prev-icon" onclick="{() => {if (currentIconIndex > 0) currentIconIndex--; else currentIconIndex = icons.length - 1}}" {@attach accessibilityTab}>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="pointer-events:none;">
					<path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10 -10 10a10 10 0 1 1 0 -20m2 13v-6a1 1 0 0 0 -1.707 -.708l-3 3a1 1 0 0 0 0 1.415l3 3a1 1 0 0 0 1.414 0l.083 -.094c.14 -.18 .21 -.396 .21 -.613" />
				</svg>
			</button>
			<button title="" class="element next-icon" onclick="{() => {if (currentIconIndex < icons.length - 1) currentIconIndex++; else currentIconIndex = 0}}" {@attach accessibilityTab}>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"  style="pointer-events:none;">
					<path
						d="M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336m-5.293 4.953a1 1 0 0 0 -1.707 .707v6c0 .217 .07 .433 .21 .613l.083 .094a1 1 0 0 0 1.414 0l3 -3a1 1 0 0 0 0 -1.414z" />
				</svg>
			</button>
		{/if}
	</div>
	{#if icons.length > 1}
		<div class="overlay current-icon-amount" inert>
			<p class="current-icon marker">
				{currentIconIndex + 1} /
			</p>
			<p class="element marker">
				{icons.length}
			</p>
		</div>
		<div class="overlay icon-amount" inert>
			<p class="element marker">
				{icons.length}
			</p>
		</div>
	{/if}
	{#key currentIcon.path}
		<div class="hover-fx" inert>
			<!--svelte-ignore a11y_missing_attribute-->
			<img {@attach iconImage} src={`/resources/icons/${type}/${currentIcon.path}`} alt="" loading="lazy" />
		</div>
		<img {@attach iconImage} in:fade src={`/resources/icons/${type}/${currentIcon.path}`} alt={icon.name} loading="lazy" />
	{/key}
	<h3 class="icon-name" inert>{currentIcon.name ?? icon.name}</h3>
</div>

<style>
	/* Desktop & Tablet */
	@media (width >= 44rem) {
	}
	
	/* Phone */
	@media (width < 44rem) {
	}
	
	:global(.dark) .icon {
		backdrop-filter: url(#icon-glass-distortion) blur(.125rem) brightness(1.15) contrast(1.015);
		
		&:hover {
			filter: brightness(1.1);
		}
	}
	
	@keyframes IconLoadingAnim {
		0%, 10%, 90%, 100% {
			background-color: rgba(from var(--theme-ui-line) r g b / .35);
			opacity:          1;
		}
		50% {
			background-color: rgba(from var(--theme-ui-line) r g b / .35);
			opacity:          .25;
		}
	}
	
	.icon.loading {
		animation:      IconLoadingAnim 1.35s infinite cubic-bezier(0.78, 0, 0.22, 1) 115ms;
		pointer-events: none !important;
		
		.overlay, .overlay *, .hover-fx {
			visibility: hidden !important;
			opacity:    0 !important;
		}
		
		img {
			filter:  url(#pixelate) blur(1px) brightness(.5) grayscale(.25);
			opacity: .5;
		}
	}
	
	@keyframes TextAnim {
		0% {
			transform: rotate3d(100, 0, 0, 0deg) scale3d(1, 1, 1) translateY(.2rem) scale(1.0005);
		}
		10% {
			transform: rotate3d(100, 0, 0, -50deg) scale3d(1.1, 1, 1.1) translateY(.25rem) scale(1.015);
		}
		70% {
			transform: rotate3d(100, 0, 0, -5deg) scale3d(1.05, 1, 1.025) translateY(.4rem) scale(1.02);
		}
		100% {
			transform: rotate3d(100, 0, 0, 0deg) scale3d(1, 1, 1) translateY(.4rem) scale(1.0025);
		}
	}
	
	.icon {
		position:          relative;
		display:           flex;
		align-items:       center;
		justify-content:   center;
		
		width:             7rem;
		height:            7rem;
		overflow:          visible;
		
		padding:           .35rem;
		margin-bottom:     1.25rem;
		
		border:            1px solid var(--theme-ui-line);
		border-radius:     .75rem;
		backdrop-filter:   url(#icon-glass-distortion) blur(.125rem) brightness(.95) contrast(1.015);
		
		cursor:            pointer;
		user-select:       none !important;
		-webkit-user-drag: none !important;
		
		z-index:           5000 !important;
		
		transition:        border-color 150ms ease;
		
		.icon-name {
			position:      absolute;
			bottom:        -1.5rem;
			
			text-wrap:     nowrap;
			max-width:     6.5rem;
			text-overflow: ellipsis;
			overflow:      hidden;
			color:         var(--theme-text-fourth);
			
			transition:    var(--theme-transition-off);
		}
		
		&::before, &::after {
			content:       '';
			
			position:      absolute;
			top:           0;
			left:          0;
			width:         7rem;
			height:        7rem;
			
			border-radius: inherit;
			
			z-index:       400 !important;
		}
		
		&::before {
			border:         1px solid rgba(from var(--theme-ui-black) r g b / .5);
			mix-blend-mode: overlay;
			filter:         blur(.05rem) contrast(2) brightness(1.5);
			mask-image:     linear-gradient(20deg, transparent 20%, black 50%, transparent 80%);
			width:          calc(100% + 1px);
			height:         calc(100% + 1px);
		}
		
		&::after {
			border:         2px solid var(--theme-ui-white);
			opacity:        .6;
			mix-blend-mode: overlay;
			filter:         blur(.075rem) contrast(2) brightness(1.5);
			mask-image:     linear-gradient(-20deg, transparent 0%, black 50%, transparent 100%);
			width:          calc(100% + 2px);
			height:         calc(100% + 2px);
		}
		
		.hover-fx {
			position:       absolute;
			height:         inherit;
			width:          inherit;
			overflow:       hidden;
			align-content:  center;
			
			mask-image:     radial-gradient(transparent 0%, white 32.5%);
			
			pointer-events: none !important;
			
			img {
				justify-self:   center;
				mask-image:     linear-gradient(to top, white 0%, transparent 80%);
				mask-type:      alpha;
				height:         100%;
				width:          100%;
				padding:        .25rem;
				
				opacity:        0;
				transform:      scale(3) !important;
				filter:         brightness(1.3) contrast(1.075) saturate(1.075) blur(2px);
				
				pointer-events: none !important;
				z-index:        500;
			}
		}
		
		&:hover, &:focus-visible, &.active {
			filter:       brightness(1.015);
			border-color: color-mix(var(--theme-ui-line) 50%, var(--theme-ui-line-highlight) 50%);
			
			transition:   border-color 50ms ease;
			
			img {
				pointer-events: none !important;
				transform:      scale(1.3);
				
				transition:     400ms linear(0, 0.291 2.7%, 0.544 5.5%, 0.761 8.4%, 0.947 11.5%, 1.027 13.1%, 1.096 14.7%, 1.16 16.4%, 1.213 18.1%, 1.26 19.9%, 1.298 21.7%, 1.329 23.6%, 1.352 25.5%, 1.363 26.8%, 1.372 28.2%, 1.377 29.6%, 1.379 31.1%, 1.378 32.6%, 1.374 34.2%, 1.367 35.9%, 1.357 37.6%, 1.337 40.4%, 1.307 43.7%, 1.176 56.1%, 1.121 61.8%, 1.096 64.8%, 1.074 67.8%, 1.056 70.7%, 1.04 73.7%, 1.029 76.3%, 1.02 79%, 1.013 81.8%, 1.007 84.7%, 1.001 91%, 1);
			}
			
			.hover-fx {
				img {
					opacity: .1225;
				}
			}
			
			&.button .icon-name {
				animation: none !important;
			}
			
			.icon-name {
				transform:   translateY(.4rem) scale(1.015);
				font-weight: 900;
				max-width:   8.5rem;
				color:       var(--theme-text-primary);
				transition:  var(--theme-transition-on);
				animation:   TextAnim 300ms ease;
			}
			
			.icon-amount {
				opacity: 0;
			}
			
			.current-icon-amount {
				opacity: 1;
			}
			
			.buttons {
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
			            transform 700ms linear(0, 0.101 3.9%, 0.328 13.1%, 0.472 18.3%, 0.557 21%, 0.648 23.7%, 0.999 33.3%, 0.891 36.8%, 0.855 38.2%, 0.824 39.6%, 0.802 40.9%, 0.785 42.2%, 0.775 43.5%, 0.771 44.8%, 0.774 46%, 0.783 47.3%, 0.798 48.6%, 0.819 49.9%, 0.871 52.4%, 0.999 57.7%, 0.956 59.9%, 0.931 61.6%, 0.921 62.5%, 0.915 63.4%, 0.911 64.2%, 0.91 65.1%, 0.914 66.7%, 0.927 68.5%, 0.944 70.1%, 1 74.5%, 0.985 76.1%, 0.976 77.4%, 0.97 78.7%, 0.968 80%, 0.969 81.2%, 0.973 82.5%, 1 88.2%, 0.995 90%, 0.994 91.8%, 0.999 97.5%, 1);
		}
		
		.overlay {
			position: absolute;
			width:    7rem !important;
			height:   7rem !important;
			
			.element {
				position: relative;
			}
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
				font-family: 'Bricolage Grotesque Variable', 'Funnel Sans', sans-serif;
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
		
		.animated .marker {
			top:   .45rem;
			right: -5.45rem;
			
			svg {
				width: 1.1rem;
				height: 1.1rem;
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