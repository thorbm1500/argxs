<script lang="ts">
	import { getContext } from 'svelte';

	const updateThemeContext = getContext('toggleTheme') as Function;

	let { theme = $bindable() } = $props();

	async function updateTheme() {
		if (!updateThemeContext) return;
		updateThemeContext();
		await window.cookieStore.set('argxs_theme', theme);
	}
</script>

<button title="" onclick="{updateTheme}" class="theme-switch-button {theme}">
	<!--suppress HtmlUnknownTag -->
	<div class="button-switch">
		<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
			{#if theme === 'light'}
				<path
					d="M12 2V4M12 20V22M4 12H2M6.31412 6.31412L4.8999 4.8999M17.6859 6.31412L19.1001 4.8999M6.31412 17.69L4.8999 19.1042M17.6859 17.69L19.1001 19.1042M22 12H20M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z"
					stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round" />
			{:else}
				<path
					d="M21.9548 12.9564C20.5779 15.3717 17.9791 17.0001 15 17.0001C10.5817 17.0001 7 13.4184 7 9.00008C7 6.02072 8.62867 3.42175 11.0443 2.04492C5.96975 2.52607 2 6.79936 2 11.9998C2 17.5227 6.47715 21.9998 12 21.9998C17.2002 21.9998 21.4733 18.0305 21.9548 12.9564Z"
					stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round" />
			{/if}
		</svg>
	</div>
</button>

<style>
    .theme-switch-button {
        box-sizing: border-box !important;

        width: 3rem;
        height: 1.5rem;

        cursor: pointer;

        background: var(--theme-ui-container);
        border: 1px solid var(--theme-ui-line);
        border-radius: 1rem;

        .button-switch {
            position: relative;
            top: .05rem;
            left: .15rem;

            backdrop-filter: blur(1px) brightness(1.15) contrast(1.15);
            width: 1.125rem;
            height: 1.125rem;
            border-radius: 100%;

            color: var(--theme-color-secondary);

            display: flex;
            align-items: center;
            justify-content: center;

            transition: 175ms cubic-bezier(0.125, 0.885, 0.420, 1.2);
        }
    }

    .theme-switch-button:hover .button-switch {
        color: var(--theme-color-accent);
    }

    .theme-switch-button.dark .button-switch {
        left: 1.6rem;
        transform: rotate(720deg);
        transition: 175ms cubic-bezier(0.125, 0.885, 0.420, 1.2);
    }
</style>