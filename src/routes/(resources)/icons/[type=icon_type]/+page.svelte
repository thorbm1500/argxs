<!--svelte-ignore state_referenced_locally-->
<script lang="ts">
	import type { HighlightIcon, Icon, PageTheme, ResourceIcon } from '$lib/components/interfaces';
	import { flushSync, getContext, onMount } from 'svelte';
	import BrandIconComponent from '$lib/components/BrandIconComponent.svelte';
	import { innerWidth } from 'svelte/reactivity/window';
	import { draw, fade } from 'svelte/transition';
	import { quartInOut } from 'svelte/easing';
	import Highlight, { LineNumbers } from 'svelte-highlight';
	import xml from 'svelte-highlight/languages/xml';
	import { github, githubDark } from 'svelte-highlight/styles';
	import moment from 'moment';
	import { copyToClipboard } from '$lib/utilities';
	import { page } from '$app/state';
	
	let iconType: string = $derived(String(page.params.type));
	if (iconType !== 'brands' && iconType !== 'flags') throw new Error('Failed to find icon type');
	
	const { data } = $props();
	
	const getTheme = getContext('theme') as Function;
	let theme: PageTheme = $derived(getTheme());
	const sendToast: any = $derived(getContext('sendToast'));
	
	// - Sorting Variables
	let iconsOnly: boolean = $state.raw(false);
	let logosOnly: boolean = $state.raw(false);
	let sorting: 'default' | 'time' | 'alphabet' = $state.raw('default');
	let order: 'desc' | 'asc' = $state.raw('desc');
	let brandIcons: ResourceIcon[] = $derived.by(() => {
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
		}
		
		if (iconType === 'brands') {
			if (iconsOnly) return current.filter((icon: ResourceIcon) => icon.type === 'icon');
			else if (logosOnly) return current.filter((icon: ResourceIcon) => icon.type === 'logo');
		}
		
		return current;
	});
	// -
	
	// - Pagination Variables
	let pagMax = $derived(brandIcons.length);
	let currentPage = $state(1);
	let pagOffset: 24 | 48 | 96 = $state(48);
	let pagStart = $derived(Math.max(0, (currentPage - 1) * pagOffset));
	let pagEnd = $derived(Math.min(pagMax, currentPage * pagOffset));
	let maxPage = $derived(Math.ceil(pagMax / pagOffset));
	let currentIcons = $derived(brandIcons.slice(pagStart, pagEnd));
	// -
	
	let columnAmount: number = $derived.by(() => {
		let result = Math.trunc((innerWidth.current ?? 1920) / 140);
		
		while (true) {
			if (((pagOffset / result) % 2) !== 0) result--;
			else break;
		}
		
		return result;
	});
	let rowAmount = $derived(((pagOffset / columnAmount)));
	
	// - Highlighted Icon Variables
	let highlightedIcon: HighlightIcon | undefined = $state(undefined);
	let iconContainerOpened: number | null = $state(null);
	let hCurrentIcon: Icon | undefined = $derived.by(() => {
		if (!highlightedIcon) return undefined;
		return highlightedIcon.iconIndex[highlightedIcon.currentIcon];
	});
	let currentSVG = $state('');
	let currentLoadedSVG = '';
	// -
	
	$effect(() => {
		if (currentSVG === '' && hCurrentIcon !== undefined) {
			currentSVG = 'load';
			currentLoadedSVG = hCurrentIcon.path;
			fetch('/resources/icons/' + iconType + '/' + hCurrentIcon.path).then(res => {
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
	});
	
	onMount(() => {
		document.addEventListener('click', (event) => {
			// Event ignored while highlight container is closed.
			if (!highlightedIcon) return;
			
			const currentDate = Date.now();
			
			// Ensuring an open-time is registered for the container, before processing events.
			if (iconContainerOpened !== null) {
				// 250ms margin of error, allowing early errors to be ignored.
				if ((currentDate - iconContainerOpened) < 250) return;
				
				let el: HTMLElement | null = event.target as HTMLElement;
				while (el !== null) {
					// Returning if expression matches, allowing certain elements to be clickable.
					if (/(overlay buttons)|(highlighted-icon)|(header-section)/.test(el.className)) return;
					else el = el.parentElement;
				}
				
				closeHighlightContainer();
			} else {
				iconContainerOpened = currentDate;
			}
		});
		
		document.addEventListener('keydown', (event) => {
			// Enable closure of highlight window by pressing Escape.
			if (event.isTrusted && event.key === 'Escape') closeHighlightContainer();
		});
	});
	
	function downloadImage(path: string, isImageSVG?: true) {
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
		
		linkElement.type = 'image/svg+xml';
		linkElement.download = hCurrentIcon.path.slice(hCurrentIcon.path.lastIndexOf('/') + 1);
		
		linkElement.click();
		
		sendToast?.({ message: 'Downloaded', duration: 1250, type: 'download', status: 'success' });
	}
	
	function closeHighlightContainer() {
		highlightedIcon = undefined;
		iconContainerOpened = null;
		currentSVG = '';
		flushSync();
	}
</script>

<svelte:head>
	<!--Dynamic syntax highlighting-->
	{#if theme === 'light'}
		{@html github}
	{:else}
		{@html githubDark}
	{/if}
</svelte:head>

{#if highlightedIcon !== undefined}
	{#key highlightedIcon.icon}
		<div class="glass-effects">
			<div class="glass-border-glow"></div>
		</div>
		<div class="highlighted-icon">
			<svg style="display: none;">
				<filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%">
					<feTurbulence type="fractalNoise" baseFrequency="0.009 0.009" numOctaves="2" seed="{Math.trunc((Date.now() / 1000) / 1000)}" result="noise" />
					<feGaussianBlur in="noise" stdDeviation="4" result="blurred" />
					<feDisplacementMap in="SourceGraphic" in2="blurred" scale="15" xChannelSelector="R" yChannelSelector="G" />
				</filter>
			</svg>
			<div class="h-icon">
				<div class="glass-filter"></div>
				<div class="glass-specular"></div>
				<div class="glass-border"></div>
				<button title="Close" class="close-button" onclick={closeHighlightContainer}>
					<!--suppress HtmlUnknownTag -->
					<div class="gradient"></div>
				</button>
				<div class="left">
					<div class="img-fx">
						<img in:fade|global src="/resources/icons/{iconType}/{highlightedIcon.iconIndex[highlightedIcon.currentIcon]?.path}"
						     alt={highlightedIcon.iconIndex[highlightedIcon.currentIcon]?.name} loading="lazy" />
					</div>
					<img in:fade|global src="/resources/icons/{iconType}/{highlightedIcon.iconIndex[highlightedIcon.currentIcon]?.path}"
					     alt={highlightedIcon.iconIndex[highlightedIcon.currentIcon]?.name} loading="lazy" />
					{#if highlightedIcon.iconIndex.length > 1}
						<div class="current-icon-index">
							<p>{highlightedIcon.currentIcon + 1}/{highlightedIcon.iconIndex.length}</p>
						</div>
						<div class="actions">
							<button title="" class="element prev-icon"
							        onclick="{() => {
									currentSVG = '';
									if (!highlightedIcon) return;
									if (highlightedIcon.currentIcon > 0) highlightedIcon.currentIcon -= 1;
									else highlightedIcon.currentIcon = highlightedIcon.iconIndex.length - 1;
								}}">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M12 2c5.523 0 10 4.477 10 10s-4.477 10 -10 10a10 10 0 1 1 0 -20m2 13v-6a1 1 0 0 0 -1.707 -.708l-3 3a1 1 0 0 0 0 1.415l3 3a1 1 0 0 0 1.414 0l.083 -.094c.14 -.18 .21 -.396 .21 -.613" />
								</svg>
							</button>
							<button title="" class="element next-icon" onclick="{() => {
							currentSVG = '';
							if (!highlightedIcon) return;
							if (highlightedIcon.currentIcon < highlightedIcon.iconIndex.length - 1) highlightedIcon.currentIcon += 1;
							else highlightedIcon.currentIcon = 0;
						}}">
								<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M17 3.34a10 10 0 1 1 -15 8.66l.005 -.324a10 10 0 0 1 14.995 -8.336m-5.293 4.953a1 1 0 0 0 -1.707 .707v6c0 .217 .07 .433 .21 .613l.083 .094a1 1 0 0 0 1.414 0l3 -3a1 1 0 0 0 0 -1.414z" />
								</svg>
							</button>
						</div>
					{/if}
				</div>
				<div class="separator"></div>
				<div class="right">
					{#if highlightedIcon.icon.href || hCurrentIcon?.href}
						<a class="brand-external {hCurrentIcon?.name && highlightedIcon.icon.name !== hCurrentIcon?.name ? 'top' : 'bottom'} theme-transition" href={hCurrentIcon?.href ??
						highlightedIcon.icon.href}
						   rel="external" target="_blank">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">
								<path
									d="M7.5 7H7C4.23858 7 2 9.23858 2 12C2 14.7614 4.23858 17 7 17H9C11.7614 17 14 14.7614 14 12M16.5 17H17C19.7614 17 22 14.7614 22 12C22 9.23858 19.7614 7 17 7H15C12.2386 7 10 9.23858 10 12" />
							</svg>
							{highlightedIcon.icon.name === 'Ukraine' || highlightedIcon.icon.name === 'Palestine' ? 'Show Support' : 'Visit Page'}
						</a>
					{/if}
					<div class="name">
						<h1 class="brand-name"
						    style="transform: translateY({highlightedIcon.icon.href || hCurrentIcon?.href || hCurrentIcon?.name && highlightedIcon.icon.name !== hCurrentIcon.name ? '0' : '1.1'}rem)">{highlightedIcon.icon.name}</h1>
						{#if hCurrentIcon && highlightedIcon.icon.name !== hCurrentIcon.name}
							<h3 class="icon-name">{hCurrentIcon.name}</h3>
						{/if}
					</div>
					<div class="actions">
						<p class="added-date">Added  {moment(Date.parse(highlightedIcon.iconIndex[highlightedIcon.currentIcon]?.date_added ?? '')).calendar()}</p>
						<button class="action" onclick={() => downloadImage('/resources/icons/' + iconType + hCurrentIcon?.path, true)}>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">
								<path d="M8 12L12 16M12 16L16 12M12 16V8M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" />
							</svg>
							SVG
						</button>
						<button class="action" disabled={!hCurrentIcon?.png} onclick={() => downloadImage(hCurrentIcon?.png ?? 'none')}>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">
								<path d="M8 12L12 16M12 16L16 12M12 16V8M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" />
							</svg>
							PNG
						</button>
						<button class="action" disabled={!hCurrentIcon?.webp} onclick={() => downloadImage(hCurrentIcon?.webp ?? 'none')}>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">
								<path d="M8 12L12 16M12 16L16 12M12 16V8M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" />
							</svg>
							WEBP
						</button>
						<button class="action" disabled={!hCurrentIcon?.jpeg} onclick={() => downloadImage(hCurrentIcon?.jpeg ?? 'none')}>
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
							<Highlight language={xml} let:highlighted
							           code={currentSVG}>
								<button title="Copy" class="copy-button" onclick={() => copyToClipboard(currentSVG)}>
									<!--suppress HtmlUnknownTag -->
									<div class="background"></div>
									<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
										<path
											d="M20.926 7.074a3.67 3.67 0 0 1 1.074 2.593v8.666a3.667 3.667 0 0 1 -3.667 3.667h-8.666a3.667 3.667 0 0 1 -3.667 -3.667v-8.666q 0 -.053 .005 -.102a3.66 3.66 0 0 1 3.662 -3.565h8.666c.973 0 1.905 .386 2.593 1.074" />
										<path
											d="M17.374 3.514a1 1 0 1 1 -1.748 .972c-.221 -.398 -.342 -.486 -.626 -.486h-10c-.548 0 -1 .452 -1 1v9.998c0 .36 .194 .692 .507 .87a1 1 0 1 1 -.99 1.738a3 3 0 0 1 -1.517 -2.606v-10c0 -1.652 1.348 -3 3 -3h10c1.094 0 1.828 .533 2.374 1.514" />
									</svg>
								</button>
								<LineNumbers {highlighted} hideBorder />
							</Highlight>
						{/if}
					</div>
					{#if highlightedIcon.iconIndex[highlightedIcon.currentIcon]?.source}
						<div class="icon-source">
							<p>Sourced from</p>
							<a href={highlightedIcon.iconIndex[highlightedIcon.currentIcon]?.source?.href} rel="external" target="_blank">
								{highlightedIcon.iconIndex[highlightedIcon.currentIcon]?.source?.name}
							</a>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/key}
{/if}

<section class="content-header">
	<div class="text">
		<h1 class="title">
			{iconType === 'brands' ? 'Brand' : 'Flag'} Icons
		</h1>
		<div class="subtitle">
				{#if iconType === 'brands'}
					argxs currently showcases a total of <strong style="color: color-mix(var(--theme-color-accent) 80%, var(--theme-ui-white) 20%);">{data.totalAmount}</strong> different brand icons &
					logos, consisting of <strong style="color: color-mix(var(--theme-color-accent) 80%, var(--theme-ui-white) 20%);">{data.iconAmount}</strong> icons, and <strong
					style="color:color-mix(var(--theme-color-accent) 80%, var(--theme-ui-white) 20%);">{data.logoAmount}</strong> logos.
				{:else}
					argxs currently showcases flags from a total of <strong style="color: color-mix(var(--theme-color-accent) 80%, var(--theme-ui-white) 20%);">{data.totalAmount}</strong> different
					countries, consisting of <strong style="color: color-mix(var(--theme-color-accent) 80%, var(--theme-ui-white) 20%);">{data.iconAmount}</strong> different flags.
				{/if}
		</div>
	</div>
	<div class="actions">
		<div class="sorting">
			{#if sorting !== 'default'}
				<button transition:fade={{duration: 325, easing: quartInOut}} title="Clear Sort Filter" class="sort-action glass-button" onclick="{() => sorting = 'default'}">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path transition:draw|global={{duration: 1100, easing: quartInOut}}
						      d="M12 16l3.644 3.644a1.21 1.21 0 0 0 1.712 0l2.288 -2.288a1.21 1.21 0 0 0 0 -1.712l-3.644 -3.644l3.644 -3.644a1.21 1.21 0 0 0 0 -1.712l-2.288 -2.288a1.21 1.21 0 0 0 -1.712 0l-3.644 3.644l-3.644 -3.644a1.21 1.21 0 0 0 -1.712 0l-2.288 2.288a1.21 1.21 0 0 0 0 1.712l3.644 3.644l-3.644 3.644a1.21 1.21 0 0 0 0 1.712l2.288 2.288a1.21 1.21 0 0 0 1.712 0m3.644 -3.644" />
					</svg>
				</button>
			{/if}
			<button class="sort-action glass-button" onclick="{() =>  {
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
			<button class="sort-action glass-button" onclick="{() =>  {
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
		{#if iconType === 'brands'}
			<div class="filter">
				<button class="sort-action glass-button {!iconsOnly && !logosOnly ? 'active' : 'inactive'}" onclick="{() => {
			currentPage = 1;
			iconsOnly = false;
			logosOnly = false;
		}}">
					All
				</button>
				<button class="sort-action glass-button {iconsOnly ? 'active' : 'inactive'}" onclick="{() => {
			currentPage = 1;
			iconsOnly = !iconsOnly;
			if (iconsOnly) logosOnly = false;
		}}">
					Icons Only
				</button>
				<button class="sort-action glass-button {logosOnly ? 'active' : 'inactive'}" onclick="{() => {
			currentPage = 1;
			logosOnly = !logosOnly;
			if (logosOnly) iconsOnly = false;
		}}">
					Logos Only
				</button>
			</div>
		{/if}
	</div>
</section>

<section class="brand-icons-sec" style:--current-width={(innerWidth.current ?? 1920) + 'px'} style:--column-amount={columnAmount} style:--row-amount={rowAmount}>
	<div class="icons" style="row-gap:calc(((var(--current-width) - 12rem) / var(--column-amount)) - 7rem);grid-template-columns: repeat(var(--column-amount), 7rem);">
		{#each currentIcons as icon}
			{#key icon}
				<BrandIconComponent type={iconType} bind:highlightedIcon bind:theme icon={icon} />
			{/key}
		{/each}
	</div>
</section>

<div class="pagination-actions">
	<button title="First Page" class="action glass-button {currentPage > 3 ? 'shown' : 'hidden'}" onclick="{() => currentPage = 1}">
		1
	</button>
	<div class="separator {currentPage > 3 ? 'shown' : 'hidden'}">
		<div class="circle glass-button"></div>
		<div class="circle glass-button"></div>
		<div class="circle glass-button"></div>
	</div>
	<button class="action glass-button {currentPage > 2 ? 'shown' : 'hidden'}" onclick="{() => currentPage -= 2}">{currentPage > 2 ? currentPage - 2 : ' '}</button>
	<button class="action glass-button {currentPage > 1 ? 'shown' : 'hidden'}" onclick="{() => currentPage--}">{currentPage > 1 ? currentPage - 1 : ' '}</button>
	<p class="action current-page glass-button">{currentPage}</p>
	<button class="action glass-button {currentPage < maxPage ? 'shown' : 'hidden'}" onclick="{() => currentPage++}">{currentPage < maxPage ? currentPage + 1 : ' '}</button>
	<button class="action glass-button {(currentPage + 1) < maxPage ? 'shown' : 'hidden'}" onclick="{() => currentPage += 2}">{(currentPage + 1) < maxPage ? currentPage + 2 : ' '}</button>
	<div class="separator {(currentPage + 2) < maxPage ? 'shown' : 'hidden'}">
		<div class="circle glass-button"></div>
		<div class="circle glass-button"></div>
		<div class="circle glass-button"></div>
	</div>
	<button title="Last Page" class="action glass-button {(currentPage + 2) < maxPage ? 'shown' : 'hidden'}" onclick="{() => currentPage = maxPage}">
		{maxPage}
	</button>
	<button class="sort-action glass-button" onclick="{() => {
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

<div class="resource-info">
	<h1 class="title">
		Good to know
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
			<path d="M8.99962 14C8.99962 14 10.3121 15.5 12.4996 15.5C14.6871 15.5 15.9996 14 15.9996 14M15.2496 9H15.2596M9.74962 9H9.75962M12.4996 20C17.194 20 20.9996 16.1944 20.9996 11.5C20.9996 6.80558 17.194 3 12.4996 3C7.8052 3 3.99962 6.80558 3.99962 11.5C3.99962 12.45 4.15547 13.3636 4.443 14.2166C4.55119 14.5376 4.60529 14.6981 4.61505 14.8214C4.62469 14.9432 4.6174 15.0286 4.58728 15.1469C4.55677 15.2668 4.48942 15.3915 4.35472 15.6408L2.71906 18.6684C2.48575 19.1002 2.36909 19.3161 2.3952 19.4828C2.41794 19.6279 2.50337 19.7557 2.6288 19.8322C2.7728 19.9201 3.01692 19.8948 3.50517 19.8444L8.62619 19.315C8.78127 19.299 8.85881 19.291 8.92949 19.2937C8.999 19.2963 9.04807 19.3029 9.11586 19.3185C9.18478 19.3344 9.27145 19.3678 9.44478 19.4345C10.3928 19.7998 11.4228 20 12.4996 20ZM15.7496 9C15.7496 9.27614 15.5258 9.5 15.2496 9.5C14.9735 9.5 14.7496 9.27614 14.7496 9C14.7496 8.72386 14.9735 8.5 15.2496 8.5C15.5258 8.5 15.7496 8.72386 15.7496 9ZM10.2496 9C10.2496 9.27614 10.0258 9.5 9.74962 9.5C9.47348 9.5 9.24962 9.27614 9.24962 9C9.24962 8.72386 9.47348 8.5 9.74962 8.5C10.0258 8.5 10.2496 8.72386 10.2496 9Z" />
		</svg>
	</h1>
	<div class="subtitle">
		<ul>
			<li>
				All SVGs are manually cleaned up and optimized, before being showcased. This is done for 2 reasons:<br>
			    Ensuring no SVGs overlap and conflict due to having attributes with matching names, and for a hope of minimizing the amount of redundant data being transferred across the internet.
			</li>
			<li>
				Embedding an SVG? Remove these attributes! Browsers do not need these attributes when rendering SVGs that are directly embedded on the page, so they can be safely omitted.
				<ul>
					<li>
						xmlns   | Fx. xmlns="http://www.w3.org/2000/svg"
					</li>
					<li>
						version | Fx. version="1.1"
					</li>
				</ul>
			</li>
		</ul>
	</div>
</div>

<!--suppress CssUnusedSymbol -->
<style>
	/* Desktop & Tablet */
	@media (width >= 44rem) {
		:global(.main-container) {
			padding: 3rem 6rem 0 6rem !important;
		}
		
		.brand-icons-sec {
			height: calc(((((var(--current-width) - 12rem) / var(--column-amount)) - 7rem) * (var(--row-amount) - 1)) + (var(--row-amount) * 7rem)) !important;
			
			.icons {
				justify-content: space-between;
			}
		}
		
		.pagination-actions {
			width: 100%;
			gap:   .5rem;
		}
		
		.content-header {
			display:         flex;
			flex-flow:       row nowrap;
			align-items:     flex-end;
			justify-content: space-between;
			
			padding-bottom:  2rem;
			
			.text {
				.title {
					font-size: 3rem;
				}
				
				.subtitle {
					font-size: 0.95rem;
				}
			}
			
			.actions {
				padding-left: .25rem;
			}
		}
	}
	
	/* Phone */
	@media (width < 44rem) {
		:global(.main-container) {
			padding: 3rem 5rem 0 5rem !important;
		}
		
		.brand-icons-sec .icons {
			grid-template-columns: repeat(2, 7rem) !important;
			justify-content:       space-evenly;
			column-gap:            1rem;
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
			
			.sort-action, .separator, .action:first-child, .action:nth-child(3), .action:nth-child(7), .action:nth-child(9) {
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
			display:         flex;
			flex-flow:       column nowrap;
			align-items:     flex-end;
			justify-content: space-between;
			
			.text {
				.title {
					font-size: 2rem;
				}
				
				.subtitle {
					font-size: 0.8rem;
				}
			}
			
			.actions {
				margin-top: 1rem;
			}
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
	
	.glass-effects {
		position:        fixed;
		bottom:          0;
		right:           0;
		overflow:        visible !important;
		
		display:         flex;
		align-items:     center;
		justify-content: center;
		
		width:           100vw;
		height:          calc(100vh - var(--header-height));
		
		mix-blend-mode:  overlay;
		mask-image:      linear-gradient(20deg, transparent 20%, black 50%, transparent 80%);
		
		pointer-events:  none !important;
		z-index:         60000 !important;
		
		.glass-border-glow {
			position:      fixed;
			width:         80vw;
			height:        60vh;
			max-width:     80.1rem;
			max-height:    32.1rem;
			overflow:      visible !important;
			
			border-radius: 1rem;
		}
	}
	
	.highlighted-icon {
		position:        fixed;
		bottom:          0;
		right:           0;
		box-sizing:      border-box;
		
		display:         flex;
		align-items:     center;
		justify-content: center;
		
		width:           100vw;
		height:          calc(100vh - var(--header-height));
		
		background:      rgba(from var(--theme-ui-background) r g b / 0.3);
		
		pointer-events:  none;
		z-index:         50000;
		
		.h-icon {
			position:        relative;
			display:         flex;
			flex-flow:       row nowrap;
			align-items:     center;
			justify-content: space-between;
			
			box-sizing:      border-box;
			overflow:        hidden !important;
			
			width:           80vw;
			height:          60vh;
			max-width:       80rem;
			max-height:      32rem;
			
			background:      linear-gradient(to bottom, rgba(from var(--theme-icon-hightlight-container) r g b / .35) 0%, rgba(from var(--theme-icon-hightlight-container) r g b / .575) 100%);
			backdrop-filter: url(#glass-distortion) brightness(.8) saturate(120%) brightness(1.15) blur(1px) blur(.35rem);
			border-radius:   1rem;
			
			pointer-events:  all;
			
			z-index:         500;
			
			&::before, &::after {
				content:        '';
				mix-blend-mode: overlay;
				box-sizing:     border-box;
				
				position:       absolute;
				width:          100%;
				height:         100%;
				
				border-radius:  inherit;
				
				z-index:        400 !important;
			}
			
			&::before {
				border:           2px solid color-mix(rgba(from var(--theme-ui-black) r g b / .5), #4B0082 20%);
				background-image: linear-gradient(45deg, #929BC966 0%, transparent 100%);
				opacity:          .2;
				
				filter:           blur(.05rem) contrast(2) brightness(1.5);
				mask-image:       linear-gradient(20deg, transparent 20%, black 50%, transparent 80%);
			}
			
			&::after {
				border:     3px solid var(--theme-ui-white);
				
				opacity:    .3;
				
				filter:     blur(.075rem) contrast(2) brightness(1.5);
				mask-image: linear-gradient(-20deg, transparent 0%, black 50%, transparent 100%);
			}
			
			.glass-border {
				position:       absolute;
				box-sizing:     border-box;
				
				width:          100%;
				height:         100%;
				inset:          0;
				overflow:       visible;
				
				border-radius:  inherit;
				mix-blend-mode: overlay;
				
				box-shadow:     inset 0 0 3px 5px rgba(255 255 255 /.15);
				filter:         blur(1px) contrast(1.025);
				opacity:        .15;
				
				pointer-events: none !important;
				z-index:        500 !important;
			}
			
			.glass-specular {
				position:       absolute;
				box-sizing:     border-box;
				
				width:          calc(100% + 1px);
				height:         calc(100% + 1px);
				inset:          0;
				overflow:       visible;
				
				border:         1px solid light-dark(rgb(211 216 222 / 0.5), rgb(102 119 140 / 0.4));
				border-radius:  inherit;
				mix-blend-mode: overlay;
				
				pointer-events: none !important;
				z-index:        500 !important;
			}
			
			.close-button {
				position:      absolute;
				top:           1rem;
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
							height: .975rem;
							width:  .975rem;
							color:  var(--theme-ui-white);
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
					
					z-index:       500 !important;
					
					.copy-button {
						position:  absolute;
						right:     3.5rem;
						transform: translateY(1rem);
						padding:   .35rem;
						
						cursor:    pointer;
						z-index:   1000 !important;
						
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
					
					:global {
						div {
							overflow: visible !important;
						}
						
						table tbody, table tbody tr, table tbody td {
							background-color: transparent !important;
						}
						
						table tbody {
							td.hljs {
								position: relative !important;
								
								code {
									font-weight: 550;
								}
							}
						}
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
		
		.icons {
			display: grid;
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
		z-index:         500;
		
		.separator {
			display:         flex;
			flex-flow:       row nowrap;
			align-items:     flex-end;
			justify-content: center;
			gap:             .15rem;
			height:          2.5rem;
			padding:         0 .25rem;
			
			&.shown {
				opacity:    1;
				transition: 125ms ease-out;
			}
			
			&.hidden {
				opacity:    0;
				transition: 75ms ease-in;
			}
			
			.circle {
				background-image: var(--theme-ui-gradient-bg);
				border-radius:    100%;
				width:            .35rem;
				height:           .35rem;
			}
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
			
			border-radius:   .95rem;
			
			&.current-page {
				transform: scale(1.1);
				margin:    0 .5rem;
			}
			
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
		}
		
		.sort-action {
			position: absolute;
			right:    0;
		}
	}
	
	.sort-action {
		display:         inline-flex;
		align-items:     center;
		justify-content: center;
		gap:             .25rem;
		
		width:           fit-content;
		height:          fit-content;
		
		padding:         .5rem .8rem;
		
		border-radius:   .75rem;
		
		font-size:       .9rem;
		font-weight:     650;
		text-wrap:       nowrap;
		
		cursor:          pointer;
		
		transform:       scale(1);
		z-index:         500;
		
		svg {
			width:  1.35rem;
			height: 1.35rem;
		}
		
		&:hover {
			transform: scale(1.025);
		}
		
		&:active {
			transform: scale(.975);
		}
	}
	
	.content-header {
		height:      fit-content;
		width:       100%;
		margin-top:  1rem;
		
		user-select: none;
		z-index:     500;
		
		.text {
			z-index: 500;
			
			.title {
				background-image: var(--theme-text-gradient);
				background-clip:  text;
				color:            transparent;
				
				max-height:       6.75rem;
			}
			
			.subtitle {
				text-wrap: pretty;
				font-weight: 500;
				color:       var(--theme-text-third);
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
			
			background-image: linear-gradient(to bottom, var(--theme-color-primary) 0%, transparent 100%);
			transform:        rotate(3deg);
			filter:           blur(6rem);
			
			z-index:          1;
		}
		
		.actions {
			display:         flex;
			flex-flow:       column wrap;
			align-items:     flex-end;
			justify-content: flex-end;
			gap:             .5rem;
			
			width:           fit-content;
			
			z-index:         500;
			
			.sorting, .filter {
				display:         flex;
				flex-flow:       row nowrap;
				align-items:     center;
				justify-content: flex-end;
				gap:             .5rem;
			}
			
			.sort-action.inactive {
				filter:  grayscale(.75);
				opacity: .5;
			}
		}
	}
	
	.resource-info {
		margin-top: 2.5rem;
		
		.title {
			display: flex;
			flex-flow: row nowrap;
			align-items: center;
			justify-content: flex-start;
			gap: .25rem;

			font-size: 2rem;
			padding: .5rem 0;
			margin-left: .25rem;
			
			user-select: none;
			
			svg {
				width: 1.85rem;
				height: 1.85rem;
				transform: translateX(0) translateY(.15rem) scale(1) rotate(12.5deg);
				
				transition: color 150ms 400ms ease,
					transform 600ms 500ms linear(0, 0.291 2.7%, 0.544 5.5%, 0.761 8.4%, 0.947 11.5%, 1.027 13.1%, 1.096 14.7%, 1.16 16.4%, 1.213 18.1%, 1.26 19.9%, 1.298 21.7%, 1.329 23.6%,
				1.352
				25.5%, 1.363 26.8%, 1.372 28.2%, 1.377 29.6%, 1.379 31.1%, 1.378 32.6%, 1.374 34.2%, 1.367 35.9%, 1.357 37.6%, 1.337 40.4%, 1.307 43.7%, 1.176 56.1%, 1.121 61.8%, 1.096 64.8%, 1.074 67.8%, 1.056 70.7%, 1.04 73.7%, 1.029 76.3%, 1.02 79%, 1.013 81.8%, 1.007 84.7%, 1.001 91%, 1);
				
				&:hover {
					color: var(--theme-color-success) !important;
					transform: translateX(.1rem) translateY(-.125rem) scale(1.15) rotate(5deg);
					transition: color 50ms ease,
						transform 300ms linear(0, 0.291 2.7%, 0.544 5.5%, 0.761 8.4%, 0.947 11.5%, 1.027 13.1%, 1.096 14.7%, 1.16 16.4%, 1.213 18.1%, 1.26 19.9%, 1.298 21.7%, 1.329 23.6%,
					1.352
					25.5%, 1.363 26.8%, 1.372 28.2%, 1.377 29.6%, 1.379 31.1%, 1.378 32.6%, 1.374 34.2%, 1.367 35.9%, 1.357 37.6%, 1.337 40.4%, 1.307 43.7%, 1.176 56.1%, 1.121 61.8%, 1.096 64.8%, 1.074 67.8%, 1.056 70.7%, 1.04 73.7%, 1.029 76.3%, 1.02 79%, 1.013 81.8%, 1.007 84.7%, 1.001 91%, 1);
				}
			}
		}
		
		.subtitle {
			text-wrap: pretty;
			font-size: 1.05rem;
			font-weight: 500;
			color:       var(--theme-text-secondary);
			
			user-select: none;
			
			ul li {
				max-width: 80%;
				text-wrap: pretty;
				list-style-position: outside;
				list-style-type: square;
				margin-left: 1.5rem;
				margin-bottom: .75rem;
				
				user-select: none;
				
				ul li {
					list-style-position: inside;
					list-style-type: disc;
					margin-left: 1.25rem;
					margin-bottom: 0;
					
					font-family: 'JetBrainsMono', monospace;
					font-size: .9rem;
					white-space: pre;
					
					user-select: all;
					
					color:       var(--theme-text-third);
				}
			}
		}
	}
</style>