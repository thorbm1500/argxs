<script lang="ts">
	let { theme = $bindable() } = $props();
</script>

<div class="button-container">
	<button class={{selected: theme === 'light'}} onclick="{() => theme = 'light'}">
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M12 2V4M12 20V22M4 12H2M6.31412 6.31412L4.8999 4.8999M17.6859 6.31412L19.1001 4.8999M6.31412 17.69L4.8999 19.1042M17.6859 17.69L19.1001 19.1042M22 12H20M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		Light
	</button>
	<button class={{selected: theme === 'dark'}} onclick="{() => theme = 'dark'}">
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M21.9548 12.9564C20.5779 15.3717 17.9791 17.0001 15 17.0001C10.5817 17.0001 7 13.4184 7 9.00008C7 6.02072 8.62867 3.42175 11.0443 2.04492C5.96975 2.52607 2 6.79936 2 11.9998C2 17.5227 6.47715 21.9998 12 21.9998C17.2002 21.9998 21.4733 18.0305 21.9548 12.9564Z"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		Dark
	</button>
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