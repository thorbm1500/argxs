<script module lang="ts">
	import CopyableComponent from '$lib/components/CopyableComponent.svelte';
	import type { Flag } from '$lib/components/interfaces';

	let flags: Flag[] = $state([]);
</script>

<script lang="ts">
	let { data } = $props();

	// svelte-ignore state_referenced_locally
	flags = data.flags;
</script>

<section class="content-header">
	<div class="text">
		<h1 class="title">
			Flag Icons
		</h1>
		<div class="subtitle">
			<!--todo: Write subtitle-->
			<p>argxs currently showcases <strong style="color:color-mix(var(--theme-text-third) 25%, var(--theme-color-accent) 75%);">{flags.length}</strong> different countries</p>
		</div>
	</div>
</section>

<section class="icons-flags-sec">
	{#each flags as flag}
		<div class="country">
			<div class="title" style="max-width: calc(9rem * {1 + flag.assets.extra.length})">
				{flag.country}
			</div>
			<div class="icons">
				<CopyableComponent icon={flag.assets.flag} title={flag.country} blur_content_bg={true} />

				{#each flag.assets.extra as extra}
					<CopyableComponent icon={extra} title={flag.country} blur_content_bg={true} />
				{/each}
			</div>
			<!--todo: Implement showing source for each individual SVG shown
			<div class="extra source">
				{#if flag.source}
					<a href="{flag.source.href}" class="extra source">
						Sourced from <strong>{flag.source.name}</strong>
					</a>
				{/if}
			</div>-->
		</div>
	{/each}
</section>

<style>
    .icons-flags-sec {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        gap: 1rem;

        font-family: 'Lexend', sans-serif;

        user-select: none;

        .country {
            display: flex;
            flex-flow: column nowrap;
            align-items: flex-start;
            justify-content: flex-end;
            gap: .25rem;

						padding-top: 1.25rem;
            margin-bottom: .75rem;

						width: fit-content;

            .title {
                font-family: 'Google Sans', 'Lexend', sans-serif;
                font-size: 1.1rem;
                font-weight: 600;
								text-wrap: pretty;
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