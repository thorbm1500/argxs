<script module lang="ts">
	import { getContext } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { copyToClipboard } from '$lib/utilities';
</script>

<script lang="ts">
	const { title = 'Loading...', easingFunction, duration = .125, delay = 0 } = $props();

	const sendToast: any = $derived(getContext('sendToast'));

	const applyTransition: Attachment = (element: Element) => {
		const htmlElement = element as HTMLElement;
		if (!htmlElement) return;

		htmlElement.style.transitionTimingFunction = easingFunction;
		htmlElement.style.animationTimingFunction = easingFunction;
	};
</script>

<div class="easing-function">
	<div class="top">
		<div class="meta">
			<h1 class="title">{title}</h1>
			<div class="subtitle">
				<p class="brace">&lbrace;</p>
				<button onclick="{() => {
					if (copyToClipboard('transition-timing-function: ' + easingFunction + ';')) {
						sendToast?.({ message: 'Copied', duration: 1250, type: 'copy', status: 'success' });
					}
				}}" class="copy-button">
					<p class="syntax">transition-timing-function</p>
					<p>: {easingFunction};</p>
				</button>
				<p class="brace">&rbrace;</p>
			</div>
		</div>
	</div>
	<div class="bottom">
		<div class="box">
			<div class="inner" {@attach applyTransition}>
				<div class="circle"></div>
			</div>
		</div>
		<div class="box">
			<div class="circle" {@attach applyTransition}></div>
		</div>
		<div class="box">
			<div class="circle" {@attach applyTransition}></div>
		</div>
	</div>
</div>

<style>
    .easing-function {
        .top, .bottom {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
        }

        .top {
            justify-content: space-between;

            .meta {
                color: var(--theme-text-primary);
                text-align: start;
                margin-bottom: 1rem;

                .title {
                    font-size: 1.35rem;
                    font-weight: 650;
                    user-select: none;

                    padding: 0;
                }

                .subtitle {
                    display: flex;
                    flex-flow: row nowrap;
                    align-items: center;

                    font-size: .9rem;
                    font-weight: 550;
                    user-select: auto;
                    color: var(--theme-text-secondary);

                    p.syntax {
                        color: var(--theme-color-accent);
                    }

                    .brace {
                        height: fit-content;
                        width: fit-content;
                        padding: 0 .5rem;
                        user-select: none;
                    }

										.copy-button {
												display: flex;
												flex-flow: row nowrap;
												align-items: center;

												cursor: copy;
										}
                }
            }
        }

        .bottom {
            justify-content: space-around;

            margin-top: .5rem;
            margin-bottom: 1.25rem;
            gap: .5rem;

            .box {
								display: flex;
								align-items: center;
								justify-content: center;

                height: 16rem;
                width: 16rem;

								border: 1px solid rgba(from var(--theme-ui-line) r g b / .45);
								background: var(--theme-ui-container);
								border-radius: .6rem;
								box-shadow: 0 0 .85rem rgba(from color-mix(var(--theme-ui-container), var(--theme-color-primary) 20%) r g b / .25);

								.circle {
										background: var(--theme-color-accent);
										border-radius: 100%;
										width: 1.5rem;
										height: 1.5rem;
								}
            }
						.box:first-child .inner {
								animation: AnimRotate 3s infinite;
								transform-style: preserve-3d;

								.circle {
										transform: translateY(-3.5rem);
								}
						}
						.box:last-child {
								transform: rotate(90deg);
						}

						.box:nth-child(2) .circle, .box:last-child .circle {
								animation: AnimX 3s infinite;
						}
        }
    }

		@keyframes AnimX {
				0%,50%,100% {
            filter: drop-shadow(0 0 .5rem var(--theme-color-accent)) hue-rotate(0deg);
				}
				0%,100% {
						transform: translateX(-7.25rem);
				}
				50% {
            transform: translateX(7.25rem);
				}
				25%,75% {
            filter: drop-shadow(0 0 .5rem transparent) hue-rotate(100deg);
				}
		}
    @keyframes AnimRotate {
        0%,50%,100% {
            filter: drop-shadow(0 0 .5rem var(--theme-color-accent)) hue-rotate(0deg);
        }
        0% {
            transform: rotate(-360deg);
        }
        50% {
            transform: rotate(0deg);
        }
				100% {
            transform: rotate(360deg);
				}
        25%,75% {
            filter: drop-shadow(0 0 .5rem transparent) hue-rotate(100deg);
        }
    }
</style>