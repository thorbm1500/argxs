<script lang="ts">
	import ClipboardIcon from '$lib/assets/icons/ClipboardIcon.svelte';
	import DownloadIcon from '$lib/assets/icons/DownloadIcon.svelte';

	let { theme = $bindable(), icon = null, content = '', type = 'SVG' } = $props();

	//todo: Add manual loading for connections with reduced data usage
	//todo: navigator.connection.saveData
</script>

<div class="copyable-container {theme}">
	{#if type === 'SVG'}
		<div class="actions svg">
			<button class="copy" onclick="{() => navigator.clipboard.writeText(content)}"><ClipboardIcon /></button>
			<button class="download"><DownloadIcon /></button>
		</div>
	{/if}
	<div class="inner-content">
		{#if icon !== null}
			{@html icon.html}
		{:else}
			{@html content}
		{/if}
	</div>
</div>

<style>
    .copyable-container {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: center;

        height: 10rem;
        width: 10rem;
        padding: 1rem;

        border: 1px solid var(--theme-ui-line);
        border-radius: .65rem;

        box-sizing: border-box;

        .actions {
            opacity: 0;
            position: absolute;

            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            justify-content: center;
            gap: .25rem;

            height: 10rem;
            width: 10rem;

            border-radius: .65rem;

            .copy, .download {
								display: flex;
								align-items: center;
								justify-content: center;
								align-content: center;

                width: 2rem;
								height: 2rem;

                color: #202026;

                border: 1px solid var(--theme-ui-line);
                border-radius: .35rem;
								cursor: pointer;

                background: #e6e8ee;

								filter: blur(1px);
								transform: scale(.95);
                transition: 65ms ease;
            }

            transition: 65ms ease;
        }

        .actions:hover {
            opacity: 1;

						.copy,.download {
								filter: blur(0px);
                transform: scale(1);

								transition: 65ms ease;
						}

            transition: 35ms ease;
        }

        .inner-content :global {
            svg {
                height: 100%;
                width: 100%;
            }

            height: 100%;
            max-height: 2.5rem;
        }
    }

    .copyable-container.dark {
        background: linear-gradient(to top, #0D0D0D 0%, #161617 100%);
        border-color: #52555d;
        box-shadow: 0 0 .5rem rgb(13 13 13 / .15);
    }

    .copyable-container:hover {
        border-color: var(--theme-ui-line-highlight);
    }
</style>