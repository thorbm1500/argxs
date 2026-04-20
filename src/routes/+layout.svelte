<script lang="ts">
	import './layout.css';
	import Header from './Header.svelte';
	import Sidebar from './Sidebar.svelte';
	import Footer from './Footer.svelte';
	import { beforeNavigate } from '$app/navigation';
	import { updated } from '$app/state';
	import { setContext } from 'svelte';

	const { children, data } = $props();

	beforeNavigate(({ willUnload, to }) => {
		if (updated.current && !willUnload && to?.url) {
			location.href = to.url.href;
		}
	});

	//svelte-ignore state_referenced_locally
	let theme: 'light' | 'dark' = $state(data.theme);
	//svelte-ignore state_referenced_locally
	setContext('theme', theme);
</script>

<Header bind:theme />
<Sidebar bind:theme version={data.version} />

<section class="main-container {theme}">
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
        width: calc(100vw - 16rem);

        top: 3rem;
        left: 16rem;

        padding: 5rem 6rem 0 6rem;

        box-sizing: border-box;

				background: var(--theme-ui-background);

        /*noinspection CssOverwrittenProperties*/
        overflow-y: scroll;
        /*noinspection CssOverwrittenProperties*/
        overflow-x: hidden;
        /*noinspection CssOverwrittenProperties*/
        overflow: auto;
    }
</style>