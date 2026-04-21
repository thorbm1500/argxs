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
	{#each brands as brand}
		<div class="brand">
			<div class="title">
				{#if brand.href}
					<a href="{brand.href}" rel="external" target="_blank" class="extra external">
						<p>{brand.name}</p>
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
					<p>{brand.name}</p>
				{/if}
			</div>
			<div class="icons">
				{#if brand.icon !== undefined }
					<CopyableComponent title={brand.name.concat(theme === 'dark' && brand.icon.dark ? '_dark' : '')} icon={theme === 'light' ? brand.icon.default : brand.icon.dark ?? brand.icon.default } />
				{/if}
				{#if brand.logo !== undefined }
					<CopyableComponent title={brand.name.concat(theme === 'dark' && brand.logo.dark ? '_dark' : '')} icon={theme === 'light' ? brand.logo.default : brand.logo.dark ?? brand.logo.default } />
				{/if}
				{#each brand.extra as icon }
					<CopyableComponent title={brand.name.concat(theme === 'dark' && icon.dark ? '_dark' : '')} icon={theme === 'light' ? icon.default : icon.dark ?? icon.default } />
				{/each}
			</div>
		</div>
	{/each}
</section>

<style>
    /* Desktop & Tablet */
    @media (width >= 44rem) {
				.icons-brands-sec {
            justify-content: space-between;
						gap: 1rem;

            .brand {
                align-items: flex-start;

                .title {
                    font-size: 1.25rem;
                }
								.icons {
                    gap: .5rem;
								}
            }
        }
    }

    /* Phone */
    @media (width < 44rem) {
				.icons-brands-sec {
            justify-content: center;
            gap: 1.25rem;

            .brand {
                align-items: center;
								width: 100%;

                .title {
										align-self: flex-start;
                    font-size: 1.15rem;
										margin-left: .5rem;
                }
								.icons {
                    gap: 1.25rem;
								}
            }
				}
    }

    .icons-brands-sec {
        display: flex;
        flex-flow: row wrap;

        font-family: 'Lexend', sans-serif;

        user-select: none;

        .brand {
            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            gap: .25rem;

            margin-bottom: 1rem;

            .title {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: flex-start;

                font-family: 'Google Sans', 'Lexend', sans-serif;
                font-weight: 600;

								color: var(--theme-text-primary);

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
                align-items: center;
                justify-content: center;
            }
        }
    }
</style>