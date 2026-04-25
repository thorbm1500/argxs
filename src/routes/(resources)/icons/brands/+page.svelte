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

<ContentHeaderComponent title="Brand Icons" type="brands" amount={brands.length} />

<section class="icons-brands-sec">
	<div class="icons">
		{#each brands as brand}
			{#if brand.icon !== undefined}
				<CopyableComponent name={brand.name.concat(theme === 'dark' && brand.icon.dark ? '_dark' : '')}
				                   title={brand.icon.default?.name ?? brand.name}
				                   icon={theme === 'light' ? brand.icon.default : (brand.icon.dark ?? brand.icon.default)}
				/>
			{/if}
			{#if brand.logo !== undefined}
				<CopyableComponent name={brand.name.concat(theme === 'dark' && brand.logo.dark ? '_dark' : '')}
				                   title={brand.logo.default?.name ?? brand.name}
				                   icon={theme === 'light' ? brand.logo.default : (brand.logo.dark ?? brand.logo.default)}
				/>
			{/if}
			{#each brand.extra as icon}
				<CopyableComponent name={brand.name.concat(theme === 'dark' && icon.dark ? '_dark' : '')}
				                   title={icon.default?.name ?? brand.name}
				                   icon={theme === 'light' ? icon.default : (icon.dark ?? icon.default)}
				/>
			{/each}
		{/each}
	</div>
</section>

<style>
    /* Desktop & Tablet */
    @media (width >= 44rem) {
        .icons-brands-sec {
            .icons {
                grid-template-columns: repeat(8, auto);
                row-gap: 1.85rem;
            }
        }
    }

    /* Phone */
    @media (width < 44rem) {
        .icons-brands-sec {
            justify-content: center;
            row-gap: 1.85rem;
            column-gap: 1.25rem;
        }
    }

    .icons-brands-sec {
        font-family: 'Lexend', sans-serif;

        user-select: none;

        .icons {
            display: grid;
        }
    }
</style>