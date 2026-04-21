<script module lang="ts">
	import CopyableComponent from '$lib/components/CopyableComponent.svelte';
	import type { Flag } from '$lib/components/interfaces';
	import ContentHeaderComponent from '$lib/components/ContentHeaderComponent.svelte';
</script>

<script lang="ts">
	let { data } = $props();

	// svelte-ignore state_referenced_locally
	let flags: Flag[] = $derived(data.flags ?? []);
</script>

<ContentHeaderComponent title="Flag Icons" type="countries" amount={flags.length} />

<section class="icons-flags-sec">
	{#each flags as flag}
		<div class="country">
			<div class="title" style="--max-width: calc(9rem * {1 + flag.extra.length})">
				{flag.country}
			</div>
			<div class="icons">
				<CopyableComponent icon={flag.flag} title={flag.country} blur_content_bg={true} />
				{#each flag.extra as extra}
					<CopyableComponent icon={extra} title={flag.country} blur_content_bg={true} />
				{/each}
			</div>
		</div>
	{/each}
</section>

<style>
    /* Desktop & Tablet */
    @media (width >= 450px) {
				.icons-flags-sec {
            flex-flow: row wrap;
            align-items: flex-end;
            justify-content: space-between;
            gap: 1rem;

						.country {
                width: fit-content;
								padding-top: .65rem;

								.title {
                    font-size: 1.05rem;
										max-width: var(--max-width);
								}

								.icons {
                    align-items: flex-start;
                    justify-content: flex-start;
                    gap: .5rem;
								}
						}
				}
    }

    /* Phone */
    @media (width < 450px) {
				.icons-flags-sec {
            flex-flow: column nowrap;
            align-items: flex-start;
            justify-content: space-between;
            gap: 1.5rem;
						width: 100%;

						.country {
								width: 100%;

								.title {
										align-self: flex-start;
                    font-size: 1.05rem;
										max-width: 80%;
								}

								.icons {
                    align-items: center;
                    justify-content: flex-start;
                    gap: 1rem;
								}
						}
				}
    }

    .icons-flags-sec {
        display: flex;
        user-select: none;

        .country {
            display: flex;
            flex-flow: column nowrap;
            gap: .25rem;

            .title {
                font-family: 'Google Sans', 'Lexend', sans-serif;
                font-weight: 600;
								text-wrap-style: avoid-orphans;
								color: var(--theme-text-primary);
            }

            .icons {
                display: flex;
                flex-flow: row wrap;
            }
        }
    }
</style>