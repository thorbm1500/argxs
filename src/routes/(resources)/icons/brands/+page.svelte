<!--svelte-ignore state_referenced_locally-->
<script module lang="ts">
	export interface HighlightIcon {
		brandIcon: BrandIcon,
		iconIndex: Icon[],
		currentIcon: number
	}
</script>

<script lang="ts">
	import type { BrandIcon, Icon, PageTheme } from '$lib/components/interfaces';
	import { getContext, onMount } from 'svelte';
	import BrandIconComponent from '$lib/components/BrandIconComponent.svelte';
	import { innerWidth } from 'svelte/reactivity/window';
	import { draw, fade } from 'svelte/transition';
	import { quartInOut } from 'svelte/easing';
	import Highlight, { LineNumbers } from 'svelte-highlight';
	import xml from 'svelte-highlight/languages/xml';
	import { github, githubDark } from 'svelte-highlight/styles';
	import moment from 'moment';
	import { copyToClipboard } from '$lib/utilities';
	
	const { data } = $props();
	
	const getTheme = getContext('theme') as Function;
	let theme: PageTheme = $derived(getTheme());
	const sendToast: any = $derived(getContext('sendToast'));
	
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
	let rowAmount = $derived(((pagOffset / columnAmount)));
	
	let highlightedIcon: HighlightIcon | undefined = $state(undefined);
	let iconContainerOpened: number | null = $state(null);
	
	let hCurrentIcon: Icon | undefined = $derived.by(() => {
		if (!highlightedIcon) return undefined;
		return highlightedIcon.iconIndex[highlightedIcon.currentIcon];
	});
	let currentSVG = $state('');
	let currentLoadedSVG = '';
	
	$effect(() => {
		if (currentSVG === '' && hCurrentIcon) {
			currentSVG = 'load';
			currentLoadedSVG = hCurrentIcon.path;
			fetch('/resources/icons/brands/' + hCurrentIcon.path).then(res => {
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
		document.addEventListener('click', async (event) => {
			const currentDate = Date.now();
			if (highlightedIcon && iconContainerOpened !== null) {
				if ((currentDate - iconContainerOpened) < 400) return;
				
				let el: HTMLElement | null = event.target as HTMLElement;
				
				while (el !== null) {
					if (el.classList.contains('highlighted-icon') || el.className.includes('overlay buttons') || el.classList.contains('header-section')) return;
					el = el.parentElement;
				}
				
				console.log(currentDate - iconContainerOpened);
				closeHighlightContainer();
			} else {
				iconContainerOpened = Date.now();
			}
		});
		document.addEventListener('keydown', (event) => {
			3;
			if (event.isTrusted && event.key === 'Escape') {
				closeHighlightContainer();
			}
		});
	});
	
	function downloadSVG() {
		if (!hCurrentIcon) return;
		
		const link = document.createElement('a');
		
		if (currentSVG !== '' && currentSVG !== 'load') {
			// Create object from already loaded file content, rather than fetching it once more.
			const url = URL.createObjectURL(new Blob([currentSVG], { type: 'image/svg+xml' }));
			link.href = url;
			setTimeout(() => URL.revokeObjectURL(url), 400);
		} else {
			link.href = hCurrentIcon.path;
		}
		
		link.type = 'image/svg+xml';
		link.download = hCurrentIcon.path.slice(hCurrentIcon.path.lastIndexOf('/') + 1);
		
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		
		sendToast?.({ message: 'Downloaded', duration: 1250, type: 'download', status: 'success' });
	}
	
	function closeHighlightContainer() {
		highlightedIcon = undefined;
		iconContainerOpened = null;
		currentSVG = '';
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
	<div class="highlighted-icon">
		<div class="h-icon">
			<button title="Close" class="close-button" onclick={closeHighlightContainer}>
				<!--suppress HtmlUnknownTag -->
				<div class="gradient"></div>
			</button>
			<div class="left">
				<div class="img-fx">
					<img in:fade|global src="/resources/icons/brands/{highlightedIcon.iconIndex[highlightedIcon.currentIcon]?.path}"
					     alt={highlightedIcon.iconIndex[highlightedIcon.currentIcon]?.name} loading="lazy" />
				</div>
				<img in:fade|global src="/resources/icons/brands/{highlightedIcon.iconIndex[highlightedIcon.currentIcon]?.path}"
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
				<h1 class="brand-name">{highlightedIcon.brandIcon.name}</h1>
				{#if hCurrentIcon?.href || highlightedIcon.brandIcon.href !== undefined}
					<a class="brand-external" href={hCurrentIcon?.href ?? highlightedIcon.brandIcon.href} rel="external" target="_blank">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">
							<path
								d="M7.5 7H7C4.23858 7 2 9.23858 2 12C2 14.7614 4.23858 17 7 17H9C11.7614 17 14 14.7614 14 12M16.5 17H17C19.7614 17 22 14.7614 22 12C22 9.23858 19.7614 7 17 7H15C12.2386 7 10 9.23858 10 12" />
						</svg>
						Visit Page
					</a>
				{/if}
				<div class="actions">
					<p class="added-date">Added  {moment(highlightedIcon.iconIndex[highlightedIcon.currentIcon]?.date_added).calendar()}</p>
					<button class="action" onclick={downloadSVG}>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">
							<path d="M8 12L12 16M12 16L16 12M12 16V8M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" />
						</svg>
						SVG
					</button>
					<div class="action inactive">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">
							<path d="M8 12L12 16M12 16L16 12M12 16V8M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" />
						</svg>
						PNG
					</div>
					<div class="action inactive">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">
							<path d="M8 12L12 16M12 16L16 12M12 16V8M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" />
						</svg>
						WEBP
					</div>
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
{/if}

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

<section class="brand-icons-sec" style:--current-width={(innerWidth.current ?? 1920) + 'px'} style:--column-amount={columnAmount} style:--row-amount={rowAmount}
         style="height: calc(((((var(--current-width) - 12rem) / var(--column-amount)) - 7rem) * (var(--row-amount) - 1)) + (var(--row-amount) * 7rem)) !important">
	<div class="icons" style="row-gap:calc(((var(--current-width) - 12rem) / var(--column-amount)) - 7rem);grid-template-columns: repeat(var(--column-amount), 7rem);">
		{#each currentIcons as icon}
			{#key icon}
				<BrandIconComponent bind:highlightedIcon bind:theme icon={icon} />
			{/key}
		{/each}
	</div>
</section>

<div class="pagination-actions">
	<button title="First Page" class="action {currentPage > 3 ? 'shown' : 'hidden'}" onclick="{() => currentPage = 1}">
		1
	</button>
	<div class="separator {currentPage > 3 ? 'shown' : 'hidden'}">
		<div class="circle"></div>
		<div class="circle"></div>
		<div class="circle"></div>
	</div>
	<button class="action {currentPage > 2 ? 'shown' : 'hidden'}" onclick="{() => currentPage -= 2}">{currentPage - 2}</button>
	<button class="action {currentPage > 1 ? 'shown' : 'hidden'}" onclick="{() => currentPage--}">{currentPage - 1}</button>
	<p class="action current-page">{currentPage}</p>
	<button class="action {(currentPage) < maxPage ? 'shown' : 'hidden'}" onclick="{() => currentPage++}">{currentPage + 1}</button>
	<button class="action {(currentPage + 1) < maxPage ? 'shown' : 'hidden'}" onclick="{() => currentPage += 2}">{currentPage + 2}</button>
	<div class="separator {(currentPage + 2) < maxPage ? 'shown' : 'hidden'}">
		<div class="circle"></div>
		<div class="circle"></div>
		<div class="circle"></div>
	</div>
	<button title="Last Page" class="action {(currentPage + 2) < maxPage ? 'shown' : 'hidden'}" onclick="{() => currentPage = maxPage}">
		{maxPage}
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
	
	@media (prefers-reduced-transparency: reduce) {
		.highlighted-icon {
			.h-icon {
				background:      var(--theme-ui-header) !important;
				backdrop-filter: none !important;
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
		
		background:      rgba(from var(--theme-ui-background) r g b / 0.3);
		
		pointer-events:  none;
		z-index:         50000;
		
		.h-icon {
			display:         flex;
			flex-flow:       row nowrap;
			align-items:     center;
			justify-content: space-between;
			background:      rgba(from var(--theme-ui-header) r g b / .75);
			backdrop-filter: blur(.5rem) grayscale(.25) brightness(.95);
			border-radius:   .6rem;
			
			overflow:        hidden;
			
			width:           80vw;
			height:          60vh;
			max-width:       80rem;
			max-height:      32rem;
			
			pointer-events:  all;
			
			z-index:         500;
			
			.close-button {
				position:        absolute;
				top:             1rem;
				right:           1rem;
				overflow:        hidden;
				
				width:           .975rem;
				height:          .975rem;
				
				background:      rgb(255 0 0 / .2);
				filter:          brightness(1.25) grayscale(.2);
				backdrop-filter: blur(.1rem);
				border-radius:   100%;
				
				cursor:          pointer;
				
				transition: var(--theme-transition-on);
				
				.gradient {
					width:      .975rem;
					height:     .975rem;
					background-image: radial-gradient(circle, transparent 0%, var(--theme-color-alert) 100%);
					opacity: .2;
					
					transition: var(--theme-transition-on);
				}
				
				&:hover {
					background: rgb(255 0 0 / .5);
					filter:     brightness(1.5);
					transition: none;
					
					.gradient {
						opacity: .85;
						transition: 20ms;
					}
				}
			}
			
			.right, .left {
				display:         flex;
				flex-flow:       column nowrap;
				justify-content: center;
				padding:         2rem;
			}
			
			.separator {
				width:           3px;
				border-radius:   4px;
				height:          65%;
				backdrop-filter: blur(1rem) brightness(1.5);
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
					position: relative;
					width:    90%;
					
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
					
					.prev-icon, .next-icon {
						cursor:  pointer;
						
						z-index: 500 !important;
					}
				}
			}
			
			.right {
				.brand-name {
					font-size: 2.25rem;
					z-index:   500 !important;
				}
				
				.brand-external {
					display:         flex;
					flex-flow:       row nowrap;
					align-items:     center;
					justify-content: center;
					gap:             .1rem;
					
					margin-top:      -.35rem;
					margin-bottom:   .75rem;
					
					font-size:       .75rem;
					color:           var(--theme-text-fourth);
					font-weight:     650;
					
					user-select:     none;
					
					transition:      var(--theme-transition-off);
					
					z-index:         500 !important;
					
					svg {
						color:      inherit;
						transform:  rotate(-45deg);
						width:      .9rem;
						height:     .9rem;
						transition: var(--theme-transition-off);
					}
					
					&:hover {
						text-decoration: underline;
						color:           var(--theme-color-accent);
						
						transition:      var(--theme-transition-on);
						
						svg {
							color:      var(--theme-color-accent);
							transition: var(--theme-transition-on);
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
						background:      light-dark(#2D3467, #262C59);
						
						cursor:          pointer;
						
						transition:      var(--theme-transition-off);
						
						svg {
							height:     1rem;
							width:      1rem;
							color:      var(--theme-ui-white);
							transition: var(--theme-transition-off);
						}
						
						&.inactive {
							color:  var(--theme-text-third) !important;
							filter: grayscale(1);
							cursor: no-drop;
							
							svg {
								color: var(--theme-text-third);
							}
							
							&:hover {
								background: light-dark(#2D3467, #262C59);
							}
						}
						
						&:hover {
							background: light-dark(#4954A8, #333A73);
							transition: var(--theme-transition-on);
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
					min-height:    6rem;
					max-height:    12rem;
					box-sizing:    border-box;
					
					background:    rgba(from var(--theme-ui-header) r g b / .5);
					border:        1px solid rgba(from var(--theme-ui-line) r g b / .5);
					border-radius: .5rem;
					
					overflow:      scroll;
					font-family:   'JetBrainsMono', monospace;
					font-size:     .85rem;
					font-weight:   500;
					
					z-index:       500 !important;
					
					.copy-button {
						position:        absolute;
						right:           3.5rem;
						transform:       translateY(1rem);
						z-index:         1000 !important;
						padding:         .35rem;
						cursor:          pointer;
						
						backdrop-filter: blur(2px) brightness(.75) grayscale(.25);
						border-radius:   .5rem;
						
						svg {
							color: var(--theme-ui-white);
						}
					}
					
					&::selection {
						background-color: rgba(from var(--theme-color-accent) r g b / .2);
					}
					
					:global {
						div {
							overflow: visible !important;
						}
						
						table tbody {
							background-color: rgba(from var(--theme-ui-sidebar) r g b / .2) !important;
							
							tr, td {
								background-color: transparent !important;
							}
							
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
					
					transition:   var(--theme-transition-off);
					
					z-index:      500 !important;
					
					p, a {
						color:      var(--theme-text-fourth);
						transition: var(--theme-transition-off);
					}
					
					a {
						font-weight: bold;
						
						&:hover {
							text-decoration: underline;
							color:           var(--theme-color-accent);
							transition:      var(--theme-transition-on);
						}
					}
				}
			}
		}
	}
	
	.brand-icons-sec {
		position: relative;
		
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
			display:          flex;
			align-items:      center;
			justify-content:  center;
			width:            3rem;
			height:           3rem;
			
			font-family:      'Bricolage Grotesque Variable', sans-serif;
			font-size:        1.35rem;
			font-weight:      900;
			
			background-image: var(--theme-ui-gradient-bg);
			border-radius:    .95rem;
			
			&.current-page {
				transform: scale(1.1);
				margin:    0 .5rem;
			}
			
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
					filter:  grayscale(.75);
					opacity: .5;
				}
				
				&.active {
					filter:  none;
					opacity: 1;
				}
			}
		}
	}
</style>