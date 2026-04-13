<script lang="ts">
	let { theme = $bindable(), icon = null, content = '', type = 'SVG' } = $props();

	//todo: Add manual loading for connections with reduced data usage
	//todo: navigator.connection.saveData
</script>

<div class="copyable-container {theme}">
	{#if type === 'SVG'}
		<div class="actions svg">
			<button class="copy" onclick="{() => navigator.clipboard?.writeText(content)}">
				Copy SVG
			</button>
			<!--<button class="download"><DownloadIcon /></button>-->
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

        border-radius: .45rem;

        box-sizing: border-box;

        .actions {
            position: absolute;

            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            justify-content: center;
            gap: .25rem;

            height: 10rem;
            width: 10rem;

            border: 1px solid var(--theme-ui-line);
            border-radius: .45rem;

            .copy, .download {
								opacity: 0;
								display: flex;
								align-items: center;
								justify-content: center;
								align-content: center;

                width: fit-content;
								height: fit-content;
								padding: .25rem .5rem;

                color: #f7f9fc;
								font-family: 'Lexend', sans-serif;
								font-weight: 500;
								font-size: .8rem;

                border-radius: .5rem;
								cursor: pointer;

                background: var(--theme-color-accent);
								border: 1px solid transparent;

								filter: blur(1px);
								transform: scale(.95);
                transition: 120ms ease;
            }

						.copy:hover,.download:hover {
                border-color: #6091fa;

                transition: 65ms ease;
						}

            transition: 25ms 120ms ease;
        }

        .actions:hover {
						backdrop-filter: blur(.15rem) grayscale(.1);

						.copy,.download {
								opacity: 1;

								filter: blur(0px);
                transform: scale(1);

                transition: 35ms ease;
						}

            transition: 35ms ease;
        }

        .inner-content :global {
            svg {
                height: 100%;
                width: 100%;
            }

            height: 100%;
						width: 100%;
						max-width: 8rem;
            max-height: 2.5rem;

						box-sizing: content-box;
        }
    }

    .copyable-container.dark {
        background: linear-gradient(to top, #0D0D0D 0%, #161617 100%);
        border-color: #52555d;
        box-shadow: 0 0 .5rem rgb(13 13 13 / .15);
    }

    .copyable-container:hover {
        /*border-color: var(--theme-ui-line-highlight);*/
    }
</style>