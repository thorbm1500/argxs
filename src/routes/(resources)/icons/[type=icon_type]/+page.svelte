<!--svelte-ignore state_referenced_locally-->
<script lang="ts">
	import type { HighlightIcon, Icon, PageTheme, ResourceIcon } from '$lib/components/interfaces';
	import { getContext, onMount, tick } from 'svelte';
	import BrandIconComponent from '$lib/components/BrandIconComponent.svelte';
	import { innerWidth } from 'svelte/reactivity/window';
	import { draw, fade } from 'svelte/transition';
	import { quartInOut, cubicOut } from 'svelte/easing';
	import moment from 'moment';
	import { copyToClipboard } from '$lib/utilities';
	import { page } from '$app/state';
	import { beforeNavigate } from '$app/navigation';
	import GlassButton from '$lib/components/GlassButton.svelte';
	import hljs from '@highlightjs/cdn-assets/es/core.min.js';
	import xml from '@highlightjs/cdn-assets/es/languages/xml.min.js';
	import { prefersReducedMotion } from 'svelte/motion';
	import { MediaQuery } from 'svelte/reactivity';
	
	hljs.registerLanguage('xml', xml);
	
	let iconType: string = $derived(String(page.params.type));
	let isLoaded: boolean = $state(false);
	
	const { data } = $props();
	
	const getTheme = getContext('theme') as Function;
	let theme: PageTheme = $derived(getTheme !== undefined ? getTheme() : 'dark');
	const sendToast: any = $derived(getContext('sendToast'));
	
	// - Sorting Variables
	let iconsOnly: boolean = $state(false);
	let logosOnly: boolean = $state(false);
	let countriesOnly: boolean = $state(false);
	let statesOnly: boolean = $state(false);
	let animatedOnly: boolean = $state(false);
	let sorting: string | 'default' | 'time' | 'alphabet' = $state(localStorage.getItem('icons#sorting') ?? 'default');
	let order: string | 'desc' | 'asc' = $state(localStorage.getItem('icons#sorting_order') ?? 'desc');
	let search: string = $state('');
	let searchbarValue: string = $state('');
	let latestSearchStateChange: number = $state(0);
	
	let icons: ResourceIcon[] = $derived.by(() => {
		let current = [];
		
		switch (sorting) {
			case 'time': {
				if (order === 'desc') current = data.iconsSortedNew.toReversed();
				else current = data.iconsSortedNew;
				break;
			}
			case 'alphabet': {
				if (order === 'desc') current = data.iconsSortedAtoZ.toReversed();
				else current = data.iconsSortedAtoZ;
				break;
			}
			default: {
				current = data.icons;
				break;
			}
		}
		
		if (iconType === 'brands') {
			if (iconsOnly) current = current.filter((icon: ResourceIcon) => icon.type === 'icon');
			else if (logosOnly) current = current.filter((icon: ResourceIcon) => icon.type === 'logo');
		}
		else if (iconType === 'flags') {
			if (countriesOnly) current = current.filter((icon: ResourceIcon) => icon.type === 'country');
			else if (statesOnly) {
				const newCurrent: ResourceIcon[] = [];
				
				for (const country of current) {
					const current: ResourceIcon = {...country};
					current.variable = [];
					let isStateOnly = false;
					
					if (country?.type === 'state' || current.default?.type === 'state') isStateOnly = true;
					
					for (const flag of country.variable) {
						if (flag?.type === 'state') {
							if (!isStateOnly) {
								isStateOnly = true;
								current.default = flag;
							} else current.variable.push(flag);
						}
					}
					
					if (isStateOnly) newCurrent.push(current);
				}
				
				current = newCurrent;
			}
		}
		
		let result: ResourceIcon[] = [];
		
		for (const resource of current) {
			if (!resource.default.theme || resource.default.theme === theme || (resource.dark && (!resource.dark.theme || resource.dark.theme === theme))) {
				result.push(resource);
				continue;
			}
			
			for (const v of resource.variable) {
				if (!v.theme || v.theme === $state.eager(theme)) {
					result.push(resource);
					break;
				}
			}
		}
		
		if (search !== '') {
			const searchResult: ResourceIcon[] = [];
			
			for (const resource of result) {
				if (regexSearch(resource.title) || regexSearch(resource.name)) searchResult.push(resource);
			}
			
			result = searchResult.sort((a, b) => {
				const aa = a.name ?? a.title;
				const bb = b.name ?? b.title;
				
				const minLength = Math.min(aa.length, bb.length);
				let current = 0;
				
				for (let i = 0; i < search.length; i++) {
					const currentReg = new RegExp(search.charAt(i), 'i');
					
					for (let j = 0; j < minLength; j++) {
						const currentA = aa.charAt(j);
						const currentB = bb.charAt(j);
						
						if (!currentReg.test(currentA) && !currentReg.test(currentB)) {
							// Both icon names match equally, but are both longer than the search string. Returns a comparison of the entire name of both icons
							return aa.localeCompare(bb);
						} else {
							if (currentReg.test(currentA)) current--;
							if (currentReg.test(currentB)) current++;
						}
						// Break if a result has been concluded
						if (current !== 0) break;
					}
					// Required to not continue searching through the rest of the search string, in case the inner loop broke
					if (current !== 0) break;
				}
				
				return current === 0 ? aa.localeCompare(bb) : current;
			});
		}
		
		const sorted: ResourceIcon[] = [];
		
		if (animatedOnly) {
			for (const resource of result) {
				let isAnimated = false;
				let current: ResourceIcon = { ...resource };
				
				if (resource.default.animated) isAnimated = true;
				
				if (!isAnimated && resource.dark?.animated) {
					current.default = resource.dark;
					current.dark = undefined;
					isAnimated = true;
				}
				if (current.dark && !resource.dark?.animated) {
					current.dark = undefined;
				}
				if (resource.variable.length !== 0) {
					current.variable = [];
					
					for (const v of resource.variable) {
						if (v.animated) {
							if (isAnimated) {
								current.variable.push(v);
							} else {
								current.default = v;
							}
						}
					}
				}
				
				if (isAnimated) sorted.push(current);
			}
			result = sorted;
		}
		
		return result;
	});

	// True if a search has been executed, but no icons are present
	let noSearchResult = $derived(search !== '' && icons.length === 0);
	
	function regexSearch(value: string) {
		return new RegExp(search, 'iu').test(value);
	}
	
	function saveCurrentSorting(): void {
		localStorage.setItem('icons#sorting', sorting);
		localStorage.setItem('icons#sorting_order', order);
	}
	
	// - Pagination Variables
	let pagMax = $derived(icons.length);
	let currentPage = $state(1);
	let pagOffset: number | 24 | 48 | 96 = $state(Number.parseInt(localStorage.getItem('icons#pagination_offset') ?? '48'));
	let pagStart = $derived(Math.max(0, (currentPage - 1) * pagOffset));
	let pagEnd = $derived(Math.min(pagMax, currentPage * pagOffset));
	let maxPage = $derived(Math.ceil(pagMax / pagOffset));
	let cIcons: ResourceIcon[] = $derived(isLoaded ? icons.slice(pagStart, pagEnd) : []);
	let blankIcons: number[] = $derived.by(() => {
		let current = [];
		for (let i = cIcons.length; i < pagOffset; i++) {
			current.push(i);
		}
		return current;
	});
	let currentIcons: (ResourceIcon | number)[] = $derived([...cIcons, ...blankIcons]);
	
	let columnAmount: number = $derived.by(() => {
		let result = Math.trunc(Math.min(1920, innerWidth.current ?? 1920) / 140);
		
		while (true) {
			if (((pagOffset / result) % 2) !== 0) result--;
			else break;
		}
		
		return result;
	});
	let rowAmount = $derived(pagOffset / columnAmount);
	
	// - Highlighted Icon Variables
	let highlightedIcon: HighlightIcon | undefined = $state(undefined);
	let iconContainerOpened: number | null = null;
	let hCurrentIcon: Icon | undefined = $derived.by(() => highlightedIcon ? highlightedIcon.iconIndex[highlightedIcon.currentIcon] : undefined);
	let hPreviousIcon: Icon | undefined = undefined;
	let backgroundLight: boolean = $state(localStorage.getItem('icons#background_light') !== null ? Boolean(localStorage.getItem('icons#background_light') === 'true') : !new MediaQuery('prefers-reduced-transparency', false).current);
	let currentSVG = $state('');
	let currentLoadedSVG = '';
	
	$effect(() => {
		// Prevents the container from closing immediately again, if attempted opened after an auto-close triggered by theme-switching.
		if (!highlightedIcon && iconContainerOpened !== null) iconContainerOpened = null;
		
		if (hPreviousIcon !== hCurrentIcon) {
			hPreviousIcon = hCurrentIcon;
			if (hCurrentIcon !== undefined) {
				currentSVG = 'load';
				currentLoadedSVG = hCurrentIcon.path;
				fetch(`/resources/icons/${iconType}/${hCurrentIcon.path}`).then(res => {
					if (currentSVG === '' || currentLoadedSVG !== hCurrentIcon.path) return;
					res.text().then(res => {
						if (!hCurrentIcon) {
							currentSVG = '';
							return;
						} else if (currentLoadedSVG !== hCurrentIcon.path) return;
						currentSVG = res;
					});
				});
			}
		}
	});
	
	onMount(() => {
		document?.addEventListener('DOMContentLoaded', () => isLoaded = true);
		if (document?.readyState !== 'loading') isLoaded = true;
		
		document?.addEventListener('click', (event) => {
			// Event ignored while highlight container is closed.
			if (!highlightedIcon) return;
			
			const currentTime = Date.now();
			
			// Ensuring an open-time is registered for the container, before processing events.
			if (iconContainerOpened !== null) {
				// 250ms margin of error, allowing early errors to be ignored.
				if ((currentTime - iconContainerOpened) < 250) return;
				
				let el: HTMLElement | null = event.target as HTMLElement;
				while (el !== null) {
					// Returning if expression matches, allowing certain elements to be clickable.
					if (/(overlay buttons)|(highlighted-icon)|(header-section)|(light-button)/.test(el.className)) return;
					else el = el.parentElement;
				}
				
				closeHighlightContainer();
			} else {
				iconContainerOpened = currentTime;
			}
		});
		
		document?.addEventListener('keydown', (event) => {
			// Enable closure of highlight window by pressing Escape.
			if (event.key === 'Escape' && event.isTrusted) closeHighlightContainer();
		});
	});
	
	function downloadImage(path: string, type: string, isImageSVG?: true) {
		if (!hCurrentIcon) return;
		
		const linkElement = document.createElement('a');
		
		if (isImageSVG && currentSVG !== '' && currentSVG !== 'load') {
			// Create object from the already loaded file content, rather than fetching it once more.
			const url = URL.createObjectURL(new Blob([currentSVG], { type: 'image/svg+xml' }));
			linkElement.href = url;
			setTimeout(() => URL.revokeObjectURL(url), 500);
		} else {
			linkElement.href = path;
		}
		
		linkElement.type = `image/${type}`;
		linkElement.download = path.slice(path.lastIndexOf('/') + 1);
		
		linkElement.click();
		
		sendToast?.({ message: 'Downloaded', duration: 1250, type: 'download', status: 'success' });
	}
	
	function closeHighlightContainer() {
		highlightedIcon = undefined;
		iconContainerOpened = null;
		currentSVG = '';
	}
	
	beforeNavigate(async () => {
		currentPage = 1;
		closeHighlightContainer();
		iconsOnly = false;
		logosOnly = false;
		animatedOnly = false;
		
		await tick();
	});
