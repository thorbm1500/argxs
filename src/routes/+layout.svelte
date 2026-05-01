<script lang="ts">
	import './layout.css';
	import Header from './Header.svelte';
	import Sidebar from './Sidebar.svelte';
	import Footer from './Footer.svelte';
	import { beforeNavigate } from '$app/navigation';
	import { updated } from '$app/state';
	import { onMount, setContext } from 'svelte';
	import ToastComponent, { type ToastRequest } from '$lib/components/ToastComponent.svelte';

	const { children, data } = $props();
3
	let sidebarState: boolean = $state.raw(true);

	beforeNavigate(({ willUnload, to }) => {
		if (updated.current && !willUnload && to?.url) {
			location.href = to.url.href;
		}
	});

	//svelte-ignore state_referenced_locally
	let theme: 'light' | 'dark' = $state.raw(data.theme ?? 'light');
	setContext('theme', () => theme);

	const toggleFn = (changedTo?: 'dark' | 'light') => {
		if (changedTo) theme = changedTo;
		else theme = theme === 'light' ? 'dark' : 'light';
		window?.cookieStore?.set('argxs_theme', theme);
	};
	setContext('toggleTheme', toggleFn);

	let sendToast: any = $state.raw(undefined);
	setContext('sendToast', (req: ToastRequest) => sendToast?.(req));
	
	onMount(() => {
		// Automatically sets the page theme to dark, if dark is preferred, for new users.
		if (!data.theme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			toggleFn('dark');
		}
	});
</script>

<ToastComponent bind:sendFunction={sendToast} />

<Header bind:theme bind:sidebarState />
<Sidebar bind:theme bind:sidebarState version={data.version} requests={data.requests} />

<section id="main-container" class="main-container {theme}">
	{#if children}
		{@render children()}
		<Footer />
	{:else}
		<p>Loading...</p>
	{/if}
</section>

<style>
    /* Desktop & Tablet */
    @media (width >= 44rem) {
        .main-container {
            padding: 5rem 6rem 0 6rem;
        }
    }

    /* Phone */
    @media (width < 44rem) {
        .main-container {
            padding: 3rem 2rem 0 2rem;
        }
    }

    .main-container {
        position: absolute;
        bottom: 0;
	    left: 0;
	    
	    height: calc(100vh - var(--header-height) + 1px);
	    width: 100vw;
        box-sizing: border-box;

        /*noinspection CssOverwrittenProperties*/
        overflow-y: scroll;
        /*noinspection CssOverwrittenProperties*/
        overflow-x: hidden !important;
        /*noinspection CssOverwrittenProperties*/
        overflow: auto;

        background: var(--theme-ui-background);
    }
</style>