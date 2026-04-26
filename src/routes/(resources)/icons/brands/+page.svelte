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
			{#if brand.icon !== undefined}
				<CopyableComponent icon={theme === 'light' ? brand.icon.default : (brand.icon.dark ?? brand.icon.default)} name={brand.name.concat(theme === 'dark' && brand.icon.dark ? '_dark' : '')}
				                   title={brand.icon.default.name ?? brand.name} />
				{#if brand.icon.monochrome_white || brand.icon.monochrome_black}
					<CopyableComponent icon={theme === 'dark' ? brand.icon.monochrome_white : brand.icon.monochrome_black} name={brand.name.concat('_monochrome_',theme==='dark'?'white':'black')}
					                   title={(theme === 'dark' ? brand.icon.monochrome_white?.name : brand.icon.monochrome_black?.name) ?? brand.name} />
				{/if}
			{/if}
			{#if brand.logo !== undefined}
				<CopyableComponent title={brand.logo.default?.name ?? brand.name} name={brand.name.concat(theme === 'dark' && brand.logo.dark ? '_dark' : '')}
				                   icon={theme === 'light' ? brand.logo.default : (brand.logo.dark ?? brand.logo.default)} />
				{#if brand.logo.monochrome_white || brand.logo.monochrome_black}
					<CopyableComponent title={(theme === 'dark' ? brand.logo.monochrome_white?.name : brand.logo.monochrome_black?.name) ?? brand.name}
					                   icon={theme === 'dark' ? brand.logo.monochrome_white : brand.logo.monochrome_black} name={brand.name.concat('_monochrome_',theme==='dark'?'white':'black')} />
				{/if}
			{/if}
			{#each brand.extra as icon}
				<CopyableComponent name={brand.name.concat(theme === 'dark' && icon.dark ? '_dark' : '')} title={icon.default?.name ?? brand.name}
				                   icon={theme === 'light' ? icon.default : (icon.dark ?? icon.default)} />
				{#if theme === 'dark' && icon.monochrome_white }
					<CopyableComponent name={brand.name.concat('_monochrome_white')} icon={icon.monochrome_white}
					                   title={icon.monochrome_white.name ?? brand.name} />
				{/if}
				{#if theme === 'light' && icon.monochrome_black }
					<CopyableComponent name={brand.name.concat('_monochrome_black')} icon={icon.monochrome_black}
					                   title={icon.monochrome_black.name ?? brand.name} />
				{/if}
			{/each}
		{/each}
	</div>
</section>