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

<ContentHeaderComponent title="Flag Icons" type="flags" amount={data.iconAmount} />

<section class="theme-grid-content-layout">
	<div class="icons">
		{#each flagIcons as flagIcon}
			{#each flagIcon.flags as flag}
				<CopyableComponent path="/resources/icons/flags/{flag.svg}" name={flag.name ?? flagIcon.country} source={flag.source} date_added={flag.date_added} blur_content_bg={true} />
			{/each}
		{/each}
	</div>
</section>