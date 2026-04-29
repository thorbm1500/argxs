<script lang='ts'>
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

<ContentHeaderComponent amount={data.iconAmount} title='Brand Icons' type='brand icons'/>

<section class='theme-grid-content-layout'>
	<div class='icons'>
		{#each brands as brand}
			{#each brand.assets as asset}
				{#if theme === 'light' || !asset.dark}
					<CopyableComponent path='/resources/icons/brands/{asset.default.svg}'
					                   name={asset.default.name ?? brand.name}
					                   href={asset.default.href ?? brand.href}
					                   source={asset.default.source}
					                   date_added={asset.default.date_added}/>
				{/if}
				{#if theme === 'light'}
					{#if asset.monochrome_black}
						<CopyableComponent path='/resources/icons/brands/{asset.monochrome_black.svg}'
						                   name={asset.monochrome_black.name ?? brand.name}
						                   href={asset.monochrome_black.href ?? brand.href}
						                   source={asset.monochrome_black.source}
						                   date_added={asset.monochrome_black.date_added}/>
					{/if}
				{:else}
					{#if asset.dark}
						<CopyableComponent path='/resources/icons/brands/{asset.dark.svg}'
						                   name={asset.dark.name ?? brand.name}
						                   href={asset.dark.href ?? brand.href}
						                   source={asset.dark.source}
						                   date_added={asset.dark.date_added}/>
					{/if}
					{#if asset.monochrome_white}
						<CopyableComponent path='/resources/icons/brands/{asset.monochrome_white.svg}'
						                   name={asset.monochrome_white.name ?? brand.name}
						                   href={asset.monochrome_white.href ?? brand.href}
						                   source={asset.monochrome_white.source}
						                   date_added={asset.monochrome_white.date_added}/>
					{/if}
				{/if}
			{/each}
		{/each}
	</div>
</section>