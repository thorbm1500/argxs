<script lang="ts">
	import CopyableComponent from '$lib/components/CopyableComponent.svelte';
	import type { Brand } from '$lib/components/interfaces';
	import { getContext } from 'svelte';
	import ContentHeaderComponent from '$lib/components/ContentHeaderComponent.svelte';

	const { data } = $props();

	const getTheme = getContext('theme') as Function;
	let theme: 'dark' | 'light' = $derived(getTheme());

	// svelte-ignore state_referenced_locally
	let brands: Brand[] = $derived(data.brands ?? []);
</script>

<ContentHeaderComponent title="Brand Icons" type="brand icons" amount={data.iconAmount} />

<section class="theme-grid-content-layout">
	<div class="icons">
		{#each brands as brand}
			{#each brand.assets as asset}
				<CopyableComponent path="/resources/icons/brands/{theme === 'dark' && asset.dark ? asset.dark.svg: asset.default.svg}"
				                   name={theme === 'dark' && asset.dark ? (asset.dark.name ?? brand.name) : (asset.default.name ?? brand.name)} />
				{#if asset.monochrome_black && theme === 'dark'}
					<CopyableComponent path="/resources/icons/brands/{asset.monochrome_black.svg}" name={asset.monochrome_black.name ?? brand.name} />
				{/if}
				{#if asset.monochrome_white && theme === 'light'}
					<CopyableComponent path="/resources/icons/brands/{asset.monochrome_white.svg}" name={asset.monochrome_white.name ?? brand.name} />
				{/if}
			{/each}
		{/each}
	</div>
</section>