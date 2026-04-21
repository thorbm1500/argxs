<script module lang="ts">
	let sidebarState: boolean = $state.raw(false);
</script>

<script lang="ts">
	import './layout.css';
	import Header from './Header.svelte';
	import Sidebar from './Sidebar.svelte';
	import Footer from './Footer.svelte';
	import { beforeNavigate } from '$app/navigation';
	import { updated } from '$app/state';
	import { onMount, setContext } from 'svelte';

	const { children, data } = $props();

	beforeNavigate(async ({ willUnload, to }) => {
		sidebarState = false;
		if (await updated.check() && !willUnload && to?.url) {
			location.href = to.url.href;
		}
	});

	//svelte-ignore state_referenced_locally
	let theme: 'light' | 'dark' = $state.raw(data.theme);
	setContext('theme', () => theme);

	const toggleFn = () => {
		theme = theme === 'light' ? 'dark' : 'light';
		if (window?.cookieStore) {
			window.cookieStore.set('argxs_theme', theme);
		}
	};
	setContext('toggleTheme', toggleFn);

	onMount(async () => {
		const themeCookie = await window.cookieStore.get('argxs_theme');

		if (themeCookie == null || !(themeCookie.value === 'dark' || themeCookie.value === 'light')) {
			await window.cookieStore.set('argxs_theme', theme);
		}
		else {
			theme = themeCookie.value;
		}
	});
</script>

<Header bind:theme bind:sidebarState />
<Sidebar bind:theme bind:sidebarState version={data.version} />

<section class="main-container {theme}">
	{#if children}
		{@render children()}
		<Footer bind:theme />
	{:else}
		<p>Loading...</p>
	{/if}
</section>

<style>
    /* Desktop & Tablet */
    @media (width >= 450px) {
				.main-container {
            left: var(--sidebar-width);
            padding: 5rem 6rem 0 6rem;
				}
    }

    /* Phone */
    @media (width < 450px) {
				.main-container {
						left: 0;
            padding: 3rem 2rem 0 2rem;
				}
    }

    .main-container {
        position: absolute;

        height: calc(100vh - var(--header-height) + 1px);
        width: calc(100vw - var(--sidebar-width));

        bottom: 0;

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