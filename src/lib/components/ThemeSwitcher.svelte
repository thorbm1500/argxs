<script lang="ts">
	import SunIcon from '$lib/assets/icons/SunIcon.svelte';
	import MoonIcon from '$lib/assets/icons/MoonIcon.svelte';

	let { theme = $bindable() } = $props();
</script>

<div class="button-container">
	<button class={{selected: theme === 'light'}} onclick="{() => theme = 'light'}"><SunIcon />Light</button>
	<button class={{selected: theme === 'dark'}} onclick="{() => theme = 'dark'}"><MoonIcon />Dark</button>
</div>

<style>
    .button-container {
				display: flex;
				flex-flow: row nowrap;
				align-items: center;
				justify-content: center;
				gap: .25rem;

        width: fit-content;

				border: 1px solid var(--theme-ui-line);
				border-radius: .65rem;
				padding: .25rem;

				button {
						display: flex;
						align-items: center;
						justify-content: center;

						cursor: pointer;
            color: var(--theme-color-secondary);

            border: 1px solid transparent;
            border-radius: .5rem;
						padding: .25rem .5rem;

            backdrop-filter: brightness(1) opacity(0);
				}

				button.selected {
						color: var(--theme-color-accent);
            border-color: rgb(98 122 245 / .5);
            border-radius: .5rem;
						background-color: rgb(98 118 245 / .1);

						backdrop-filter: brightness(1.05) opacity(.25);
				}

				button:hover {
            color: var(--theme-color-accent);
				}
    }
</style>