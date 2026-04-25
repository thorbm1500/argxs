<script module lang="ts">
	import CopyableComponent from '$lib/components/CopyableComponent.svelte';
	import type { Flag } from '$lib/components/interfaces';
	import ContentHeaderComponent from '$lib/components/ContentHeaderComponent.svelte';
</script>

<script lang="ts">
	let { data } = $props();

	// svelte-ignore state_referenced_locally
	const flags: Flag[] = $state.raw(data.flags ?? []);
</script>

<ContentHeaderComponent title="Flag Icons" type="flags" amount={data.iconAmount} />

<section class="icons-flags-sec">
	<div class="icons">
		{#each flags as flag}
			<CopyableComponent icon={flag.flag} name={flag.country} title={flag.flag.name ?? flag.country} blur_content_bg={true} />
			{#each flag.extra as extra}
				<CopyableComponent icon={extra} name={flag.country} title={extra.name ?? flag.country} blur_content_bg={true} />
			{/each}
		{/each}
	</div>
</section>

<style>
    /* Desktop & Tablet */
    @media (width >= 44rem) {
        .icons-flags-sec {
            .icons {
                grid-template-columns: repeat(8, auto);
                row-gap: 1.85rem;
            }
        }
    }

    /* Phone */
    @media (width < 44rem) {
        .icons-flags-sec {
            .icons {
                grid-template-columns: repeat(2, auto);
                gap: 1.25rem;

								font-size: .9rem;
            }
        }
    }

    .icons-flags-sec {
        user-select: none;

        .icons {
            display: grid;
        }
    }
</style>