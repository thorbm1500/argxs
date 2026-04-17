<script module lang="ts">
	import ToastComponent from '$lib/components/ToastComponent.svelte';
	import type { Icon } from '$lib/components/interfaces';
	import { fade } from 'svelte/transition';
	import moment from 'moment';

	let highlightedIcon: Icon | null = $state.raw(null);
	let isRegistered: boolean = false;

	function register(document: Document) {
		if (isRegistered) return;

		if (document) {
			document.addEventListener('click', (e) => {
				if (highlightedIcon === null) return;

				let element: HTMLElement | null = e.target as HTMLElement;

				while (element !== null) {
					if (element.className.includes('highlighted-icon')) return;
					element = element.parentElement;
				}

				highlightedIcon = null;
			});
			isRegistered = true;
		}
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	let { theme = $bindable(), icon, title = undefined, blur_content_bg = false } = $props();

	let sendToast: any = $state.raw(undefined);

	//todo: Add manual loading for connections with reduced data usage
	//todo: navigator.connection.saveData

	function highlightClick(e: MouseEvent) {
		if (highlightedIcon === icon) highlightedIcon = null;
		else highlightedIcon = icon;
		(e.target as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
	}

	function copyIcon(): void {
		navigator.clipboard?.writeText(icon.svg);

		if (sendToast && sendToast instanceof Function) sendToast({message: 'Copied', duration: 1250, type: 'copy', status: 'success'});
	}

	function downloadIcon(): void {
		const blob = new Blob([icon.svg], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.type = 'image/svg+xml';
		link.download = title ? "argxs_".concat(title,(theme === 'dark' ? '_dark' : '')).replaceAll(" ","_").replaceAll("-","_") : "argxs_icon";

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		setTimeout(() => URL.revokeObjectURL(url), 250);
	}

	onMount(() => register(document));
</script>

<ToastComponent bind:sendFunction={sendToast} />

{#if highlightedIcon === icon}
	<div class="highlighted-icon" transition:fade>
		<button title="" class="close" onclick={() => highlightedIcon = null}>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</button>

		<div class="icon blurred">
			{@html highlightedIcon?.svg}
		</div>
		<div class="icon">
			{@html highlightedIcon?.svg}
		</div>
		<div class="actions-info">
			<div class="actions">
				<button class="copy" onclick="{copyIcon}">
					Copy SVG
				</button>
			</div>
			<div class="info">
				{#if highlightedIcon?.source}
					<div class="source">
						<a href="{highlightedIcon.source.href}" rel="external" target="_blank">Sourced from <strong>{highlightedIcon.source.name}</strong></a>
					</div>
				{/if}
				{#if highlightedIcon?.date_added}
					<div class="date">
						<p>Added {moment(Date.parse(highlightedIcon.date_added)).calendar()}</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<div class="copyable-container {theme}">
	<div class="actions svg">
		<button title="" class="info-button" onclick="{highlightClick}">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13M12 17H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
					stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</button>
		<button class="copy" onclick="{copyIcon}">
			Copy SVG
		</button>
		<button class="download" onclick="{downloadIcon}">
			Download SVG
		</button>
		<!--<button class="download"><DownloadIcon /></button>-->
	</div>
	<div class="inner-content">
		{#if blur_content_bg}
			<div class="blurred">
				<div class="content">{@html icon.svg}</div>
			</div>
		{/if}
		{@html icon.svg}
	</div>
</div>

<style>
    .highlighted-icon {
        position: fixed;

        bottom: 0;
        right: 0;

        height: 20rem;
        width: calc(100vw - 14rem);

        backdrop-filter: blur(.25rem) grayscale(.15) brightness(.85);
        border-top: 1px solid var(--theme-ui-line);

				background: linear-gradient(to top, rgba(from var(--theme-color-primary-reverse) r g b / .3) 0%, transparent 100%);

        z-index: 300;

        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: center;

        .close {
            position: absolute;
            top: 2rem;
            right: 2rem;

            cursor: pointer;

            svg {
                height: 1.75rem;
                width: 1.75rem;
            }

            color: var(--theme-color-primary);
        }

        .close:hover {
            color: var(--theme-color-alert);
        }

        .icon :global {
            svg :global {
                position: relative;

                height: 100%;
                width: 100%;
            }

            height: 8rem;
            width: auto;

            margin: 1rem;
        }

				.icon.blurred :global {
            position: absolute;
						height: 12rem;
						width: auto;

						filter: blur(8rem) brightness(1);

						opacity: .5;

						z-index: 10;

						pointer-events: none !important;
        }

				.actions {
						display: flex;
						flex-flow: row nowrap;
						align-items: center;
						justify-content: center;

						margin: 1rem 0 .5rem 0;

						z-index: 300;

						.copy, .download {
								padding: .25rem .5rem;
								border: 1px solid #4b66bb;
								border-radius: .7rem;

								cursor: pointer;

								background: #1d306b;
								color: var(--theme-ui-white);

								z-index: 300;

								transition: 175ms ease-in;
						}

						.copy:hover, .download:hover {
								border-color: #91adff;
								background: #2f51b2;
								filter: brightness(1.05);
								transition: 35ms ease-out;
						}

						.copy:active, .download:active {
								background: var(--theme-color-accent);
								filter: drop-shadow(0 0 .75rem rgb(81 129 241 / .45));
								transform: scale(.95);
								transition: 50ms ease-out;
						}
				}

        .info {
						display: flex;
						flex-flow: row nowrap;
						align-items: center;
						justify-content: center;
						gap: 1.5rem;

            color: var(--theme-text-primary);

						z-index: 300;
        }
    }

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
            flex-flow: column nowrap;
            align-items: center;
            justify-content: center;
            gap: .25rem;

            height: 10rem;
            width: 10rem;

            border: 1px solid var(--theme-ui-line);
            border-radius: .45rem;

            z-index: 200;

            .info-button {
                position: absolute;
                top: .75rem;
                right: .75rem;

                cursor: pointer;

                color: var(--theme-color-secondary);

                filter: blur(1px);
                opacity: 0;

                transition: 250ms ease-in,
                color 750ms ease-in;

                svg {
                    width: 1.25rem;
                    height: 1.25rem;
                }
            }

            .info-button:hover {
                filter: none;
                opacity: 1;
                color: var(--theme-color-primary);
                transition: color 75ms ease-out;
            }

            .info-button:active {
                color: var(--theme-color-accent);
                transition: color 0ms linear;
            }

            .copy, .download {
                opacity: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                align-content: center;
								gap: .2rem;

                width: fit-content;
                height: fit-content;
                padding: .185rem .45rem;

                color: #f7f9fc;
                font-family: 'Lexend', sans-serif;
								text-rendering: geometricPrecision;
                font-weight: 550;
                font-size: .8rem;

                border-radius: .75rem;
                cursor: pointer;

                background: var(--theme-color-accent);
                border: 1px solid transparent;

                filter: blur(1px);
                transform: scale(.9);
                transition: 250ms ease-in;
            }

            .copy:hover, .download:hover {
                border-color: #6091fa;

                transition: 50ms ease-out;
            }

            transition: 200ms ease-in;
        }

        .actions:hover {
            backdrop-filter: blur(.1rem) grayscale(.75);

            .copy, .download, .info-button {
                opacity: 1;

                filter: none;
                transform: scale(1);

                transition: 75ms ease-out;
            }

            transition: 35ms ease-out;
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
								pointer-events: none !important;
								z-index: 50;

                svg :global {
                    height: 100%;
                    width: 100%;
                }

                perspective: 250px;

                .content {
                    filter: blur(.75rem) contrast(1.5) brightness(1.25);
                    opacity: .125;

                    transform: rotate3d(1, 0, 0, 28deg) scale(1.35);

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