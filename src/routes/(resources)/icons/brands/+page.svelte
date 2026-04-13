<script module lang="ts">
	import CopyableComponent from '$lib/components/CopyableComponent.svelte';
	import type { Brand } from '$lib/components/interfaces';
	import LinkIcon from '$lib/assets/icons/LinkIcon.svelte';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';

	let brands: Brand[] = $state([]);
	let theme: 'light' | 'dark' = $state('light');
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	let { data } = $props();

	onMount(async () => {
		for (const brand of data.brands) {
			brands.push(brand);
		}
	});
</script>

<section class="content-header">
	<div class="text">
		<h1 class="title">
			Brand Icons
		</h1>
		<div class="subtitle">
			<!--todo: Write subtitle-->
			<p>Current showcase includes <strong style="color:color-mix(var(--theme-text-third) 25%, var(--theme-color-accent) 75%);">{brands.length}</strong> different brands</p>
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
				{#if brand.info.href}
					<a href="{brand.info.href}" rel="external" target="_blank" class="extra external">
						{brand.info.name}
						<div class="icon"><LinkIcon /></div>
					</a>
					{:else}
					{brand.info.name}
				{/if}
			</div>
			<div class="icons">
				{#each $state.eager(brand.icons) as icon}
					<CopyableComponent bind:theme content={theme === 'light' ? icon.regular : icon.dark} />
				{/each}
				{#each $state.eager(brand.logos) as icon}
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

				user-select: none;

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

								font-family: 'Google Sans', 'Lexend', sans-serif;
                font-size: 1.25rem;
                font-weight: 600;

								.extra.external {
										.icon {
                        opacity: 0;
                        transition: 200ms 120ms ease;
										}

                    display: flex;
                    flex-flow: row nowrap;
                    align-items: center;
                    justify-content: flex-start;
                    gap: .15rem;
								}
            }
						.title:hover .extra.external .icon {
								opacity: 1;
                transition: 65ms ease;
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