<script>
	import ComingSoonComponent from '$lib/components/ComingSoonComponent.svelte';
	
	const { data } = $props();
</script>

<svelte:head>
	<meta charset="utf-8">
	<title>{data.seo.title}</title>
	{#if data.seo.description}
		<meta name="description" content={data.seo.description} />
	{/if}
</svelte:head>

<ComingSoonComponent />

<!-- Assets - https://logoipsum.com -->
<!-- Assets - https://brandfetch.com -->
<!-- Tools - https://regex101.com -->