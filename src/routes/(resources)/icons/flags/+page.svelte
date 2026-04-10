<script lang="ts">
	import CopyableComponent from '$lib/components/CopyableComponent.svelte';

	let { data } = $props();

	const files: string[] = $derived(data.files ?? []);
</script>

<section>
	{#each files as file}
		<CopyableComponent content={file} />
	{/each}
</section>

<style>

</style>