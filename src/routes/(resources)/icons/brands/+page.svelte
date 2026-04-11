<script module lang="ts">
	import CopyableComponent from '$lib/components/CopyableComponent.svelte';
	import type { Brand } from '$lib/components/interfaces';
	import LinkIcon from '$lib/assets/icons/LinkIcon.svelte';
</script>

<script lang="ts">
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';

	let { data } = $props();

	const brands: Brand[] = $derived(data.brands ?? []);

	let theme: 'light' | 'dark' = $state('light');
</script>

<section class="content-header">
	<div class="text">
		<h1 class="title">
			Brand Icons
		</h1>
		<div class="subtitle">
			<!--todo: Write subtitle-->
			<p>This page contains a bunch of brand assets.</p>
			<p>There are currently a total of <strong>{brands.length}</strong> brands showcased.</p>
		</div>
	</div>
	<div class="actions">
		<ThemeSwitcher bind:theme />
	</div>
</section>

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
					<CopyableComponent bind:theme content={theme === 'light' ? icon.regular : icon.dark} />
				{/each}
				{#each brand.logos as icon}
					<CopyableComponent bind:theme content={theme === 'light' ? icon.regular : icon.dark} />
				{/each}
			</div>
			<div class="extra source">
				{#if brand.info.source}
					<a href="{brand.info.source.href}" class="extra source">
						Sourced from <strong>{brand.info.source.name}</strong>
					</a>
				{/if}
			</div>
		</div>
	{/each}
</section>

<style>
    .icons-brands-sec {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        gap: 1rem;

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
								height: 1.25rem;
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