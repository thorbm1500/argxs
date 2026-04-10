<script lang="ts">
	import {page} from '$app/state';
	import LightningIcon from '$lib/assets/icons/LightningIcon.svelte';
	import HomeIcon from '$lib/assets/icons/HomeIcon.svelte';
	import FlagIcon from '$lib/assets/icons/FlagIcon.svelte';
	import BrandIcon from '$lib/assets/icons/BrandIcon.svelte';
	import BaseColorIcon from '$lib/assets/icons/BaseColorIcon.svelte';
	import GradientIcon from '$lib/assets/icons/GradientIcon.svelte';
	import ExternalIcon from '$lib/assets/icons/ExternalIcon.svelte';
	import TypographyIcon from '$lib/assets/icons/TypographyIcon.svelte';
</script>

<section class="sidebar-section">
	<div class="nav-top">
		<a class={{selected: page.url.pathname === '/'}} href="/" target="_self">
			<HomeIcon />
			Home
		</a>
		<a class={{selected: page.url.pathname === '/concept'}} href="/concept" target="_self">
			<LightningIcon />
			Core Concept
		</a>
	</div>

	<div class="nav-section">
		<h1 class="title {page.url.pathname.startsWith('/icons') ? 'selected' : ''}">Icons</h1>
		<a class={{selected: page.url.pathname === '/icons/flags'}} href="/icons/flags" target="_self">
			<FlagIcon />
			Flags
		</a>
		<a class={{selected: page.url.pathname === '/icons/brands'}} href="/icons/brands" target="_self">
			<BrandIcon />
			Brands
		</a>
	</div>

	<div class="nav-section">
		<h1 class="title {page.url.pathname.startsWith('/colors') ? 'selected' : ''}">Colors</h1>
		<a class={{selected: page.url.pathname === '/colors/general'}} href="/colors/general" target="_self">
			<BaseColorIcon />
			General
		</a>
		<a class={{selected: page.url.pathname === '/colors/gradients'}} href="/colors/gradients" target="_self">
			<GradientIcon />
			Gradients
		</a>
	</div>

	<div class="nav-section">
		<h1 class="title {page.url.pathname.startsWith('/other') ? 'selected' : ''}">Other</h1>
		<a class={{selected: page.url.pathname === '/other/typography'}} href="/other/typography" target="_self">
			<TypographyIcon />
			Typography
		</a>
		<a class={{selected: page.url.pathname === '/other/external'}} href="/other/external" target="_self">
			<ExternalIcon />
			External
		</a>
	</div>
</section>

<style>
	.sidebar-section {
			position: absolute;

      height: calc(100vh - 3rem);
			width: 14rem;
			top: 3rem;
			padding: 1.5rem;

			border-right: 1px solid var(--theme-ui-line);

			display: flex;
			flex-flow: column nowrap;
			align-items: flex-start;
			justify-content: flex-start;
			gap: 1rem;

			.nav-top {
          display: flex;
          flex-flow: column nowrap;
          align-items: flex-start;
          justify-content: flex-start;
			}

			.nav-section {
          display: flex;
          flex-flow: column nowrap;
          align-items: flex-start;
          justify-content: flex-start;

					.title {
							font-size: .95rem;
              color: var(--theme-text-secondary);
							margin-bottom: .25rem;
					}

					.title.selected {
							color: var(--theme-text-primary);
					}

					a {
							height: 1.5rem;
							padding-left: .5rem;
							margin-left: .25rem;
							border-left: 2px solid var(--theme-ui-line);
					}

					a.selected,a:hover {
							border-left-color: var(--theme-ui-line-highlight);
					}
			}

			a {
					display: flex;
					flex-flow: row nowrap;
					align-items: center;
					justify-content: center;
					font-size: .9rem;
					font-weight: 375;
					color: var(--theme-text-secondary);
			}

			a.selected,a:hover {
					color: var(--theme-text-primary);
			}
	}
</style>