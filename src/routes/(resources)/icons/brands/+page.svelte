<script lang="ts">
	import CopyableComponent from '$lib/components/CopyableComponent.svelte';
	import type { Brand } from '$lib/components/interfaces';
	import LinkIcon from '$lib/assets/icons/LinkIcon.svelte';

	let { data } = $props();

	const brands: Brand[] = $derived(data.brands ?? []);
</script>

<section class="icons-brands-sec">
	{#each brands as brand}
		<div class="brand">
			<div class="title">
				{brand.info.name}
				{#if brand.info.href}
					<a href="{brand.info.href}" rel="external" target="_blank" class="extra">
						<LinkIcon />
					</a>
				{/if}
			</div>
			<div class="icons">
				{#each brand.icons as icon}
					<CopyableComponent content={icon.regular} />
				{/each}
				{#each brand.logos as icon}
					<CopyableComponent content={icon.regular} />
				{/each}
			</div>
			{#if brand.info.source}
				<a href="{brand.info.source.href}" class="extra source">
					Sourced from <strong>{brand.info.source.name}</strong>
				</a>
			{/if}
		</div>
	{/each}
</section>

<style>
    .icons-brands-sec {
        font-family: 'Lexend', sans-serif;

        .brand {
            display: flex;
            flex-flow: column nowrap;
            align-items: flex-start;
            justify-content: center;
            gap: .25rem;

            margin-bottom: 1rem;

            .title {
								display: flex;
								flex-flow: row nowrap;
								align-items: center;
								justify-content: flex-start;
								gap: .15rem;

                font-size: 1.25rem;
                font-weight: 500;
            }

            .extra.source {
                font-size: .75rem;
                color: var(--theme-text-third);
            }

            .icons {
                display: flex;
                flex-flow: row wrap;
                align-items: flex-start;
                justify-content: flex-start;
                gap: .5rem;
            }
        }
    }
</style>