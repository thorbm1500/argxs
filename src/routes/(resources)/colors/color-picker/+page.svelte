<!--TODO: Fix slider knob pos on paste-->
<script lang="ts">
	import { MathUtils } from '$lib/utilities';
	import { onMount } from 'svelte';
	import { Colord, colord, random, extend } from 'colord';
	import lchPlugin from "colord/plugins/lch";
	import harmonies from "colord/plugins/harmonies";
	import chroma from 'chroma-js';

	extend([lchPlugin,harmonies]);

	const { data } = $props();

	let slider: HTMLDivElement | undefined = $state();
	let sliderKnobPosX: number = $state(0);
	let canvas: HTMLCanvasElement | undefined = $state();
	let canvasRect: DOMRect | undefined = $derived(canvas?.getBoundingClientRect() ?? undefined);
	let hexInput: HTMLInputElement | undefined = $state();
	let rgbInput: HTMLInputElement | undefined = $state();
	let hslInput: HTMLInputElement | undefined = $state();
	let lchInput: HTMLInputElement | undefined = $state();
	let oklchInput: HTMLInputElement | undefined = $state();

	let isSliderActive: boolean = $state(false);
	let isHovering: boolean = $state(false);
	let isDragging: boolean = $state(false);
	let cursorX: number = $state(0);
	let cursorY: number = $state(0);
	let clientX: number = $state(0);
	let clientY: number = $state(0);

	/** Internal variables, to keep the inspected color updated realtime.
	 * Allows the user to position the cursor inside the canvas, without the selected color updating. */
	let _hsv = $state({ h: 237, s: 54, v: 100 });

	let inputHEX: string = $state('');
	let inputRGB: string = $state('');
	let inputHSL: string = $state('');
	let inputLCH: string = $state('');
	let inputOKLCH: string = $state('');

	let color: Colord = $state(colord({ r: 117, g: 124, b: 255 }));
	let colorScale: Function = $derived(chroma.scale([colord({ h: color.toHsv().h, s: 0, v: 100 }).toHex(),color.toHex()]));

	let sliderColor: string = $derived(colord({ h: color.toHsv().h, s: 100, l: 100 }).toHex());

	function updateColorUI(_color: Colord) {
		inputHEX = _color.toHex().toUpperCase();
		inputRGB = `${(_color.toRgb().r).toFixed(0)} ${(_color.toRgb().g).toFixed(0)} ${(_color.toRgb().b).toFixed(0)}`;
		inputHSL = `${_color.toHsl().h} ${_color.toHsl().s}% ${_color.toHsl().l}%`;
		inputLCH = `${_color.toLch().l}% ${_color.toLch().c.toFixed(2)} ${_color.toLch().h.toFixed(2)}`;
		inputOKLCH = `${(chroma(_color.toHex()).oklch()[0] ?? 0).toFixed(4)} ${(chroma(_color.toHex()).oklch()[1] ?? 0).toFixed(4)} ${(chroma(_color.toHex()).oklch()[2] ?? 0).toFixed(2)}`;
	}

	// svelte-ignore state_referenced_locally
	updateColorUI(color);

	function updateCursorPos() {
		if (!canvasRect) {
			// Disables hovering as no canvas is present
			isHovering = false;
			return;
		}

		const X = cursorX - canvasRect.left;
		const Y = cursorY - canvasRect.top;

		isHovering = X < canvasRect.width && X > 0 && Y < canvasRect.height && Y > 0;

		/** Return early if cursor is not positioned within the canvas.
		 * Ensures the selected color is only updated from values within the canvas */
		if (!isHovering) return;

		clientX = MathUtils.clamp(X, 0, canvasRect.width);
		clientY = MathUtils.clamp(Y, 0, canvasRect.height);
	}

	onMount(() => {
		if (!canvas || !slider || !document) return;
		sliderKnobPosX = ((slider.getBoundingClientRect().left - slider.getBoundingClientRect().width) / 360) * -237;

		// Updates the current cursor position, as long as the canvas is present
		document.addEventListener('mousemove', (event: MouseEvent) => {
			cursorX = event.clientX;
			cursorY = event.clientY;
			updateCursorPos();

			if (isSliderActive && slider) {
				sliderKnobPosX = MathUtils.clamp(event.clientX - slider.getBoundingClientRect().left, 0, slider.getBoundingClientRect().width);
				const _color = color.toHsv();
				_color.h = MathUtils.clamp(MathUtils.clamp(sliderKnobPosX / slider.getBoundingClientRect().width, 0, 1) * 360, 0, 359.999);
				if (color.toHslString() !== colord(_color).toHslString()) {
					_hsv.h = _color.h;
					color = colord(_color);
					updateColorUI(color);
				}
			}
		});

		document.addEventListener('mousedown', (event: MouseEvent) => {
			// Ensuring that dragging will only be set true as long as the canvas exists
			isDragging = canvas !== undefined;

			if (isSliderActive && slider) {
				sliderKnobPosX = MathUtils.clamp(event.clientX - slider.getBoundingClientRect().left, 0, slider.getBoundingClientRect().width);
				const _color = color.toHsv();
				_color.h = MathUtils.clamp(MathUtils.clamp(sliderKnobPosX / slider.getBoundingClientRect().width, 0, 1) * 360, 0, 359.999);
				if (color.toHslString() !== colord(_color).toHslString()) {
					_hsv.h = _color.h;
					color = colord(_color);
					updateColorUI(color);
				}
			}
		});

		// Disables dragging, aka live updating of the selected color
		document.addEventListener('mouseup', () => {
			isDragging = false;
			isSliderActive = false;
		});

		canvas.addEventListener('mousemove', (event: MouseEvent) => {
			if (!canvas || !canvasRect) return;

			_hsv.s = canvasRect ? MathUtils.clamp(clientX / canvasRect.width, 0, 1) * 100 : 54;
			_hsv.v = canvasRect ? MathUtils.clamp((canvasRect.height - clientY) / canvasRect.height, 0, 1) * 100 : 100;
		});

		slider.addEventListener('mousedown', () => isSliderActive = true);

		if (hexInput) {
			hexInput.addEventListener('input', (event: InputEvent) => {
				if (!hexInput || event.data === null) return;
				// Ensures pasting is possible even when a full 7 character hex string is present
				if (event.inputType === 'insertFromPaste') hexInput.value = event.data

				// Formats the field
				hexInput.value = '#' +  hexInput.value.replaceAll(new RegExp(/[^0-9a-fA-F]/, 'g'), '').toUpperCase();
				if (hexInput.value.length > 7) hexInput.value = hexInput.value.substring(0,7);

				// Sets the color if a paste was performed
				if (event.inputType === 'insertFromPaste') color = colord(hexInput.value);
			});
			hexInput.addEventListener('keypress', (event: KeyboardEvent) => {
				// Sets the color if the Enter key was pressed
				if (hexInput && event.key === 'Enter') color = colord(hexInput.value);
			});
		}
		if (rgbInput) {
			rgbInput.addEventListener('input', (event: InputEvent) => {
				if (!rgbInput) return;
				if (event.inputType === 'insertText') {
					if (rgbInput.value.length === 3) rgbInput.value += ' ';
				}
				else if (event.inputType.includes('deleteContent')) {

				}
				rgbInput.value = rgbInput.value.toUpperCase();

				// Sets the color if a paste was performed
				if (event.inputType === 'insertFromPaste') {
					const values = rgbInput.value.split(' ');
					color = colord({ r: Number.parseInt(values[0] ?? '0'), g: Number.parseInt(values[1] ?? ''), b: Number.parseInt(values[2] ?? '') })
				}
			});
			rgbInput.addEventListener('keypress', (event: KeyboardEvent) => {
				// Sets the color if the Enter key was pressed
				if (rgbInput && event.key === 'Enter') {
					const values = rgbInput.value.split(' ');
					color = colord({ r: Number.parseInt(values[0] ?? '0'), g: Number.parseInt(values[1] ?? ''), b: Number.parseInt(values[2] ?? '') })
				}
			});
		}
		if (hslInput) {
			hslInput.addEventListener('input', (event: InputEvent) => {
				if (!hslInput) return;
				hslInput.value = hslInput.value;

				// Sets the color if a paste was performed
				if (event.inputType === 'insertFromPaste') {
					const values = hslInput.value.split(' ');
					color = colord({ h: Number.parseInt(values[0] ?? '0'), s: Number.parseInt(values[1] ?? ''), l: Number.parseInt(values[2] ?? '') })
				}
			});
			hslInput.addEventListener('keypress', (event: KeyboardEvent) => {
				// Sets the color if the Enter key was pressed
				if (hslInput && event.key === 'Enter') {
					const values = hslInput.value.split(' ');
					color = colord({ h: Number.parseInt(values[0] ?? '0'), s: Number.parseInt(values[1] ?? ''), l: Number.parseInt(values[2] ?? '') })
				}
			});
		}
	});

	$effect(() => {
		// Updates selected color to current inspected color
		if (!isSliderActive && isHovering && isDragging && canvasRect) {
			const _color = colord(_hsv);
			if (color.toLchString() !== _color.toLchString()) {
				color = _color;
				updateColorUI(color);
			}
		}
	});
