<script lang="ts">
	import './layout.css';
	import Header from './Header.svelte';
	import Sidebar from './Sidebar.svelte';
	import Footer from './Footer.svelte';

	const { children, data } = $props();
</script>

<Header />
<Sidebar version={data.version} />

<section class="main-container">
	{#if children}
		{@render children()}
		<Footer />
	{:else}
		<p>Loading...</p>
	{/if}
</section>

<style>
    .main-container {
        position: absolute;

        height: calc(100vh - 3rem);
        width: calc(100vw - 14rem);

        top: 3rem;
        left: 14rem;

        padding: 5rem 6rem 0 6rem;

        box-sizing: border-box;

        /*noinspection CssOverwrittenProperties*/
        overflow-y: scroll;
        /*noinspection CssOverwrittenProperties*/
        overflow-x: hidden;
        /*noinspection CssOverwrittenProperties*/
        overflow: auto;
    }
</style>