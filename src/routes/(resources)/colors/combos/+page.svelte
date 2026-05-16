<script lang="ts">
	import ContentHeaderComponent from '$lib/components/ContentHeaderComponent.svelte';
	import type { ColorCombo } from '$lib/components/interfaces';
	import { blur } from 'svelte/transition';
	import { getContext } from 'svelte';
	import { copyToClipboard } from '$lib/utilities';

	const { data } = $props();

	const sendToast: any = $derived(getContext('sendToast'));

	// svelte-ignore state_referenced_locally
	const max = data.combos.length - 1;

	let current: number = $state(0);
	let autoplay: boolean = $state(false);

	const autoPlayer = setInterval(() => {
		if (autoplay) {
			current = current + 1 > max ? 0 : current + 1;
		}
	}, 1500);

	let combo: ColorCombo | undefined = $derived(data.combos[current]);
</script>

<svelte:head>
	<title>{data.seo.title}</title>
</svelte:head>

<section class="color-combos-sec">
	<ContentHeaderComponent title="Color Combos" type="combos" amount={data.comboAmount} />

	<div class="combos">
		{#if combo}
			<div class="combo">
				<div class="color first" style="--hex: {combo.first.hex}; --text-hex: {combo.second.hex}">
					<p class="text">argxs</p>
					{#key combo}
						<div class="values" transition:blur={{duration: 175, amount: 3}}>
							<button title="Copy" class="value hex" onclick="{() => {
								if (copyToClipboard(combo.first.hex)) sendToast?.({ message: 'Copied HEX', duration: 1250, type: 'copy', status: 'success' });
							}}">{combo.first.hex}</button>
							{#if combo.first.rgb}
								<button title="Copy" class="value rgb" onclick="{() => {
								if (copyToClipboard(combo.first.rgb)) sendToast?.({ message: 'Copied RGB', duration: 1250, type: 'copy', status: 'success' });
							}}">{combo.first.rgb}</button>
							{/if}
						</div>
					{/key}
				</div>
				<div class="color second" style="--hex: {combo.second.hex}; --text-hex: {combo.first.hex}">
					<p class="text">argxs</p>
					{#key combo}
						<div class="values" transition:blur={{duration: 175, amount: 3}}>
							<button title="Copy" class="value hex" onclick="{() => {
								if (copyToClipboard(combo.second.hex)) sendToast?.({ message: 'Copied HEX', duration: 1250, type: 'copy', status: 'success' });
							}}">{combo.second.hex}</button>
							{#if combo.second.rgb}
								<button title="Copy" class="value rgb" onclick="{() => {
								if (copyToClipboard(combo.second.rgb)) sendToast?.({ message: 'Copied RGB', duration: 1250, type: 'copy', status: 'success' });
							}}">{combo.second.rgb}</button>
							{/if}
						</div>
					{/key}
				</div>
			</div>
			<div class="actions">
				<div class="combo-switcher">
					<button title="First" disabled={current === 0} onclick="{() => current = 0}">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M5 12h6m3 0h1.5m3 0h.5" />
							<path d="M5 12l6 6" />
							<path d="M5 12l6 -6" />
						</svg>
					</button>
					<button title="Previous" onclick="{() => current = current - 1 < 0 ? max : current - 1}">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
							<path d="M19 12H5M5 12L12 19M5 12L12 5" />
						</svg>
					</button>
					<p class="current-combo">{$state.eager(current) + 1}</p>
					<button title="Next" onclick="{() => current = current + 1 > max ? 0 : current + 1}">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
							<path d="M5 12H19M19 12L12 5M19 12L12 19" />
						</svg>
					</button>
					<button title="Last" disabled={current === max} onclick="{() => current = max}">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M5 12h.5m3 0h1.5m3 0h6" />
							<path d="M13 18l6 -6" />
							<path d="M13 6l6 6" />
						</svg>
					</button>
				</div>
				<div class="extras">
					<button class="random-button" title="Show random combo" onclick="{() => current = Math.floor(Math.random() * max)}">
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path stroke="none" d="M0 0h24v24H0z" fill="none" />
							<path d="M18 4l3 3l-3 3" />
							<path d="M18 20l3 -3l-3 -3" />
							<path d="M3 7h3a5 5 0 0 1 5 5a5 5 0 0 0 5 5h5" />
							<path d="M21 7h-5a4.978 4.978 0 0 0 -3 1m-4 8a4.984 4.984 0 0 1 -3 1h-3" />
						</svg>
					</button>
					<button title="Autoplay through all combos. Interval: 1.5s" onclick="{() => {autoplay = !autoplay; autoPlayer.refresh();}}">
						{#if !autoplay}
							<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" />
							</svg>
						{:else}
							<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path d="M9 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" />
								<path d="M17 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" />
							</svg>
						{/if}
					</button>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
    /* Desktop & Tablet */
    @media (width >= 44rem) {
	    .color-combos-sec {
		    padding-top: 4rem;
	    }
    }

    /* Phone */
    @media (width < 44rem) {
	    .color-combos-sec {
		    padding-top: 2rem;
	    }
    }

    .color-combos-sec {
	    width: 100%;
	    
        .combos {
            display: flex;
            flex-flow: column nowrap;
	        align-items: center;
	        justify-content: center;

            height: fit-content;
	        width: 100%;
        }

        .combo {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            justify-content: center;
            gap: 1rem;
	        width: 100%;
	        
            height: fit-content;

            margin: 1.5rem 0;

            z-index: 200;

            .color {
                display: flex;
                flex-flow: column;
                align-items: center;
                justify-content: center;
	            flex: 1 0;

                height: 40vh;
                min-height: 8rem;
                
                background: var(--hex);
                border-radius: .65rem;
                border: 6px solid color-mix(var(--hex), black 10%);

                overflow: hidden;

                transition: background 125ms var(--theme-cubic-out),
                border-color 50ms linear;

								.values {
										position: absolute;
										height: 0;
										width: 0;
										overflow: visible;

										display: flex;

										align-items: flex-start;
										justify-content: center;
								}

                .value {
                    position: absolute;

                    color: var(--text-hex);

                    font-weight: 500;
                    font-size: .8rem;
                    letter-spacing: .15rem;
										top: 1.5rem;

										height: 1rem;

										cursor: copy;

                    transition: color 125ms var(--theme-cubic-out);
                }

                .value.rgb {
                    top: 2.6rem;
                }
	            
	            perspective: 200px;

                .text {
                    color: var(--text-hex);
                    font-size: 2.15rem;
                    font-family: 'Funnel Display', sans-serif;
                    font-weight: 800;

                    transition: color 125ms var(--theme-cubic-out);

                    user-select: none;
	                
	                &::before {
		                position: absolute;
		                content: 'argxs';
		                transform: scale(4) rotate3d(20,0,0,40deg) scale(2);
		                mask-image: linear-gradient(40deg, #02020220 0%, transparent 100%);
		                opacity: .25;
		                filter: blur(.025rem) brightness(.95);
		                padding-bottom: .25rem;
		                
		                color: var(--text-hex);
		                font-size: 2.15rem;
		                font-family: 'Funnel Display', sans-serif;
		                font-weight: 800;
		                
		                transition: color 125ms var(--theme-cubic-out);
		                
		                user-select: none;
	                }
                }
            }
        }

        .actions {
	        margin-top: .5rem;
            color: var(--theme-color-primary);
            user-select: none;

            button {
                cursor: pointer;
            }

            .combo-switcher {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: center;
                gap: 1.25rem;

                button:first-child, button:last-child {
                    svg {
                        width: 1.75rem;
                        height: 1.75rem;
                        stroke-width: 2.5;
                    }
                }

                button {
                    color: var(--theme-color-primary);
                    transition: 650ms 50ms;
                    transition-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);

                    svg {
                        width: 2.15rem;
                        height: 2.15rem;
                        stroke-width: 3;

                        transition: 650ms 50ms,
                        transform 175ms,
                        stroke-width 175ms;
                        transition-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
                    }
                }

                button:active {
                    color: var(--theme-color-accent);

                    transition: none;

                    svg {
                        transform: scale(.875);
                        stroke-width: 4.5;
                        transition: none;
                    }
                }

                button[disabled] {
                    color: var(--theme-text-fourth);
                    cursor: default;
                }

                .current-combo {
                    position: relative;
                    overflow: visible;

                    width: 8rem;
                    text-align: center;

                    font-family: 'Funnel Display', sans-serif;
                    font-weight: 900;
                    font-size: 2.5rem;
                }
            }

            .extras {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: center;
                gap: 1rem;

                margin-top: .75rem;
            }
        }
    }
</style>