<script module lang="ts">
	import CopyableComponent from '$lib/components/CopyableComponent.svelte';
	import type { Flag } from '$lib/components/interfaces';

	let flags: Flag[] = $state([]);
</script>

<script lang="ts">
	import { getContext, onMount } from 'svelte';

	let { data } = $props();

	// svelte-ignore state_referenced_locally
	flags = data.flags;
	let theme: 'light' | 'dark' = $state(getContext('theme'));

	onMount(async () => {
		window.cookieStore.addEventListener('change', async (e) => {
			for (const cookie of e.changed) {
				if (cookie.name === 'argxs_theme') {
					const currentTheme = await window.cookieStore.get('argxs_theme');
					if (currentTheme !== null) {
						theme = currentTheme.value === 'light' || currentTheme.value === 'dark' ? currentTheme.value : 'light';
					}
				}
			}
		});
	});
</script>

<section class="content-header {theme}">
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

<section class="icons-flags-sec {theme}">
	{#each flags as flag}
		<div class="country">
			<div class="icons">
				<CopyableComponent icon={flag.flag} title={flag.country} blur_content_bg={true} />
				{#each flag.extra as extra}
					<CopyableComponent icon={extra} title={flag.country} blur_content_bg={true} />
				{/each}
			</div>
			<div class="title" style="max-width: calc(9rem * {1 + flag.extra.length})">
				{flag.country}
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
            justify-content: flex-start;
            gap: .25rem;

						padding-top: 1.25rem;
            margin-bottom: .75rem;

						width: fit-content;

            .title {
                font-family: 'Google Sans', 'Lexend', sans-serif;
                font-size: .95rem;
                font-weight: 600;
								text-wrap: pretty;

								color: var(--theme-text-primary);
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