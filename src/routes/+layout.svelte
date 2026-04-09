<script lang="ts">
	import './layout.css';
	import Header from './Header.svelte';
	import Sidebar from './Sidebar.svelte';

	const { children } = $props();
</script>

<Header />
<Sidebar />

<section class="main-container">
	{@render children()}
</section>

<style>
	.main-container {
			position: absolute;

			height: calc(100vh - 3rem);
			width: calc(100vw - 14rem);

			top: 3rem;
			left: 14rem;

			padding: 3rem;

			box-sizing: border-box;
			overflow-y: scroll;
			overflow-x: hidden;
			overflow: auto;
	}
</style>