<script module lang="ts">
	import CopyableComponent from '$lib/components/CopyableComponent.svelte';
	import type { Brand } from '$lib/components/interfaces';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';

	let brands: Brand[] = $state([]);
	let theme: 'light' | 'dark' = $state('light');
</script>

<script lang="ts">
	let { data } = $props();

	// svelte-ignore state_referenced_locally
	brands = data.brands;
</script>

<section class="content-header">
	<div class="text">
		<h1 class="title">
			Brand Icons
		</h1>
		<div class="subtitle">
			<!--todo: Write subtitle-->
			<p>argxs currently showcases <strong style="color:color-mix(var(--theme-text-third) 25%, var(--theme-color-accent) 75%);">{brands.length}</strong> different brands</p>
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
						<div class="icon">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path
									d="M12.7076 18.3639L11.2933 19.7781C9.34072 21.7308 6.1749 21.7308 4.22228 19.7781C2.26966 17.8255 2.26966 14.6597 4.22228 12.7071L5.63649 11.2929M18.3644 12.7071L19.7786 11.2929C21.7312 9.34024 21.7312 6.17441 19.7786 4.22179C17.826 2.26917 14.6602 2.26917 12.7076 4.22179L11.2933 5.636M8.50045 15.4999L15.5005 8.49994"
									stroke="currentColor"
									stroke-width="2.25"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</div>
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
												svg {
                            width: 1.15rem;
                            height: 1.15rem;
												}

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