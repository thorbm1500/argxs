<script>
	import ComingSoonComponent from '$lib/components/ComingSoonComponent.svelte';
	
	const { data } = $props();
</script>

<svelte:head>
	<title>{data.seo.title}</title>
</svelte:head>

<ComingSoonComponent />

<!-- Assets - https://logoipsum.com -->
<!-- Assets - https://brandfetch.com -->
<!-- Tools - https://regex101.com -->