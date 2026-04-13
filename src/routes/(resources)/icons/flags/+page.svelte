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
			<div class="title">
				{flag.country}
			</div>
			<div class="icons">
				{#if flag.icons }
					{#if flag.icons.default }
						<CopyableComponent content={flag.icons.default} blur_content_bg={true} />
					{/if}
					{#if flag.icons.square }
						<CopyableComponent content={flag.icons.square} blur_content_bg={true} />
					{/if}
					{#if flag.icons.circular }
						<CopyableComponent content={flag.icons.circular} blur_content_bg={true} />
					{/if}

					{#each flag.icons.extras as extra}
						<CopyableComponent content={extra} blur_content_bg={true} />
					{/each}
				{/if}
			</div>
			<div class="extra source">
				{#if flag.source}
					<a href="{flag.source.href}" class="extra source">
						Sourced from <strong>{flag.source.name}</strong>
					</a>
				{/if}
			</div>
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