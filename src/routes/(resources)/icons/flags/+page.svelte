<script module lang="ts">
	import CopyableComponent from '$lib/components/CopyableComponent.svelte';
	import type { Flag } from '$lib/components/interfaces';
	import ContentHeaderComponent from '$lib/components/ContentHeaderComponent.svelte';
</script>

<script lang="ts">
	let { data } = $props();

	// svelte-ignore state_referenced_locally
	const flagIcons: Flag[] = $state.raw(data.flags ?? []);
</script>

<ContentHeaderComponent title="Flag Icons" custom={true}
                        content='<p>argxs currently showcases <strong style="color: color-mix(var(--theme-color-accent) 80%, var(--theme-ui-white) 20%);">{data.iconAmount}</strong> different flags.<br><i>Note: This page is currently outed, and will be updated in the future to the same layout and design of <a href="/icons/brands"><strong>icons#brands</strong></a>.</i></p>' />

<section class="theme-grid-content-layout">
	<div class="icons">
		{#each flagIcons as flagIcon}
			{#each flagIcon.flags as flag}
				<CopyableComponent path="/resources/icons/flags/{flag.svg}" name={flag.name ?? flagIcon.country} source={flag.source} date_added={flag.date_added} blur_content_bg={true} />
			{/each}
		{/each}
	</div>
</section>