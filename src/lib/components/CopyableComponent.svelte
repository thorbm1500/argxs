<script lang="ts">
	let { theme = $bindable(), content = '', type = 'SVG', blur_content_bg = false } = $props();

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
		{#if blur_content_bg}
			<div class="blurred">
				<div class="content">{@html content}</div>
			</div>
		{/if}
		{@html content}
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

				perspective: 250px;
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

            z-index: 200;

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
                transition: 200ms ease-out;
            }

            .copy:hover, .download:hover {
                border-color: #6091fa;

                transition: 50ms ease;
            }

            transition: 200ms ease-out;
        }

        .actions:hover {
            backdrop-filter: blur(.1rem) grayscale(.15);

            .copy, .download {
                opacity: 1;

                filter: blur(0px);
                transform: scale(1);

                transition: 35ms ease;
            }

            transition: 35ms ease;
        }

        .inner-content :global {
            position: relative;
						
            svg :global {
                position: relative;

                height: 100%;
                width: 100%;
            }

            height: 2.5rem;
            width: auto;

            max-width: 8rem;

            box-sizing: content-box;

            z-index: 100 !important;

						.blurred {
								position: absolute;

                svg :global {
                    height: 100%;
                    width: 100%;

										mask-image: linear-gradient(to bottom, rgb(0 0 0 / .025) 0%, rgb(0 0 0 / .35) 50%, rgb(0 0 0 / 1) 100%);
										mask-type: luminance;

                    pointer-events: none !important;
                }

                height: 2.5rem;
                width: auto;

								perspective: 250px;

                pointer-events: none !important;

								.content {
                    filter: blur(.4rem) brightness(1.25);
                    opacity: .2;

                    transform: rotate3d(1, 0, 0, 28deg) scale(1.3);

                    z-index: initial;
								}
						}
        }
    }

    .copyable-container.dark {
        background: linear-gradient(to top, #0D0D0D 0%, #161617 100%);
        border-color: #52555d;
        box-shadow: 0 0 .5rem rgb(13 13 13 / .15);
    }
</style>