</script>

<svelte:head>
	<meta charset="utf-8">
	<title>{data.seo.title}</title>
	{#if data.seo.description}
		<meta name="description" content={data.seo.description} />
	{/if}
</svelte:head>

<section class="color-picker-page" style="cursor: {isHovering ? 'none' : 'auto'}">
	<div class="page-header">
		<h1 class="title">Color Picker</h1>
	</div>
	<div class="color-picker-cursor {isHovering ? 'active' : 'inactive'}" style="left: {cursorX}px; top: {cursorY}px" inert>
		<div class="current-color" style="border-color: {color.toHex()}" inert></div>
		<div class="background" inert></div>
	</div>
	<div class="color-picker-content">
		<canvas bind:this={canvas} class="color-picker" id="color-picker" style="--picker-color-bg: {colord({ h: color.toHsv().h, s: 100, v: 100 }).toHex()}; border-radius: {isHovering ? '.25rem' : '.9rem'}"></canvas>
		<div bind:this={slider} class="slider">
			<div class="slider-knob" style="--pos-x: {$state.eager(sliderKnobPosX) - 16}px; --rot-x: {$state.eager(sliderKnobPosX) - 16}deg; --slider-color: {colord({ h: color.toHsv().h, s: 100, v: 100 }).toHex()}"></div>
		</div>
		<div class="values">
			<div class="value hex">
				<h3 class="title">HEX</h3>
				<input bind:this={hexInput} bind:value={inputHEX} class="input hex" type="text">
			</div>
			<div class="value rgb">
				<h3 class="title">RGB</h3>
				<input bind:this={rgbInput} bind:value={inputRGB} class="input rgb" type="text">
			</div>
			<div class="value hsl">
				<h3 class="title">HSL</h3>
				<input bind:this={hslInput} bind:value={inputHSL} class="input hsl" type="text">
			</div>
			<div class="value lch">
				<h3 class="title">LCH</h3>
				<input bind:this={lchInput} bind:value={inputLCH} class="input lch" type="text">
			</div>
			<div class="value oklch">
				<h3 class="title">OKLCH</h3>
				<input bind:this={oklchInput} bind:value={inputOKLCH} class="input oklch" type="text">
			</div>
		</div>
		<div class="previews">
			<div class="preview scale" style="background-image: linear-gradient(to right, {color.harmonies('analogous').map((c) => c.toHex()).join(', ')})"></div>
			<div class="preview scale" style="background-image: linear-gradient(to right, {color.harmonies('rectangle').map((c) => c.toHex()).join(', ')})"></div>
			<div class="preview color" style="background: {color.toHex()}"></div>
		</div>
	</div>
</section>

<style>
    /* Desktop & Tablet */
    @media (width >= 44rem) {
        .color-picker-cursor {
						transition: 75ms ease, top 10ms ease-out, left 10ms ease-out;

						&.active {
								&, .current-color {
                    opacity: 1 !important;
                    filter: none;
								}
            }
						&.inactive {
                &, .current-color {
                    opacity: 0;
                    filter: blur(3px);
								}
            }
				}
    }

    .color-picker-page {
        width: 100%;
        height: 100%;

        overflow: hidden;

        :global .content-header {
            padding-top: 5rem;
        }

				.page-header {
						padding: 3rem 0;
						.title {
								font-size: 3rem;
						}
				}

        .color-picker-cursor {
            position: fixed;
            transform: translate(-16px, -16px);

            z-index: 500;

						.current-color, .background {
                position: absolute;
                border-radius: 100%;
								left: 0;
								top: 0;
						}

						.current-color {
                width: 1.6rem;
                height: 1.6rem;

                border: 5px solid;

                box-sizing: border-box;
                background: transparent;

                transform: translate(3px, 3px);

                z-index: 600;
						}

						.background {
                width: 2rem;
                height: 2rem;

                background: rgba(255 255 255 / .25);
                backdrop-filter: invert(1) blur(3px);

                mask-image: radial-gradient(circle 1rem, transparent 0%, transparent 55%, #FFF 60%, #FFF 100%);
						}

						&.inactive, &.active {
                opacity: 0;
						}
        }

        .color-picker-content {
            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            justify-content: flex-start;

            width: 100%;
            height: 100%;

            .color-picker {
                min-width: 200px;
                width: 100%;
                max-width: min(92rem, 86vw);
                min-height: 200px;
                height: 100%;
                max-height: 50vh;

                background: linear-gradient(#FFFFFF00, #000000FF), linear-gradient(0.25turn, #FFFFFFFF, #00000000), var(--picker-color-bg);

                transition: border-radius 200ms ease-out;
            }

            .slider {
                height: .75rem;
                min-width: 200px;
                width: 100%;
                max-width: min(76rem, 70vw);

                border-radius: .35rem;

                margin-top: 2.5rem;
                background: linear-gradient(to right,
                hsl(0deg, 100%, 50%),
                hsl(10deg, 100%, 50%),
                hsl(20deg, 100%, 50%),
                hsl(30deg, 100%, 50%),
                hsl(40deg, 100%, 50%),
                hsl(50deg, 100%, 50%),
                hsl(60deg, 100%, 50%),
                hsl(70deg, 100%, 50%),
                hsl(80deg, 100%, 50%),
                hsl(90deg, 100%, 50%),
                hsl(100deg, 100%, 50%),
                hsl(110deg, 100%, 50%),
                hsl(120deg, 100%, 50%),
                hsl(130deg, 100%, 50%),
                hsl(140deg, 100%, 50%),
                hsl(150deg, 100%, 50%),
                hsl(160deg, 100%, 50%),
                hsl(170deg, 100%, 50%),
                hsl(180deg, 100%, 50%),
                hsl(190deg, 100%, 50%),
                hsl(200deg, 100%, 50%),
                hsl(210deg, 100%, 50%),
                hsl(220deg, 100%, 50%),
                hsl(230deg, 100%, 50%),
                hsl(240deg, 100%, 50%),
                hsl(250deg, 100%, 50%),
                hsl(260deg, 100%, 50%),
                hsl(270deg, 100%, 50%),
                hsl(280deg, 100%, 50%),
                hsl(290deg, 100%, 50%),
                hsl(300deg, 100%, 50%),
                hsl(310deg, 100%, 50%),
                hsl(320deg, 100%, 50%),
                hsl(330deg, 100%, 50%),
                hsl(340deg, 100%, 50%),
                hsl(350deg, 100%, 50%),
                hsl(360deg, 100%, 50%));

                .slider-knob {
                    height: 2rem;
                    width: 2rem;
                    border-radius: 100%;
                    background: light-dark(rgba(0 0 0 / .2), rgba(255 255 255 / .25));
                    backdrop-filter: blur(3px) brightness(1.1);
                    transform: translateX(var(--pos-x)) translateY(-9px) rotate(var(--rot-x));

                    transition: 200ms ease, transform 50ms ease, rotate 0ms;

                    pointer-events: bounding-box;

										&::after {
												content: "";
												width: inherit;
												height: inherit;
												position: absolute;
												border-radius: inherit;

												filter: blur(3px) brightness(1.16);
												transform: rotate(45deg);

												mask-type: luminance;
												mask-image: radial-gradient(2rem 3.65rem, transparent 21%, rgba(255 255 255 / 1) 50%),
																		linear-gradient(to right, transparent 50%, rgba(255 255 255 / .75) 100%);
												background: var(--theme-color-primary);

                        transition: 250ms ease, transform 50ms ease, background 50ms ease;
										}

                    &:hover, &:active {
                        filter: brightness(1.4);
                        transition: 250ms ease, transform 50ms ease, background 50ms ease;

                        &::after {
                            filter: brightness(1.2);
                            background: var(--slider-color) !important;
                        }
                    }
                }
            }

            .previews {
                display: flex;
                flex-flow: column nowrap;
                justify-content: center;
                align-items: center;

                .preview {
                    border-radius: .9rem;

                    margin-top: 1.5rem;

										&.color {
                        width: 8rem;
                        height: 8rem;
										}

										&.scale {
												width: 30vw;
												max-width: 34rem;
												height: 4rem;
										}
                }
						}

            .values {
                display: flex;
                flex-flow: row nowrap;
                margin-top: 1.5rem;

                .value {
                    display: flex;
                    flex-flow: column nowrap;
                    align-items: center;
                    justify-content: flex-start;

                    width: fit-content;
                    padding: 0 .5rem;
                    margin: 0 .25rem;

                    user-select: none;

                    .title {
                        color: var(--theme-text-third);
                        font-weight: 650;

                    }

                    .input {
                        text-align: center;

                        width: fit-content;
                        color: var(--theme-text-primary);
                        font-weight: 450;
                        user-select: all;
                    }
                }
            }
        }
    }
</style>