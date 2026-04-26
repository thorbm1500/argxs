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

<section class="theme-grid-content-layout">
	<div class="icons">
		{#each flags as flag}
			<CopyableComponent icon={flag.flag} name={flag.country} title={flag.flag.name ?? flag.country} blur_content_bg={true} />
			{#each flag.extra as extra}
				<CopyableComponent icon={extra} name={flag.country} title={extra.name ?? flag.country} blur_content_bg={true} />
			{/each}
		{/each}
	</div>
</section>