</script>

<svelte:head>
	<meta charset="utf-8">
	<title>{data.seo.title}</title>
	{#if data.seo.description}
		<meta name="description" content={data.seo.description} />
	{/if}
	<!--Dynamic syntax highlighting-->
	{#if theme === 'light'}
		{#await import('$lib/styles/github.min.css')}{/await}
	{:else}
		{#await import('$lib/styles/github-dark.min.css')}{/await}
	{/if}
</svelte:head>

<svg style="display: none;">
	<defs>
		<filter id="highlighted-icon-distortion-filter" x="0%" y="0%" width="200%" height="200%">
			<feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="4" seed="{Math.trunc(Date.now() / 1000000)}" result="noise" />
			<feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
			<feDisplacementMap in="SourceGraphic" in2="blurred" scale="5" xChannelSelector="R" yChannelSelector="G" />
		</filter>
		<filter id="highlighted-icon-morph-filter" color-interpolation-filters="linearRGB" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
			<feMorphology operator="dilate" radius="1 1" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" result="morphology" />
			<!--suppress HtmlUnknownAttribute - edgeMode is a legal attribute for feGaussianBlur, but is giving an error, hence the suppression -->
			<feGaussianBlur stdDeviation="0 1" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur" />
		</filter>
		<filter id="highlighted-icon-blur-filter" color-interpolation-filters="linearRGB" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
			<!--suppress HtmlUnknownAttribute - edgeMode is a legal attribute for feGaussianBlur, but is giving an error, hence the suppression -->
			<feGaussianBlur stdDeviation="1 1" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur" />
		</filter>
	</defs>
</svg>

{#if highlightedIcon !== undefined}
	{#key hCurrentIcon}
		<!--svelte-ignore a11y_positive_tabindex-->
		<div class="highlighted-icon {backgroundLight ? 'lights-on' : 'lights-off'}">
			<div style="display:contents;" inert>
				<div class="glass-effect a"></div>
				<div class="glass-effect b">
					<div class="c"></div>
				</div>
				<div class="glass-effect d">
					<div class="e"></div>
				</div>
				<div class="glass-effect f"></div>
			</div>
			<div class="h-icon">
				<!--svelte-ignore a11y_autofocus-->
				<button title="Close" class="close-button" onclick={closeHighlightContainer} tabindex="1">
					<!--suppress HtmlUnknownTag -->
					<div class="gradient" inert></div>
				</button>
				<button title="Turn lights {backgroundLight ? 'off' : 'on'}" class="light-button" onclick={() => {
					backgroundLight = !backgroundLight;
					localStorage.setItem('icons#background_light',String(backgroundLight));
				}} tabindex="2">
					{#if backgroundLight}
						<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M4 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z" />
							<path d="M12 2a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z" />
							<path d="M21 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z" />
							<path d="M4.893 4.893a1 1 0 0 1 1.32 -.083l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 0 -1.414z" />
							<path d="M17.693 4.893a1 1 0 0 1 1.497 1.32l-.083 .094l-.7 .7a1 1 0 0 1 -1.497 -1.32l.083 -.094l.7 -.7z" />
							<path d="M14 18a1 1 0 0 1 1 1a3 3 0 0 1 -6 0a1 1 0 0 1 .883 -.993l.117 -.007h4z" />
							<path d="M12 6a6 6 0 0 1 3.6 10.8a1 1 0 0 1 -.471 .192l-.129 .008h-6a1 1 0 0 1 -.6 -.2a6 6 0 0 1 3.6 -10.8z" />
						</svg>
					{:else}
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7" />
							<path in:draw={{duration: prefersReducedMotion.current ? 0 : 100}}
							      d="M11.089 7.083a5 5 0 0 1 5.826 5.84m-1.378 2.611a5.012 5.012 0 0 1 -.537 .466a3.5 3.5 0 0 0 -1 3a2 2 0 1 1 -4 0a3.5 3.5 0 0 0 -1 -3a5 5 0 0 1 -.528 -7.544" />
							<path d="M9.7 17h4.6" />
							<path in:draw={{delay: prefersReducedMotion.current ? 0 : 50, duration: prefersReducedMotion.current ? 0 : 500, easing: cubicOut}} d="M3 3l18 18" />
						</svg>
					{/if}
				</button>
				<div class="left">
					{#key hCurrentIcon?.path}
						<div class="img-fx" inert>
							<img in:fade|global={{duration: prefersReducedMotion.current ? 0 : 500}} src="/resources/icons/{iconType}/{hCurrentIcon?.path}"
							     alt={hCurrentIcon?.name} loading="lazy" />
						</div>
						<img in:fade|global={{duration: prefersReducedMotion.current ? 0 : 350}} src="/resources/icons/{iconType}/{hCurrentIcon?.path}"
						     alt={hCurrentIcon?.name} loading="lazy" inert />
					{/key}
					{#if highlightedIcon.iconIndex.length > 1}
						<div class="current-icon-index" inert>
							<p>{highlightedIcon.currentIcon + 1}/{highlightedIcon.iconIndex.length}</p>
						</div>
						<div class="actions">
							<button title="" class="element prev-icon" tabindex="2" onclick="{() => {
									currentSVG = '';
									if (!highlightedIcon) return;
									if (highlightedIcon.currentIcon > 0) highlightedIcon.currentIcon -= 1;
									else highlightedIcon.currentIcon = highlightedIcon.iconIndex.length - 1;}}">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M12 2c5.523 0 10 4.477 10 10s-4.477 10 -10 10a10 10 0 1 1 0 -20m2 13v-6a1 1 0 0 0 -1.707 -.708l-3 3a1 1 0 0 0 0 1.415l3 3a1 1 0 0 0 1.414 0l.083 -.094c.14 -.18 .21 -.396 .21 -.613" />
								</svg>
							</button>
							<button title="" class="element next-icon" tabindex="2" onclick="{() => {
									currentSVG = '';
									if (!highlightedIcon) return;
									if (highlightedIcon.currentIcon < highlightedIcon.iconIndex.length - 1) highlightedIcon.currentIcon += 1;
									else highlightedIcon.currentIcon = 0;}}">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336m-5.293 4.953a1 1 0 0 0 -1.707 .707v6c0 .217 .07 .433 .21 .613l.083 .094a1 1 0 0 0 1.414 0l3 -3a1 1 0 0 0 0 -1.414z" />
								</svg>
							</button>
						</div>
					{/if}
				</div>
				<div class="separator" inert></div>
				<div class="right">
					{#if highlightedIcon.icon.href || hCurrentIcon?.href}
						<a class="brand-external {hCurrentIcon?.name || highlightedIcon.icon.title !== highlightedIcon.icon.name ? 'top' : 'bottom'} theme-transition"
						   href={hCurrentIcon?.href ?? highlightedIcon.icon.href} rel="external" target="_blank" tabindex="2">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">
								<path
									d="M7.5 7H7C4.23858 7 2 9.23858 2 12C2 14.7614 4.23858 17 7 17H9C11.7614 17 14 14.7614 14 12M16.5 17H17C19.7614 17 22 14.7614 22 12C22 9.23858 19.7614 7 17 7H15C12.2386 7 10 9.23858 10 12" />
							</svg>
							{#if iconType === 'flags'}
								{#if ['Ukraine', 'Palestine'].includes(highlightedIcon.icon.title)}
									Show Support
								{:else if highlightedIcon.icon.title === 'Pride'}
									Learn More
								{:else}
									Visit Page
								{/if}
							{:else}
								Visit Page
							{/if}
						</a>
					{/if}
					<div class="name" tabindex="-1"
					     style="transform:translateY({!hCurrentIcon?.name && highlightedIcon.icon.title === highlightedIcon.icon.name && !hCurrentIcon?.href && !highlightedIcon.icon.href ? 1 : 0}rem)">
						{#if hCurrentIcon?.name}
							<h1 class="brand-name" tabindex="-1">{hCurrentIcon.name}</h1>
							<h3 class="icon-name" tabindex="-1">{highlightedIcon.icon.title}</h3>
						{:else if highlightedIcon.icon.title !== highlightedIcon.icon.name}
							<h1 class="brand-name" tabindex="-1">{highlightedIcon.icon.name}</h1>
							<h3 class="icon-name" tabindex="-1">{highlightedIcon.icon.title}</h3>
						{:else}
							<h1 class="brand-name" style="transform: translateY(.2rem)" tabindex="-1">{highlightedIcon.icon.title}</h1>
						{/if}
					</div>
					<div class="actions" tabindex="-1">
						<p class="added-date" tabindex="-1">Added  {moment(Date.parse(highlightedIcon.iconIndex[highlightedIcon.currentIcon]?.date_added ?? '')).calendar()}</p>
						<button class="action" tabindex="10" onclick={() => downloadImage(`/resources/icons/${iconType}/${hCurrentIcon?.path}`, 'svg+xml', true)}>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">
								<path d="M8 12L12 16M12 16L16 12M12 16V8M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" />
							</svg>
							SVG
						</button>
						<button class="action" tabindex="11" disabled={!hCurrentIcon?.png} onclick={() => downloadImage(`/resources/icons/${iconType}/png/${hCurrentIcon?.png}`, 'png')}>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">
								<path d="M8 12L12 16M12 16L16 12M12 16V8M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" />
							</svg>
							PNG
						</button>
						<button class="action" tabindex="12" disabled={!hCurrentIcon?.webp} onclick={() => downloadImage(`/resources/icons/${iconType}/webp/${hCurrentIcon?.webp}`, 'webp')}>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">
								<path d="M8 12L12 16M12 16L16 12M12 16V8M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" />
							</svg>
							WEBP
						</button>
						<button class="action" tabindex="13" disabled={!hCurrentIcon?.jpeg} onclick={() => downloadImage(`/resources/icons/${iconType}/jpeg/${hCurrentIcon?.jpeg}`, 'jpeg')}>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">
								<path d="M8 12L12 16M12 16L16 12M12 16V8M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" />
							</svg>
							JPEG
						</button>
					</div>
					<div class="svg-content select-all">
						{#if currentSVG === ''}
							<strong style="color:var(--theme-color-alert);padding:1rem;font-style:italic">Failed to load raw SVG content</strong>
						{:else if currentSVG === 'load'}
							<strong style="color:var(--theme-text-third);padding:1rem;font-style:italic">Loading...</strong>
						{:else}
							<button title="Copy" class="copy-button" tabindex="14" onclick={async () => {
								if (await copyToClipboard(currentSVG)) sendToast?.({ message: 'Copied', duration: 1250, type: 'copy', status: 'success' })
							}}>
								<!--suppress HtmlUnknownTag -->
								<div class="background"></div>
								<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M20.926 7.074a3.67 3.67 0 0 1 1.074 2.593v8.666a3.667 3.667 0 0 1 -3.667 3.667h-8.666a3.667 3.667 0 0 1 -3.667 -3.667v-8.666q 0 -.053 .005 -.102a3.66 3.66 0 0 1 3.662 -3.565h8.666c.973 0 1.905 .386 2.593 1.074" />
									<path
										d="M17.374 3.514a1 1 0 1 1 -1.748 .972c-.221 -.398 -.342 -.486 -.626 -.486h-10c-.548 0 -1 .452 -1 1v9.998c0 .36 .194 .692 .507 .87a1 1 0 1 1 -.99 1.738a3 3 0 0 1 -1.517 -2.606v-10c0 -1.652 1.348 -3 3 -3h10c1.094 0 1.828 .533 2.374 1.514" />
								</svg>
							</button>
							<pre>{@html hljs.highlight(currentSVG, { language: 'xml' }).value}</pre>
						{/if}
					</div>
					{#if highlightedIcon.iconIndex[highlightedIcon.currentIcon]?.source}
						<div class="icon-source">
							<p>Sourced from</p>
							<a href={highlightedIcon.iconIndex[highlightedIcon.currentIcon]?.source?.href} rel="external" target="_blank" tabindex="15">
								{highlightedIcon.iconIndex[highlightedIcon.currentIcon]?.source?.name}
							</a>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/key}
{/if}

<section class="icons-page">
	<section class="content-header">
		<div class="top-section flex flex-row flex-nowrap justify-between items-center">
			<div class="text">
				<h1 class="title" inert>
					{iconType === 'brands' ? 'Brand' : 'Flag'} Icons
				</h1>
				{#if iconType === 'brands'}
					<div class="subtitle">
						<span>Browse through a total of </span>
						<span class="callout">{#each data.totalAmount.toString().split('') as char}<div class="number">{char}</div>{/each}</span>
						<span> different icons & logos!</span>
					</div>
					<div class="description">
						<span>This collection is made up of</span>
						<span class="callout"> {data.iconAmount} </span>
						<span>icons, and </span>
						<span class="callout"> {data.logoAmount} </span>
						<span>logos, from</span>
						<span class="callout"> {data.entryAmount} </span>
						<span>different brands, frameworks, programming languages & more.</span><br>
						<i style="font-size:.85rem;color:var(--theme-text-fourth);">
							Icons showcased may differ, depending on the currently selected page theme, to avoid fx. showing white icons on a white page.
						</i>
					</div>
				{:else}
					<div class="subtitle">
						<span>Browse through a total of </span>
						<span class="callout">{#each data.totalAmount.toString().split('') as char}<div class="number">{char}</div>{/each}</span>
						<span> different flags!</span>
					</div>
					<div class="description">
						<span>This collection is made up of</span>
						<span class="callout"> {data.entryAmount} </span>
						<span>different countries & nations, states & de facto states, and other famous entities!</span><br>
						<span>This includes <strong>all</strong></span>
						<span class="callout"> 193 </span>
						<span>member states and</span>
						<span class="callout"> 2 </span>
						<span>general observers of the United Nations.</span>
					</div>
				{/if}
			</div>
			<GlassButton className="search-field">
				<form class="search-field" onsubmit="{(e) => {
					e.preventDefault();
					search = searchbarValue;
				}}">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M21 21L16.65 16.65M11 6C13.7614 6 16 8.23858 16 11M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" />
					</svg>
					<input type="search" id="icon-search-field" placeholder="Search..." bind:value={searchbarValue}
					       onfocusout="{(e) => search = searchbarValue}"
								 oninput="{(e) => {
									 latestSearchStateChange = Date.now();
									 if (searchbarValue.trim() === '') search = '';
									 setTimeout(() => {
										 if (search === searchbarValue || Date.now() - latestSearchStateChange < 450) return;
										 search = searchbarValue;
									 }, 500);
					}}">
				</form>
			</GlassButton>
		</div>
		<div class="actions">
			<div class="sorting">
				<GlassButton className="sort-action">
					<button type="button" class="sort-action" onclick="{() =>  {
							if (sorting !== 'alphabet') {
								sorting = 'alphabet';
								order = 'asc';
							} else {
								order = order === 'asc' ? 'desc' : 'asc';
							}
							saveCurrentSorting();
					}}">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							{#if sorting === 'alphabet'}
								{#if order === 'asc'}
									<path in:draw|global={{duration: prefersReducedMotion.current ? 0 : 350}} d="M15 10v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4" />
									<path in:draw|global={{duration: prefersReducedMotion.current ? 0 : 350}} d="M19 21h-4l4 -7h-4" />
								{:else}
									<path in:draw|global={{duration: prefersReducedMotion.current ? 0 : 350}} d="M15 21v-5c0 -1.38 .62 -2 2 -2s2 .62 2 2v5m0 -3h-4" />
									<path in:draw|global={{duration: prefersReducedMotion.current ? 0 : 350}} d="M19 10h-4l4 -7h-4" />
								{/if}
								<path d="M4 15l3 3l3 -3" />
								<path d="M7 6v12" />
							{:else}
								<path in:draw|global={{duration: prefersReducedMotion.current ? 0 : 350}} d="M16 8h4l-4 8h4" />
								<path in:draw|global={{duration: prefersReducedMotion.current ? 0 : 350}} d="M4 16v-6a2 2 0 1 1 4 0v6" />
								<path d="M4 13h4" />
								<path d="M11 12h2" />
							{/if}
						</svg>
						Name
					</button>
				</GlassButton>
				<GlassButton className="sort-action">
					<button type="button" class="sort-action" onclick="{() =>  {
							if (sorting !== 'time') {
								sorting = 'time';
								order = 'asc';
							} else {
								order = order === 'asc' ? 'desc' : 'asc';
							}
							saveCurrentSorting();
						}}">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							{#if sorting === 'time'}
								<path d="M20.984 12.535a9 9 0 1 0 -8.431 8.448" />
								<path d="M12 7v5l2.5 2.5" />
								<path d="M19 22v-6" />
								{#if order === 'asc'}
									<path in:draw|global={{duration: prefersReducedMotion.current ? 0 : 350}} d="M22 19l-3 -3l-3 3" />
								{:else}
									<path in:draw|global={{duration: prefersReducedMotion.current ? 0 : 350}} d="M22 19l-3 3l-3 -3" />
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
				</GlassButton>
				{#if sorting !== 'default'}
					<GlassButton className="sort-action">
						<button type="button" transition:fade={{duration: 325, easing: quartInOut}} title="Clear Sort Filter" class="sort-action" onclick="{() => {
							sorting = 'default';
							order = 'desc';
							saveCurrentSorting();
						}}">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M8 4h12v2.172a2 2 0 0 1 -.586 1.414l-3.914 3.914m-.5 3.5v4l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227" />
								<path d="M3 3l18 18" />
							</svg>
						</button>
					</GlassButton>
				{/if}
			</div>
			<div class="filter">
				<GlassButton className="sort-action {!(iconsOnly || logosOnly || countriesOnly || statesOnly) ? 'active' : 'inactive'}">
					<button type="button" class="sort-action {!(iconsOnly || logosOnly || countriesOnly || statesOnly) ? 'active' : 'inactive'}" onclick="{() => {
							currentPage = 1;
							iconsOnly = false;
							logosOnly = false;
							countriesOnly = false;
							statesOnly = false;
							animatedOnly = false;
						}}">All
					</button>
				</GlassButton>
				<GlassButton className="sort-action {animatedOnly ? 'active' : 'inactive'}">
					<button type="button" class="sort-action {animatedOnly ? 'active' : 'inactive'}" onclick="{() => {
							currentPage = 1;
							animatedOnly = !animatedOnly;
							}}">Animated Only
					</button>
				</GlassButton>
				{#if iconType === 'brands'}
					<GlassButton className="sort-action {iconsOnly ? 'active' : 'inactive'}">
						<button type="button" class="sort-action {iconsOnly ? 'active' : 'inactive'}" onclick="{() => {
							currentPage = 1;
							iconsOnly = !iconsOnly;
							if (iconsOnly) logosOnly = false;
							}}">Icons Only
						</button>
					</GlassButton>
					<GlassButton className="sort-action {logosOnly ? 'active' : 'inactive'}">
						<button type="button" class="sort-action {logosOnly ? 'active' : 'inactive'}" onclick="{() => {
							currentPage = 1;
							logosOnly = !logosOnly;
							if (logosOnly) iconsOnly = false;
							}}">Logos Only
						</button>
					</GlassButton>
				{:else if iconType === 'flags'}
					<GlassButton className="sort-action {countriesOnly ? 'active' : 'inactive'}">
						<button type="button" class="sort-action {countriesOnly ? 'active' : 'inactive'}" onclick="{() => {
							currentPage = 1;
							countriesOnly = !countriesOnly;
							if (countriesOnly) statesOnly = false;
							}}">Countries Only
						</button>
					</GlassButton>
					<GlassButton className="sort-action {statesOnly ? 'active' : 'inactive'}">
						<button type="button" class="sort-action {statesOnly ? 'active' : 'inactive'}" onclick="{() => {
							currentPage = 1;
							statesOnly = !statesOnly;
							if (statesOnly) countriesOnly = false;
							}}">States Only
						</button>
					</GlassButton>
				{/if}
			</div>
		</div>
	</section>
	
	<section class="brand-icons-sec" style:--current-width={Math.min(1920, innerWidth.current ?? 1920) + 'px'} style:--column-amount={columnAmount} style:--row-amount={rowAmount}>
		{#if noSearchResult}
			<div class="failed-search">
				<h3>Sorry! We couldn't find what you were looking for...</h3>
				{#key search}
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<g>
							<path in:draw|global={{duration: 750, easing: cubicOut}} d="M14.986 3.51a9 9 0 1 0 1.514 16.284c2.489 -1.437 4.181 -3.978 4.5 -6.794" />
							<path in:draw|global={{duration: 750, easing: cubicOut}} d="M10 10h.01" />
							<path in:draw|global={{duration: 750, easing: cubicOut}} d="M14 8h.01" />
							<path in:draw|global={{duration: 750, easing: cubicOut}} d="M12 15c1 -1.333 2 -2 3 -2">
								<animateTransform attributeName="transform" attributeType="XML" dur="5s" keyTimes="0; 0.05; 0.2; 1" repeatCount="indefinite" type="rotate" values="0; 0; 2; 0" />
							</path>
							<path in:draw|global={{duration: 750, easing: cubicOut}} d="M20 9v.01" />
							<path in:draw|global={{duration: 750, easing: cubicOut}} d="M20 6a2.003 2.003 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483">
								<animateTransform attributeName="transform" attributeType="XML" dur="4s" keyTimes="0; 0.05; 0.1; 1" repeatCount="indefinite" type="rotate" values="0; 1.25; 0; 0" />
							</path>
							<animateTransform attributeName="transform" attributeType="XML" dur="5s" keyTimes="0; 0.2; 0.5; 0.8; 1" repeatCount="indefinite" type="rotate"
							                  values="0; 3; 0; -3; 0" />
						</g>
					</svg>
				{/key}
			</div>
		{/if}
		
		<div class="icons" style="row-gap:calc(((var(--current-width) - 12rem) / var(--column-amount)) - 7.5rem);grid-template-columns: repeat(var(--column-amount), 7rem);">
			{#if !noSearchResult}
				{#each currentIcons as icon (icon)}
					{#if typeof icon === 'number'}
						<div class="icon blank {isLoaded ? 'loaded' : 'loading'}" inert></div>
					{:else}
						<BrandIconComponent type={iconType} bind:highlightedIcon bind:theme icon={icon} />
					{/if}
				{/each}
			{/if}
		</div>
	</section>
	
	<div class="pagination-actions" style="{noSearchResult ? 'display:none' : ''}">
		<GlassButton className="action pagination {currentPage > 3 ? '' : 'hide'}">
			<button title="First Page" class="action {currentPage > 3 ? 'shown' : 'hidden'}" onclick="{() => currentPage = 1}" tabindex="{currentPage > 3 ? 0 : -1}">1</button>
		</GlassButton>
		<div class="separator {currentPage > 3 ? 'shown' : 'hidden'}" inert>
			<div class="circle"></div>
			<div class="circle"></div>
			<div class="circle"></div>
		</div>
		<GlassButton className="action pagination {currentPage > 2 ? '' : 'hide'}">
			<button class="action pagination {currentPage > 2 ? 'shown' : 'hidden'}" onclick="{() => currentPage -= 2}"
			        tabindex="{currentPage > 2 ? 0 : -1}">{currentPage > 2 ? currentPage - 2 : ' '}</button>
		</GlassButton>
		<GlassButton className="action pagination {currentPage > 1 ? '' : 'hide'}">
			<button class="action pagination {currentPage > 1 ? 'shown' : 'hidden'}" onclick="{() => currentPage--}"
			        tabindex="{currentPage > 1 ? 0 : -1}">{currentPage > 1 ? currentPage - 1 : ' '}</button>
		</GlassButton>
		<GlassButton className="action current-page">
			<p class="action current-page" inert>{currentPage}</p>
		</GlassButton>
		<GlassButton className="action pagination {currentPage < maxPage ? '' : 'hide'}">
			<button class="action pagination {currentPage < maxPage ? 'shown' : 'hidden'}" onclick="{() => currentPage++}"
			        tabindex="{currentPage < maxPage ? 0 : -1}">{currentPage < maxPage ? currentPage + 1 : ' '}</button>
		</GlassButton>
		<GlassButton className="action pagination {(currentPage + 1) < maxPage ? '' : 'hide'}">
			<button class="action pagination {(currentPage + 1) < maxPage ? 'shown' : 'hidden'}" onclick="{() => currentPage += 2}"
			        tabindex="{(currentPage + 1) < maxPage ? 0 : -1}">{(currentPage + 1) < maxPage ? currentPage + 2 : ' '}</button>
		</GlassButton>
		<div class="separator {(currentPage + 2) < maxPage ? 'shown' : 'hidden'}" inert>
			<div class="circle"></div>
			<div class="circle"></div>
			<div class="circle"></div>
		</div>
		<GlassButton className="action pagination {(currentPage + 2) < maxPage ? '' : 'hide'}">
			<button title="Last Page" class="action pagination {(currentPage + 2) < maxPage ? 'shown' : 'hidden'}" onclick="{() => currentPage = maxPage}"
			        tabindex="{(currentPage + 2) < maxPage ? 0 : -1}">{maxPage}</button>
		</GlassButton>
		<GlassButton className="item-amount">
			<button class="item-amount" onclick={() => {
							if (currentPage !== 1) currentPage = 1;
							if (pagOffset === 24) pagOffset = 96;
							else if (pagOffset === 48) pagOffset = 24;
							else pagOffset = 48;
							localStorage.setItem('icons#pagination_offset',String(pagOffset))}}>
				Items: {pagOffset}
			</button>
		</GlassButton>
	</div>
	
	<div class="resource-info">
		<h1 class="title">
			Good to know
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
				<path
					d="M8.99962 14C8.99962 14 10.3121 15.5 12.4996 15.5C14.6871 15.5 15.9996 14 15.9996 14M15.2496 9H15.2596M9.74962 9H9.75962M12.4996 20C17.194 20 20.9996 16.1944 20.9996 11.5C20.9996 6.80558 17.194 3 12.4996 3C7.8052 3 3.99962 6.80558 3.99962 11.5C3.99962 12.45 4.15547 13.3636 4.443 14.2166C4.55119 14.5376 4.60529 14.6981 4.61505 14.8214C4.62469 14.9432 4.6174 15.0286 4.58728 15.1469C4.55677 15.2668 4.48942 15.3915 4.35472 15.6408L2.71906 18.6684C2.48575 19.1002 2.36909 19.3161 2.3952 19.4828C2.41794 19.6279 2.50337 19.7557 2.6288 19.8322C2.7728 19.9201 3.01692 19.8948 3.50517 19.8444L8.62619 19.315C8.78127 19.299 8.85881 19.291 8.92949 19.2937C8.999 19.2963 9.04807 19.3029 9.11586 19.3185C9.18478 19.3344 9.27145 19.3678 9.44478 19.4345C10.3928 19.7998 11.4228 20 12.4996 20ZM15.7496 9C15.7496 9.27614 15.5258 9.5 15.2496 9.5C14.9735 9.5 14.7496 9.27614 14.7496 9C14.7496 8.72386 14.9735 8.5 15.2496 8.5C15.5258 8.5 15.7496 8.72386 15.7496 9ZM10.2496 9C10.2496 9.27614 10.0258 9.5 9.74962 9.5C9.47348 9.5 9.24962 9.27614 9.24962 9C9.24962 8.72386 9.47348 8.5 9.74962 8.5C10.0258 8.5 10.2496 8.72386 10.2496 9Z" />
			</svg>
		</h1>
		<div class="subtitle">
			<ul>
				<li>
					All SVGs are manually cleaned up and optimized, before being showcased. This is done for 2 reasons:<br>
					Ensuring no SVGs overlap and conflict due to having attributes with matching names, and for a hope of minimizing the amount of redundant data being transferred across the internet.
				</li>
				<li>
					Inlining an SVG? Remove these attributes! Browsers do not need these attributes when rendering SVGs that are inlined directly in the html, so they can be safely omitted.
					<ul>
						<li>
							xmlns | Fx. xmlns="http://www.w3.org/2000/svg"
						</li>
						<li>
							version | Fx. version="1.1"
						</li>
					</ul>
				</li>
				<li>
					All <strong>PNG</strong>, <strong>WEBP</strong> and <strong>JPEG</strong> images have a minimum width/height of 1000px.
				</li>
			</ul>
		</div>
	</div>
</section>

<style>
	/* Desktop & Tablet */
	@media (width >= 44rem) {
		.icons-page {
			padding-top: 4rem;
		}
		
		.brand-icons-sec {
			height: calc(((((var(--current-width) - 12rem) / var(--column-amount)) - 7rem) * (var(--row-amount) - 1)) + (var(--row-amount) * 8.25rem)) !important;
			
			.icons {
				justify-content: space-between;
			}
		}
		
		.pagination-actions {
			width: 100%;
			gap:   .5rem;
		}
		
		.content-header {
			padding-bottom: 1rem;
			
			.text {
				padding: 0 1rem;
				
				.title {
					font-size:  3.25rem;
					width:      fit-content;
					height:     fit-content;
					padding:    .5rem 0;
					box-sizing: content-box;
				}
				
				.subtitle {
					font-size: 1.05rem;
				}
				
				.description {
					font-size: .95rem;
				}
			}
			
			.top-section {
				padding-right: 1rem;
			}
			
			.actions {
				flex-flow:       row nowrap;
				align-items:     flex-end;
				justify-content: space-between;
				gap:             .5rem;
				
				padding:         0 1rem;
			}
		}
		
		.resource-info {
			.title {
				font-size: 2rem;
			}
			
			.subtitle {
				font-size: 1.05rem;
			}
			
			.subtitle {
				font-size: .95rem;
				
				ul li ul li {
					white-space:         pre;
					font-size:           .85rem;
					list-style-position: inside;
				}
			}
		}
	}
	
	/* Phone */
	@media (width < 44rem) {
		:global(.main-container) {
			padding: 3rem calc(50vw - 10rem) 0 calc(50vw - 10rem) !important;
		}
		
		.brand-icons-sec .icons {
			grid-template-columns: repeat(3, 7rem) !important;
			justify-content:       center;
			column-gap:            .75rem;
			height:                fit-content;
			margin-top:            2rem;
			
			:global .icon {
				margin-bottom: 1rem;
			}
		}
		
		.pagination-actions {
			position: absolute;
			left:     -5rem;
			width:    100vw;
			gap:      .75rem;
			
			.action {
				width:  fit-content;
				height: fit-content;
			}
			
			.item-amount, .separator, .action:first-child, .action:nth-child(3), .action:nth-child(7), .action:nth-child(9) {
				visibility: hidden !important;
				position:   fixed;
			}
		}
		
		:global {
			.blur-container, .blur-container .blur-child {
				visibility: hidden !important;
				position:   fixed;
			}
		}
		
		.content-header {
			.text {
				.title {
					font-size: 2rem;
				}
				
				.description {
					font-size: 0.8rem;
				}
			}
			
			.actions {
				flex-flow:       column wrap;
				align-items:     center;
				justify-content: space-between;
				margin-top:      1rem;
				
				max-width:       100%;
				
				.sorting {
					flex-flow: row wrap;
				}
			}
		}
		
		.resource-info {
			.title {
				font-size: 1.75rem;
			}
			
			.subtitle {
				font-size:   .95rem;
				line-height: 1.25;
				
				ul {
					width:       115%;
					margin-left: -.5rem;
				}
				
				ul li {
					text-wrap: pretty;
					width:     fit-content !important;
					
					ul {
						width:               fit-content !important;
						font-size:           .8rem;
						list-style-position: outside;
						margin-left:         -.5rem;
						
						li:first-child {
							margin-bottom: .25rem;
						}
					}
				}
			}
		}
	}
	
	/* Phone */
	@media (width <= 375px) {
		:global(.main-container) {
			padding: 3rem calc(50vw - 8rem) 0 calc(50vw - 8rem) !important;
		}
		
		.brand-icons-sec .icons {
			grid-template-columns: repeat(2, 7rem) !important;
		}
	}
	
	@media (prefers-reduced-transparency: reduce) {
		.highlighted-icon {
			.h-icon {
				background:      var(--theme-ui-header) !important;
				backdrop-filter: none !important;
			}
		}
	}
	
	.search-field :global .search-field {
		position: relative !important;
		z-index:  1000 !important;
	}
	
	.icons-page {
		max-width: 1600px;
		margin:    0 auto;
	}
	
	:global .main-container.dark {
		.highlighted-icon {
			&.lights-on {
				background-color:           rgb(17 18 23 / .3) !important;
				transition-duration:        300ms !important;
				transition-timing-function: linear(0, 0.151 8.1%, 0.223 11.7%, 0.304 15.2%, 0.392 18.4%, 0.497 21.6%, 0.619 24.8%, 0.752 27.9%, 0.999 33.3%, 0.842 37.1%, 0.79 38.6%, 0.748 40%, 0.714 41.4%, 0.691 42.7%, 0.677 44%, 0.673 44.7%, 0.672 45.3%, 0.676 46.5%, 0.69 47.8%, 0.712 49.1%, 0.743 50.4%, 0.824 53%, 0.999 57.7%, 0.927 60%, 0.883 61.8%, 0.867 62.7%, 0.856 63.6%, 0.85 64.4%, 0.848 65.3%, 0.849 66.1%, 0.855 67%, 0.865 67.9%, 0.879 68.8%, 0.911 70.5%, 0.999 74.5%, 0.97 76.2%, 0.953 77.5%, 0.943 78.8%, 0.94 80.2%, 0.942 81.4%, 0.95 82.7%, 0.989 86.9%, 1 88.2%, 0.99 90%, 0.987 91.9%, 0.989 93.5%, 0.998 97.5%, 1) !important;
			}
			
			&.lights-off {
				background-color: rgb(17 18 23 / .95) !important;
			}
			
			.h-icon {
				background: linear-gradient(to bottom, rgb(17 18 23 / .6) 0%, rgb(17 18 23 / .8) 35%, rgb(17 18 23 / .95) 100%);
			}
			
			.glass-effect.b {
				mask-image: linear-gradient(55deg, black 0%, transparent 35%, transparent 65%, black 100%), linear-gradient(15deg, black 0%, transparent 35%, transparent 100%) !important;
			}
			
			.c {
				border-color: rgb(244 248 252 / .65) !important;
			}
			
			.e {
				border-color: rgb(55 72 86 / .15) !important;
			}
		}
	}
	
	.highlighted-icon {
		position:        fixed;
		bottom:          0;
		right:           0;
		
		display:         flex;
		align-items:     center;
		justify-content: center;
		
		width:           100vw;
		height:          calc(100vh - var(--header-height));
		
		pointer-events:  none;
		z-index:         50000;
		
		&.lights-on {
			background-color: rgb(247 249 252 / .3);
			transition:       background-color var(--theme-transition-single-off);
		}
		
		&.lights-off {
			background-color: rgb(247 249 252 / .95);
			transition:       background-color var(--theme-transition-single-on);
		}
		
		.glass-effect {
			position:      absolute;
			width:         80vw;
			height:        60vh;
			max-width:     80rem;
			max-height:    32rem;
			
			z-index:       40000;
			border-radius: .9rem;
			
			&.a {
				backdrop-filter: url('#highlighted-icon-distortion-filter') brightness(1.1) saturate(1.35) contrast(1.0025) url('#highlighted-icon-blur-filter') blur(4px);
				z-index:         40000 !important;
			}
			
			&.f {
				overflow:         hidden;
				
				background-color: rgb(236 242 245 / .04);
				mask-image:       linear-gradient(30deg, transparent 0%, black 100%), linear-gradient(to top, transparent 0%, rgb(0 0 0 / .5) 100%);
				
				z-index:          39990 !important;
			}
			
			&.b, &.d {
				mask-type: alpha;
				filter:    blur(4px);
				
				.c, .e {
					position:      relative;
					width:         inherit;
					height:        inherit;
					max-width:     inherit;
					max-height:    inherit;
					border-radius: inherit;
				}
			}
			
			&.b {
				mask-image: linear-gradient(55deg, transparent 0%, black 35%, black 65%, transparent 100%), linear-gradient(15deg, transparent 0%, black 35%, black 100%);
				
				.c {
					border: .25rem solid rgb(55 72 86 / .45);
				}
			}
			
			&.d {
				mask-image: linear-gradient(55deg, transparent 0%, black 35%, black 65%, transparent 100%), linear-gradient(15deg, transparent 0%, black 35%, black 100%);
				
				.e {
					border: .25rem solid rgb(244 248 252 / .15);
				}
			}
		}
		
		.h-icon {
			position:        absolute;
			
			display:         flex;
			flex-flow:       row nowrap;
			align-items:     center;
			justify-content: space-between;
			
			overflow:        hidden !important;
			
			width:           80vw;
			height:          60vh;
			max-width:       80rem;
			max-height:      32rem;
			
			background:      linear-gradient(to bottom, rgb(247 249 252 / .3) 0%, rgb(247 249 252 / .6) 100%);
			border-radius:   .9rem;
			
			pointer-events:  all;
			
			z-index:         49999;
			
			.light-button, .close-button {
				position: absolute;
				top:      1rem;
			}
			
			.light-button {
				left: 1rem;
				
				&:hover svg {
					color:      var(--theme-ui-icon-highlight);
					
					transition: color var(--theme-transition-single-on);
				}
				
				svg {
					width:          1.55rem;
					height:         1.55rem;
					
					color:          var(--theme-ui-icon);
					pointer-events: none;
					
					transition:     color var(--theme-transition-single-off);
				}
			}
			
			.close-button {
				right:         1rem;
				overflow:      hidden;
				
				width:         .975rem;
				height:        .975rem;
				
				background:    rgba(from var(--theme-color-alert) r g b / .2);
				border-radius: 100%;
				
				cursor:        pointer;
				
				z-index:       500;
				
				.gradient {
					width:            100%;
					height:           100%;
					background-image: radial-gradient(circle, transparent 5%, rgba(from var(--theme-color-alert) r g b / .2) 70%, var(--theme-color-alert) 100%);
					mix-blend-mode:   soft-light !important;
					
					z-index:          500;
				}
				
				&::before {
					position:       absolute;
					width:          100%;
					height:         100%;
					left:           0;
					
					content:        '';
					
					opacity:        .16;
					background:     radial-gradient(circle at .45rem .55rem, rgba(from var(--theme-color-alert) r g b / .25) 0%, transparent 40%, white 100%);
					mix-blend-mode: overlay !important;
					
					z-index:        1000 !important;
				}
				
				&:hover {
					background:          rgb(255 29 29 / .45);
					filter:              drop-shadow(0 0 .65rem rgb(255 29 29 / .45));
					transition-duration: 0s !important;
					
					.gradient {
						background-image:    radial-gradient(circle, transparent 12.5%, rgba(from var(--theme-color-alert) r g b / .4) 70%, var(--theme-color-alert) 100%);
						opacity:             .85;
						
						transition-duration: 0s !important;
					}
					
					&::before {
						transform:           rotate(15deg);
						opacity:             1;
						transition-duration: 0s !important;
					}
				}
			}
			
			.right, .left {
				display:         flex;
				flex-flow:       column nowrap;
				justify-content: center;
				padding:         2rem;
				
				z-index:         500;
			}
			
			.separator {
				width:           4px;
				border-radius:   1rem;
				height:          40%;
				backdrop-filter: blur(1rem) brightness(1.15) saturate(1.25) contrast(.975);
				mix-blend-mode:  overlay;
				
				z-index:         500;
			}
			
			.right {
				width:       60%;
				align-items: flex-start;
			}
			
			.left {
				width:            40%;
				align-items:      center;
				padding:          2rem;
				background-color: transparent;
				
				.img-fx {
					position:          absolute;
					transform:         scale(4);
					width:             100%;
					height:            fit-content;
					mask-image:        radial-gradient(farthest-corner at 40px 40px, transparent 5%, white 100%);
					
					user-select:       none !important;
					-webkit-user-drag: none !important;
					pointer-events:    none !important;
					
					img {
						position:     relative;
						
						
						width:        100%;
						height:       100%;
						max-height:   14rem;
						aspect-ratio: 1;
						
						filter:       blur(1rem);
						mask-image:   linear-gradient(to top, white 0%, transparent 80%);
						
						z-index:      1 !important;
						
						opacity:      .35;
					}
				}
				
				img {
					width:             100%;
					height:            100%;
					max-height:        14rem;
					aspect-ratio:      1;
					
					user-select:       none !important;
					-webkit-user-drag: none !important;
					pointer-events:    none !important;
					
					z-index:           500 !important;
				}
				
				.current-icon-index {
					position:    relative;
					width:       90%;
					user-select: none;
					
					p {
						position:    absolute;
						right:       0;
						top:         0;
						
						color:       var(--theme-text-secondary);
						font-weight: 600;
					}
				}
				
				.actions {
					margin-top:     -2.25rem;
					height:         2rem;
					transform:      translateY(3.5rem);
					
					pointer-events: all;
					user-select:    none;
					
					.prev-icon, .next-icon {
						cursor:  pointer;
						
						z-index: 500 !important;
					}
				}
			}
			
			.right {
				.name {
					display:         flex;
					flex-flow:       column nowrap;
					align-items:     flex-start;
					justify-content: flex-start;
					height:          4.35rem;
					
					.brand-name {
						font-size: 2.25rem;
						height:    2.5rem;
					}
					
					.icon-name {
						font-size:   1.1rem;
						font-weight: 450;
						color:       var(--theme-text-secondary);
						padding-top: .1rem;
					}
					
					z-index:         500 !important;
				}
				
				.brand-external {
					display:         flex;
					flex-flow:       row nowrap;
					align-items:     center;
					justify-content: center;
					gap:             .1rem;
					
					font-size:       .75rem;
					color:           color-mix(var(--theme-text-third) 25%, var(--theme-text-fourth) 75%);
					font-weight:     700;
					
					user-select:     none;
					
					z-index:         510 !important;
					
					&.top {
						transform: translateY(.8rem);
					}
					
					&.bottom {
						transform: translateY(4.1rem);
					}
					
					svg {
						color:     inherit;
						transform: rotate(-45deg);
						width:     .85rem;
						height:    .85rem;
					}
					
					&:hover {
						text-decoration: underline;
						color:           var(--theme-color-accent);
						
						svg {
							color: var(--theme-color-accent);
						}
					}
				}
				
				.actions {
					display:         flex;
					flex-flow:       row nowrap;
					align-items:     center;
					justify-content: flex-start;
					gap:             .25rem;
					width:           100%;
					
					margin-bottom:   .4rem;
					
					z-index:         500 !important;
					
					user-select:     none;
					
					.action {
						display:         flex;
						flex-flow:       row nowrap;
						align-items:     center;
						justify-content: center;
						gap:             .25rem;
						
						padding:         .3rem .6rem .15rem .6rem;
						
						font-size:       .8rem;
						font-weight:     700;
						
						color:           var(--theme-ui-white);
						border:          1px solid rgba(from var(--theme-ui-line) r g b / .5);
						border-radius:   .6rem;
						background:      light-dark(#5E70F1, #343D79);
						
						user-select:     none;
						cursor:          pointer;
						
						svg {
							height:        .975rem;
							width:         .975rem;
							color:         var(--theme-ui-white);
							margin-bottom: .1rem;
						}
						
						&[disabled] {
							color:  var(--theme-text-third) !important;
							filter: grayscale(1);
							cursor: no-drop;
							
							svg {
								color: var(--theme-text-third);
							}
							
							&:hover {
								background: light-dark(#5E70F1, #343D79);
							}
						}
						
						&:hover {
							background: light-dark(#364EF3, #3F498F);
						}
					}
					
					.added-date {
						position:      absolute;
						right:         0;
						align-self:    flex-end !important;
						
						transform:     translateY(.25rem);
						padding-right: 2.5rem;
						
						color:         var(--theme-text-fourth);
						font-size:     .725rem;
						font-weight:   550;
						
						user-select:   none;
					}
				}
				
				.svg-content {
					width:         100%;
					height:        fit-content;
					height:        10rem;
					box-sizing:    border-box;
					
					background:    rgba(from var(--theme-ui-header) r g b / .8);
					border:        1px solid rgba(from var(--theme-ui-line) r g b / .5);
					border-radius: .5rem;
					
					overflow:      scroll;
					font-family:   'JetBrainsMono', monospace;
					font-size:     .85rem;
					font-weight:   500;
					padding:       .75rem 1rem;
					
					z-index:       500 !important;
					
					:global(span) {
						white-space: preserve-spaces;
						text-wrap:   nowrap;
						
						&.hljs-tag {
							white-space: preserve;
							text-wrap:   nowrap;
						}
					}
					
					.copy-button {
						position: absolute;
						right:    3rem;
						padding:  .35rem;
						
						cursor:   pointer;
						z-index:  1000 !important;
						
						svg {
							position: relative;
							color:    var(--theme-ui-white);
							
							z-index:  1500 !important;
						}
						
						.background {
							position:        absolute;
							top:             0;
							left:            0;
							width:           100%;
							height:          100%;
							
							backdrop-filter: blur(2px) grayscale(.1);
							background:      rgba(from var(--theme-ui-black) r g b / .2);
							border-radius:   .5rem;
							
							z-index:         500 !important;
						}
						
						&:hover {
							svg {
								color: var(--theme-color-accent);
							}
							
							.background {
								background: rgba(from var(--theme-ui-header) r g b / .65);
							}
						}
					}
					
					&::selection {
						background-color: rgba(from var(--theme-color-accent) r g b / .2);
					}
				}
				
				.icon-source {
					display:      flex;
					flex-flow:    row nowrap;
					gap:          .2rem;
					
					padding-left: .5rem;
					padding-top:  .35rem;
					
					font-size:    .8rem;
					
					user-select:  none;
					
					z-index:      500 !important;
					
					p, a {
						color: light-dark(var(--theme-text-third), var(--theme-text-fourth));
					}
					
					a {
						font-weight: bold;
						
						&:hover {
							text-decoration: underline;
							color:           var(--theme-color-accent) !important;
						}
					}
				}
			}
		}
	}
	
	.brand-icons-sec {
		position:    relative;
		user-select: none;
		
		.failed-search {
			display:         flex;
			align-items:     center;
			justify-content: center;
			gap:             .25rem;
			
			width:           100%;
			height:          inherit;
			box-sizing:      content-box;
			
			font-size:       1.25rem;
			font-weight:     450;
			text-wrap:       pretty;
			
			h3 {
				color: var(--theme-text-secondary) !important;
			}
			
			svg {
				height: 2rem;
				width:  2rem;
				
				color:  var(--theme-text-secondary);
			}
		}
		
		.icons {
			display: grid;
			
			.icon.blank {
				position:          relative;
				display:           flex;
				align-items:       center;
				justify-content:   center;
				
				width:             7rem;
				height:            7rem;
				overflow:          visible;
				
				padding:           .35rem;
				margin-bottom:     1.25rem;
				
				border:            1px solid transparent;
				border-radius:     .75rem;
				
				pointer-events:    none;
				user-select:       none !important;
				-webkit-user-drag: none !important;
				
				z-index:           5000 !important;
				
				&.loaded {
					display: none;
				}
				
				&.loading {
					animation: IconLoadingAnim 1.35s infinite cubic-bezier(0.78, 0, 0.22, 1) 115ms;
				}
			}
		}
	}
	
	.pagination-actions {
		position:        relative;
		
		display:         flex;
		flex-flow:       row nowrap;
		align-items:     center;
		justify-content: center;
		
		margin-top:      1.75rem;
		
		user-select:     none !important;
		
		.separator {
			display:         flex;
			flex-flow:       row nowrap;
			align-items:     flex-end;
			justify-content: center;
			gap:             .15rem;
			height:          2.5rem;
			width:           2rem;
			
			&.shown {
				opacity:    1;
				transition: 125ms ease-out;
			}
			
			&.hidden {
				opacity:    0;
				transition: 75ms ease-in;
			}
			
			.circle {
				mask-image:       linear-gradient(135deg, transparent 10%, black 90%);
				mask-type:        alpha;
				
				background-image: radial-gradient(ellipse 52.5% 52.5% at center, #FFFFFF11 27.5%, #FFFFFFAA 72.5%, #FFFFFFAA 77.5%, #FFFFFF22 100%);
				border-radius:    100%;
				width:            8px;
				height:           8px;
				
				z-index:          10;
				
				&::after {
					content:          '';
					position:         absolute;
					
					mask-image:       linear-gradient(-45deg, transparent 10%, black 90%);
					mask-type:        alpha;
					
					background-image: radial-gradient(ellipse 52.5% 52.5% at center, transparent 27.5%, #000000AA 72.5%, #000000AA 77.5%, transparent 100%);
					border-radius:    100%;
					width:            8px;
					height:           8px;
					
					z-index:          15;
				}
			}
		}
		
		.action.pagination, :global .action.pagination {
			position:      relative !important;
			width:         3rem;
			height:        3rem;
			
			border-radius: .9rem;
			
			transition:    var(--theme-transition-off);
			
			&.shown {
				opacity: 1;
			}
			
			&.hidden {
				opacity: 0;
			}
			
			&:hover {
				transform:  scale(1.035);
				filter:     brightness(1.15);
				transition: var(--theme-transition-on);
			}
			
			&:active {
				transform: scale(.99) !important;
			}
		}
		
		.action.current-page, :global .current-page {
			transform:     scale(1.125);
			position:      relative !important;
			width:         3rem;
			height:        3rem;
			border-radius: .9rem;
		}
		
		.action {
			display:         flex;
			align-items:     center;
			justify-content: center;
			width:           3rem;
			height:          3rem;
			
			font-family:     'Bricolage Grotesque Variable', sans-serif;
			font-size:       1.35rem;
			font-weight:     900;
			
			border-radius:   .9rem;
			
			&.shown {
				opacity: 1;
				
				&:hover {
					transform: scale(1.035);
				}
				
				&:active {
					transform: scale(.99);
				}
			}
			
			&.hidden {
				opacity:        0;
				pointer-events: none !important;
			}
			
			&.current-page {
				position: relative !important;
			}
		}
		
		:global .item-amount {
			position:      absolute;
			right:         0;
			
			width:         6.25rem;
			height:        2.5rem;
			
			font-weight:   600;
			
			border-radius: .9rem;
			
			transition:    var(--theme-transition-off);
			
			&:hover {
				filter:     brightness(1.15);
				
				transition: var(--theme-transition-on);
			}
		}
	}
	
	.content-header {
		display:         flex;
		flex-flow:       column nowrap;
		justify-content: flex-start;
		
		height:          fit-content;
		width:           100%;
		
		z-index:         500;
		
		.text {
			padding-bottom: 1.5rem;
			z-index:        500;
			
			.title {
				background-image: var(--theme-text-gradient);
				background-clip:  text;
				color:            transparent;
				height:           4rem;
				overflow:         visible;
			}
			
			.subtitle, .description {
				text-wrap:   pretty;
				font-family: 'Geologica', sans-serif;
			}
			
			.subtitle {
				cursor: default;
			}
			
			.subtitle span {
				font-weight: 600;
				
				cursor:      default;
				
				&.callout {
					box-sizing:  content-box;
					height:      fit-content;
					
					padding:     .025rem .125rem;
					
					background:  color-mix(var(--theme-color-accent) 80%, var(--theme-ui-white) 20%);
					
					font-weight: 900;
					color:       var(--theme-ui-white);
					
					.number {
						display:    inline-flex;
						
						width:      fit-content;
						padding:    0 .025rem;
						
						transition: 255ms 225ms ease-in;
						
						z-index:    100;
						
						&:hover {
							transform:  scale(1.25) rotate(2deg);
							transition: 50ms ease-out;
							z-index:    200;
						}
					}
				}
			}
			
			.description {
				margin-top: 1.25rem;
				
				span {
					font-weight: 500;
					color:       var(--theme-text-third);
					
					&.callout {
						color: color-mix(var(--theme-color-accent) 80%, var(--theme-ui-white) 20%);
					}
				}
			}
		}
		
		&::before {
			content:          '';
			position:         absolute;
			mix-blend-mode:   soft-light;
			
			top:              -7.5vh;
			right:            -10vw;
			width:            120vw;
			height:           40vh;
			
			background-image: linear-gradient(to bottom, rgba(from var(--theme-color-primary) r g b / .25) 0%, transparent 100%);
			transform:        rotate(3deg);
			filter:           blur(6rem);
			
			z-index:          1;
		}
		
		.search-field, :global .search-field {
			position:      relative !important;
			border-radius: .9rem;
			
			svg {
				position:  absolute;
				height:    1.25rem;
				width:     1.25rem;
				
				color:     var(--theme-text-third);
				
				transform: translate(.675rem, .6rem);
			}
			
			input {
				font-family: 'Geologica', 'Google Sans', sans-serif;
				font-weight: 500;
				color:       var(--theme-text-third);
				
				padding:     .5rem 1rem .5rem 2.25rem;
				
				&:hover {
					backdrop-filter: brightness(.5);
					color:           var(--theme-text-secondary);
				}
				
				&:focus {
					backdrop-filter: brightness(.9);
					color:           var(--theme-text-primary);
				}
				
				&:hover, &:active, &:focus {
					box-shadow: none;
					outline:    none;
				}
			}
			
			z-index:       999;
		}
		
		.actions {
			display:     flex;
			
			padding-top: 1rem;
			
			width:       100%;
			
			z-index:     500;
			
			.sorting, .filter {
				display:         flex;
				flex-flow:       row nowrap;
				align-items:     center;
				justify-content: flex-end;
				gap:             .5rem;
			}
			
			.sort-action, :global .sort-action {
				position:        relative !important;
				
				display:         flex;
				align-items:     center;
				justify-content: center;
				gap:             .25rem;
				
				padding:         .3rem .45rem .3rem .25rem;
				border-radius:   .9rem;
				
				font-size:       .925rem;
				font-weight:     800;
				text-wrap:       nowrap;
				
				cursor:          pointer;
				
				z-index:         999;
				
				transition:      var(--theme-transition-off);
				
				svg {
					width:  1.35rem;
					height: 1.35rem;
				}
				
				&:hover {
					transform:  scale(1.025);
					filter:     brightness(1.15);
					transition: var(--theme-transition-on);
				}
				
				&:active {
					transform: scale(.975);
				}
				
				&.inactive {
					filter:  grayscale(.75);
					opacity: .5;
				}
				
				& > div {
					top:  0;
					left: 0;
				}
			}
		}
	}
	
	.resource-info {
		margin-top: 2.5rem;
		
		.title {
			display:         flex;
			flex-flow:       row nowrap;
			align-items:     center;
			justify-content: flex-start;
			gap:             .25rem;
			padding:         .5rem 0;
			margin-left:     .25rem;
			
			user-select:     none;
			
			svg {
				width:      1.85rem;
				height:     1.85rem;
				transform:  translateX(0) translateY(.15rem) scale(1) rotate(12.5deg);
				
				transition: color 150ms 400ms ease,
				            transform 600ms 500ms linear(0, 0.291 2.7%, 0.544 5.5%, 0.761 8.4%, 0.947 11.5%, 1.027 13.1%, 1.096 14.7%, 1.16 16.4%, 1.213 18.1%, 1.26 19.9%, 1.298 21.7%, 1.329 23.6%,
					1.352 25.5%, 1.363 26.8%, 1.372 28.2%, 1.377 29.6%, 1.379 31.1%, 1.378 32.6%, 1.374 34.2%, 1.367 35.9%, 1.357 37.6%, 1.337 40.4%, 1.307 43.7%, 1.176 56.1%, 1.121 61.8%, 1.096 64.8%, 1.074 67.8%, 1.056 70.7%, 1.04 73.7%, 1.029 76.3%, 1.02 79%, 1.013 81.8%, 1.007 84.7%, 1.001 91%, 1);
				
				&:hover {
					color:      var(--theme-color-success) !important;
					transform:  translateX(.1rem) translateY(-.125rem) scale(1.15) rotate(5deg);
					transition: color 50ms ease,
					            transform 300ms linear(0, 0.291 2.7%, 0.544 5.5%, 0.761 8.4%, 0.947 11.5%, 1.027 13.1%, 1.096 14.7%, 1.16 16.4%, 1.213 18.1%, 1.26 19.9%, 1.298 21.7%, 1.329 23.6%,
						1.352 25.5%, 1.363 26.8%, 1.372 28.2%, 1.377 29.6%, 1.379 31.1%, 1.378 32.6%, 1.374 34.2%, 1.367 35.9%, 1.357 37.6%, 1.337 40.4%, 1.307 43.7%, 1.176 56.1%, 1.121 61.8%, 1.096 64.8%, 1.074 67.8%, 1.056 70.7%, 1.04 73.7%, 1.029 76.3%, 1.02 79%, 1.013 81.8%, 1.007 84.7%, 1.001 91%, 1);
				}
			}
		}
		
		.subtitle {
			text-wrap:   pretty;
			font-weight: 500;
			color:       var(--theme-text-secondary);
			
			user-select: none;
			
			ul li {
				max-width:           80%;
				text-wrap:           pretty;
				list-style-position: outside;
				list-style-type:     square;
				margin-left:         1.5rem;
				margin-bottom:       1rem;
				
				user-select:         none;
				
				ul li {
					list-style-type: disc;
					margin-left:     1.25rem;
					margin-bottom:   0;
					
					font-family:     'JetBrainsMono', monospace;
					
					user-select:     all;
					
					color:           var(--theme-text-third);
				}
			}
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
</style>
<!--suppress CssUnusedSymbol -->