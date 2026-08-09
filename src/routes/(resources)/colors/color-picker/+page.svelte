<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<script lang="ts">
	import { copyToClipboard, MathUtils } from '$lib/utilities';
	import { innerWidth } from 'svelte/reactivity/window';
	import { getContext, onMount } from 'svelte';
	import { Colord, colord, random, extend } from 'colord';
	import lchPlugin from "colord/plugins/lch";
	import harmonies from "colord/plugins/harmonies";
	import chroma from 'chroma-js';
	import type { Action } from 'svelte/action';
	import { prefersReducedMotion } from 'svelte/motion';
	import { circOut } from 'svelte/easing';
	import { draw } from 'svelte/transition';
	import { Tween } from 'svelte/motion';

	extend([lchPlugin,harmonies]);

	const { data } = $props();

	const sendToast: Function | undefined = $derived(getContext('sendToast') as Function ?? undefined);
	let scrollY: number = $derived((getContext('scrollY') as Function)?.() ?? 0);
	let pageLoad: boolean = $state(false);
	let currentScreenWidth: number = $derived(innerWidth.current ?? 0);
	// svelte-ignore state_referenced_locally
	let activeScreenWidth: number = $state(currentScreenWidth);

	let slider: HTMLDivElement | undefined = $state();
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
	let selectedColorX = new Tween(0, { duration: 250, easing: circOut });
	let selectedColorY = new Tween(0, { duration: 250, easing: circOut });
	let sliderKnobPosX = new Tween(0, { duration: 250, easing: circOut });

	/** Internal variables, to keep the inspected color updated realtime.
	 * Allows the user to position the cursor inside the canvas, without the selected color updating. */
	let _hsv = $state({ h: 237, s: 54, v: 100, a: 1 });

	let inputHEX: string = $state('');
	let inputRGB: string = $state('');
	let inputHSL: string = $state('');
	let inputLCH: string = $state('');
	let inputOKLCH: string = $state('');

	let color: Colord = $state(colord('#757CFF'));
	let colorName: string = $derived(chroma(color.toHex()).name());
	const colorShade = (shade: number) => chroma(color.toHex()).shade(shade);
	const colorMix = (type: 'analogous' | 'tetradic' | 'split-complementary', mix: number, harmony: number = 0) => chroma(color.toHex()).mix(color.harmonies(type)[harmony]?.toHex() ?? '#000', mix);
	let showMainColorShade: boolean = $state(true);

	function updateColorUI(_color: Colord, updateSlider: boolean) {
		if (updateSlider) _hsv = _color.toHsv();
		if (slider) sliderKnobPosX.target = _color.toHsv().h * (slider.getBoundingClientRect().width / 360);

		if (canvas) {
			// Requires calling canvas.getBoundingClientRect() directly as canvasRect doesn't update quick enough to allow realtime resizing
			selectedColorX.target = canvas.getBoundingClientRect().left + (_color.toHsv().s * (canvas.getBoundingClientRect().width / 100));
			selectedColorY.target = (_color.toHsv().v * (canvas.getBoundingClientRect().height / 100) * -1) + canvas.getBoundingClientRect().height;
		}

		inputHEX = _color.toHex().toUpperCase().substring(0, 7);
		inputRGB = `${(_color.toRgb().r).toFixed(0)} ${(_color.toRgb().g).toFixed(0)} ${(_color.toRgb().b).toFixed(0)}`;
		inputHSL = _color.toHslString().slice(4, -1).replaceAll(',','');
		inputLCH = `${_color.toLch().l}% ${_color.toLch().c.toFixed(2)} ${_color.toLch().h.toFixed(2)}`;
		inputOKLCH = `${(chroma(_color.toHex()).oklch()[0] ?? 0).toFixed(4)} ${(chroma(_color.toHex()).oklch()[1] ?? 0).toFixed(4)} ${(chroma(_color.toHex()).oklch()[2] ?? 0).toFixed(2)}`;
	}

	function updateCursorPos() {
		if (!slider) isSliderActive = false;
		if (!canvasRect) isHovering = false;
		else {
			const X = cursorX - canvasRect.left;
			const Y = cursorY - (canvasRect.top - scrollY);

			isHovering = X < canvasRect.width && X > 0 && Y < canvasRect.height && Y > 0;

			if (isHovering || isDragging) {
				if (isDragging) {
					_hsv.s = canvasRect ? MathUtils.clamp(clientX / canvasRect.width, 0, 1) * 100 : 54;
					_hsv.v = canvasRect ? MathUtils.clamp((canvasRect.height - clientY) / canvasRect.height, 0, 1) * 100 : 100;
				}

				clientX = MathUtils.clamp(X, 0, canvasRect.width);
				clientY = MathUtils.clamp(Y, 0, canvasRect.height);
			}
		}
	}

	function updateSlider() {
		if (!slider) return;
		sliderKnobPosX.target = MathUtils.clamp(cursorX - slider.getBoundingClientRect().left, 0, slider.getBoundingClientRect().width);

		const _color = color.toHsv();
		_color.h = MathUtils.clamp(MathUtils.clamp(sliderKnobPosX.target / slider.getBoundingClientRect().width, 0, 1) * 360, 0, 359.999);
		if (color.toHslString() !== colord(_color).toHslString()) {
			_hsv.h = _color.h;
			color = colord(_color);
			updateColorUI(color, false);
		}
	}

	function updateCursorVariables(event: MouseEvent | TouchEvent | number[], updateCursorPosition: boolean = false) {
		if (event instanceof MouseEvent) {
			cursorX = event.clientX;
			cursorY = event.clientY;
			if (updateCursorPosition) updateCursorPos();
		} else if (event instanceof TouchEvent && event.touches[0]) {
			for (const t of event.changedTouches) {
				cursorX = t.clientX;
				cursorY = t.clientY;
				if (updateCursorPosition) updateCursorPos();
			}
		}
	}

	function userDragEvent(event: MouseEvent | TouchEvent) {
		updateCursorVariables(event, true);
		if (isSliderActive) updateSlider();
	}

	function getChromaObjFromOKLCH(data: string): chroma.Color {
		const values: string[] = data.replaceAll(new RegExp(/[^0-9\s.]/,'g'), '').replaceAll(new RegExp(/\.\.+/,'g'), '.').replaceAll(new RegExp(/,\s*|\s{2,}/, 'g'),' ').trim().split(' ');

		const currentOKLCH = chroma(color.toHex()).oklch();
		const _oklch = {
			l: 0,
			c: 0,
			h: 0
		}

		_oklch.l = Number.parseFloat(values[0] ?? 'NaN');
		if (Number.isNaN(_oklch.l)) _oklch.l = currentOKLCH[0];

		_oklch.c = Number.parseFloat(values[1] ?? 'NaN');
		if (Number.isNaN(_oklch.c)) _oklch.c = currentOKLCH[1];

		_oklch.h = Number.parseFloat(values[2] ?? 'NaN');
		if (Number.isNaN(_oklch.h)) _oklch.h = currentOKLCH[2];

		return chroma.oklch(_oklch.l, _oklch.c, _oklch.h);
	}

	onMount(() => {
		if (!canvas || !slider || !document) return;
		pageLoad = true;

		updateColorUI(color, false);

		// Disables all user inputs
		const endUserInput = () => {
			isSliderActive = false;
			isHovering = false;
			isDragging = false;
		}
		document.addEventListener('mouseup', endUserInput);
		document.addEventListener('touchend', endUserInput);
		canvas.addEventListener('touchend', endUserInput);
		slider.addEventListener('touchend', endUserInput);

		document.addEventListener('mousemove', (event: MouseEvent) => {
			if (isDragging) userDragEvent(event);
			else updateCursorVariables(event);
			if (isSliderActive) updateSlider();
		});
		document.addEventListener('scroll', (event) => {
			if (isDragging && event.cancelable) {
				event.preventDefault();
				event.stopPropagation();
			}
		});

		const canvasInputEventHandler = (event: MouseEvent | TouchEvent) => {
			isHovering = true;
			isDragging = true;

			userDragEvent(event);
		}
		canvas.addEventListener('touchstart', canvasInputEventHandler);
		canvas.addEventListener('mousedown', canvasInputEventHandler);
		canvas.addEventListener('touchmove', (event: TouchEvent) => canvasInputEventHandler(event));
		canvas.addEventListener('mousemove', (event: MouseEvent) => {
			isHovering = true;
			userDragEvent(event);
		});
		canvas.addEventListener('mouseleave', () => isHovering = false);

		slider.addEventListener('touchstart', (event: TouchEvent) => {
			isSliderActive = true;
			updateCursorVariables(event, true);
			updateSlider();
		});
		slider.addEventListener('mousedown', (event: MouseEvent) => {
			isSliderActive = true;
			updateCursorVariables(event, true);
			updateSlider();
		});
		slider.addEventListener('touchmove', (event: TouchEvent) => {
			if (!slider) {
				isSliderActive = false;
				return;
			} else isSliderActive = true;

			if (event.cancelable) event.preventDefault();

			updateCursorVariables(event, true);

			for (const t of event.changedTouches) {
				updateCursorVariables([t.clientX, t.clientY], true);
				if (isSliderActive) updateSlider();
			}
		});

		// ### HEX
		function applyHEX(data: string) {
			const _color = colord(data);
			let isValid = _color.isValid();
			if (isValid) color = _color;

			updateColorUI(color, isValid);
		}

		hexInput?.addEventListener('input', (event: InputEvent) => {
			if (event.data !== null && event.inputType === 'insertFromPaste') {
				applyHEX(event.data);
			}
		});
		hexInput?.addEventListener('keypress', (event: KeyboardEvent) => {
			if (event.key === 'Enter') {
				applyHEX(inputHEX);
			}
		});

		// ### RGB
		function applyRGB(data: string) {
			const values: string[] = data.replaceAll(new RegExp(/[^0-9\s]/,'g'), '').replaceAll(new RegExp(/,\s*|\s{2,}/, 'g'),' ').trim().split(' ');
			let isValid = false;
			if (values[0]) {
				const _rgb = color.toRgb();

				_rgb.r = Number.parseInt(values[0]);
				if (values[1]) _rgb.g = Number.parseInt(values[1]);
				if (values[2]) _rgb.b = Number.parseInt(values[2]);

				const _color = colord(_rgb);
				isValid = _color.isValid();
				if (isValid) color = _color;
			}

			updateColorUI(color, isValid);
		}

		rgbInput?.addEventListener('input', (event: InputEvent) => {
			if (event.data !== null && event.inputType === 'insertFromPaste') {
				applyRGB(event.data);
			}
		});
		rgbInput?.addEventListener('keypress', (event: KeyboardEvent) => {
			if (event.key === 'Enter') {
				applyRGB(inputRGB);
			}
		});

		// ### HSL
		function applyHSL(data: string) {
			const values: string[] = data.replaceAll(new RegExp(/[^0-9\s]/,'g'), '').replaceAll(new RegExp(/,\s*|\s{2,}/, 'g'),' ').trim().split(' ');
			let isValid = false;
			if (values[0]) {
				const _hsl = color.toHsl();

				_hsl.h = Number.parseInt(values[0]);
				if (values[1]) _hsl.s = Number.parseInt(values[1]);
				if (values[2]) _hsl.l = Number.parseInt(values[2]);

				const _color = colord(_hsl);
				isValid = _color.isValid();
				if (isValid) color = _color;
			}

			updateColorUI(color, isValid);
		}

		hslInput?.addEventListener('input', (event: InputEvent) => {
			if (event.data !== null && event.inputType === 'insertFromPaste') {
				applyHSL(event.data);
			}
		});
		hslInput?.addEventListener('keypress', (event: KeyboardEvent) => {
			if (event.key === 'Enter') {
				applyHSL(inputHSL);
			}
		});

		// ### LCH
		function applyLCH(data: string) {
			const values: string[] = data.replaceAll(new RegExp(/[^0-9\s.]/,'g'), '').replaceAll(new RegExp(/\.\.+/,'g'), '.').replaceAll(new RegExp(/,\s*|\s{2,}/, 'g'),' ').trim().split(' ');
			let isValid = false;
			if (values[0]) {
				const _lch = color.toLch();

				_lch.l = Number.parseFloat(values[0]);
				if (values[1]) _lch.c = Number.parseFloat(values[1]);
				if (values[2]) _lch.h = Number.parseFloat(values[2]);

				const _color = colord(_lch);
				isValid = _color.isValid();
				if (isValid) color = _color;
			}

			updateColorUI(color, isValid);
		}

		lchInput?.addEventListener('input', (event: InputEvent) => {
			if (event.data !== null && event.inputType === 'insertFromPaste') {
				applyLCH(event.data);
			}
		});
		lchInput?.addEventListener('keypress', (event: KeyboardEvent) => {
			if (event.key === 'Enter') {
				applyLCH(inputLCH);
			}
		});

		// ### OKLCH
		function applyOKLCH(data: string) {
			const chroma = getChromaObjFromOKLCH(data);

			const _color = colord(chroma.hex('rgb'));
			let isValid = _color.isValid();
			if (isValid) color = _color;

			updateColorUI(color, isValid);
		}

		oklchInput?.addEventListener('input', (event: InputEvent) => {
			if (event.data !== null && event.inputType === 'insertFromPaste') {
				applyOKLCH(event.data);
			}
		});
		oklchInput?.addEventListener('keypress', (event: KeyboardEvent) => {
			if (event.key === 'Enter') {
				applyOKLCH(inputOKLCH);
			}
		});
	});

	function adjustColor(brightness: number, type: 'brightness' | 'saturation') {
		let _color = color.toHsv();
		if (type === 'brightness') _color.v *= brightness;
		else _color.s *= brightness
		color = colord(_color);
		updateColorUI(color, true);
	}

	$effect(() => {
		// Updates slider position if screen is resized
		if (activeScreenWidth !== currentScreenWidth && currentScreenWidth !== 0) {
			updateColorUI(color, true);
			activeScreenWidth = currentScreenWidth;
		}
		// Updates selected color to current inspected color
		else if (!isSliderActive && isDragging) {
			const _color = colord(_hsv);
			if (color.toLchString() !== _color.toLchString()) {
				const shouldSliderUpdate = color.hue() !== _color.hue();
				color = _color;
				updateColorUI(color, shouldSliderUpdate);
			}
		}
	});

	const mouseEventListeners: Action = (node: HTMLElement) => {
		node.addEventListener('mouseenter', () => showMainColorShade = false);
		node.addEventListener('mouseleave', () => showMainColorShade = true);
		return { destroy() {} };
	}

	function copyColorValue(value: unknown) {
		copyToClipboard(value).then(() => sendToast?.({ message: 'Copied', type: 'copy', status: 'success' }));
	}

	const copyToClipboardOnClick: Action<HTMLDivElement, { value: unknown } | undefined> = (node: HTMLElement, obj?: { value: unknown }) => {
		if (!obj) return;
		node.addEventListener('click', () => {
			copyToClipboard(String(obj.value).toUpperCase());
			sendToast({ message: 'Copied', type: 'copy', status: 'success' });
		});
		return { destroy() {} };
	}
</script>

<svelte:head>
	<meta charset="utf-8">
	<title>{data.seo.title}{colorName.length ? colorName : 'Color Picker'}</title>
	{#if data.seo.description}
		<meta name="description" content={data.seo.description} />
	{/if}
</svelte:head>

<section class="color-picker-page">
	<div class="page-header">
		<h1 class="title">Color Picker</h1>
	</div>
	<div class="color-picker-cursor" style="left: {selectedColorX.current}px; top: {selectedColorY.current - scrollY + (canvasRect?.top ?? 0)}px; --current-color: {color.toHex()}; border-color: {colord(color).invert().toHex()}" draggable="true" inert></div>
	<div class="color-picker-content">
		<canvas bind:this={canvas} class="color-picker" id="color-picker" style="--picker-color-bg: {colord({ h: color.toHsv().h, s: 100, v: 100 }).toHex()}; border-radius: {isHovering ? '.25rem' : '.9rem'};"></canvas>
		<div class="actions">
			<div class="actions-parent">
				<div class="title">
					<svg class="transition-default" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						{#key pageLoad}
							<path in:draw|global={{duration: prefersReducedMotion.current ? 0 : 750, easing: circOut}} d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
							<path in:draw|global={{duration: prefersReducedMotion.current ? 0 : 750, easing: circOut, delay: 375}} d="M12 3l0 17" />
							<path in:draw|global={{duration: prefersReducedMotion.current ? 0 : 750, easing: circOut, delay: 475}} d="M12 9l4.65 -4.65" />
							<path in:draw|global={{duration: prefersReducedMotion.current ? 0 : 750, easing: circOut, delay: 575}} d="M12 14.3l7.37 -7.37" />
							<path in:draw|global={{duration: prefersReducedMotion.current ? 0 : 750, easing: circOut, delay: 675}} d="M12 19.6l8.85 -8.85" />
						{/key}
					</svg>
					<h4>Brightness</h4>
				</div>
				<button class="action brightness" title="Decrease brightness by 25%" onclick="{() => adjustColor(.75, 'brightness')}">
					<h4 class="transition-default">-25%</h4>
				</button>
				<button class="action brightness" title="Increase brightness by 25%" onclick="{() => adjustColor(1.25, 'brightness')}">
					<h4 class="transition-default">+25%</h4>
				</button>
			</div>
			<div class="actions-parent">
				<div class="title">
					<svg class="transition-default" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						{#key pageLoad}
							<path in:draw|global={{duration: prefersReducedMotion.current ? 0 : 750, easing: circOut}} d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
							<path in:draw|global={{duration: prefersReducedMotion.current ? 0 : 750, easing: circOut, delay: 375}} d="M12 17a5 5 0 0 0 0 -10v10" />
						{/key}
					</svg>
					<h4>Saturation</h4>
				</div>
				<button class="action saturation" title="Decrease saturation by 25%" onclick="{() => adjustColor(.75, 'saturation')}">
					<h4 class="transition-default">-25%</h4>
				</button>
				<button class="action saturation" title="Increase saturation by 25%" onclick="{() => adjustColor(1.25, 'saturation')}">
					<h4 class="transition-default">+25%</h4>
				</button>
			</div>
			<button class="action random" title="Randomize" onclick="{() => {
				color = random();
				updateColorUI(color, true);
			}}">
				{#key pageLoad}
					<svg class="transition-default" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path in:draw|global={{duration: prefersReducedMotion.current ? 0 : 750, easing: circOut, delay: 300}} d="M20 21h-4v-4" />
						<path in:draw|global={{duration: prefersReducedMotion.current ? 0 : 750, easing: circOut}} d="M16 21l5 -5" />
						<path in:draw|global={{duration: prefersReducedMotion.current ? 0 : 750, easing: circOut, delay: 500}} d="M6.5 9.504l-3.5 -2l2 -3.504" />
						<path in:draw|global={{duration: prefersReducedMotion.current ? 0 : 750, easing: circOut, delay: 200}} d="M3 7.504l6.83 -1.87" />
						<path in:draw|global={{duration: prefersReducedMotion.current ? 0 : 750, easing: circOut, delay: 700}} d="M4 16l4 -1l1 4" />
						<path in:draw|global={{duration: prefersReducedMotion.current ? 0 : 750, easing: circOut, delay: 400}} d="M8 15l-3.5 6" />
						<path in:draw|global={{duration: prefersReducedMotion.current ? 0 : 750, easing: circOut, delay: 900}} d="M21 5l-.5 4l-4 -.5" />
						<path in:draw|global={{duration: prefersReducedMotion.current ? 0 : 750, easing: circOut, delay: 600}} d="M20.5 9l-4.5 -5.5" />
					</svg>
				{/key}
				<h4 class="transition-default">Randomize</h4>
			</button>
		</div>
		<div bind:this={slider} class="slider">
			<div class="slider-knob" style="--pos-x: {$state.eager(sliderKnobPosX.current) - 16}px; --rot-x: {sliderKnobPosX.current - 16}deg; background: {colord({ h: color.hue(), s: 100, v: 100 }).toHex()}"></div>
		</div>
		<div class="values">
			<div class="value hex">
				<div class="title">
					<h3>HEX</h3>
					<button title="Copy HEX" class="copy-color" onclick="{() => copyColorValue(inputHEX)}">
						<svg class="transition-default" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
							<path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666" />
							<path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
						</svg>
					</button>
				</div>
				<input bind:this={hexInput} bind:value={inputHEX} class="input hex" type="text"  size="8">
			</div>
			<div class="value rgb">
				<div class="title">
					<h3>RGB</h3>
					<button title="Copy RGB" class="copy-color" onclick="{() => copyColorValue(color.toRgbString())}">
						<svg class="transition-default" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
							<path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666" />
							<path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
						</svg>
					</button>
				</div>
				<input bind:this={rgbInput} bind:value={inputRGB} class="input rgb" type="text" size="12">
			</div>
			<div class="value hsl">
				<div class="title">
					<h3>HSL</h3>
					<button title="Copy HSL" class="copy-color" onclick="{() => copyColorValue(color.toHslString())}">
						<svg class="transition-default" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
							<path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666" />
							<path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
						</svg>
					</button>
				</div>
				<input bind:this={hslInput} bind:value={inputHSL} class="input hsl" type="text" size="14">
			</div>
			<div class="value lch">
				<div class="title">
					<h3>LCH</h3>
					<button title="Copy LCH" class="copy-color" onclick="{() => copyColorValue(color.toLchString())}">
						<svg class="transition-default" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
							<path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666" />
							<path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
						</svg>
					</button>
				</div>
				<input bind:this={lchInput} bind:value={inputLCH} class="input lch" type="text" size="18">
			</div>
			<div class="value oklch">
				<div class="title">
					<h3>OKLCH</h3>
					<button title="Copy OKLCH" class="copy-color" onclick="{() => copyColorValue(getChromaObjFromOKLCH(inputOKLCH).css('oklch'))}">
						<svg class="transition-default" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
							<path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667l0 -8.666" />
							<path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
						</svg>
					</button>
				</div>
				<input bind:this={oklchInput} bind:value={inputOKLCH} class="input oklch" type="text" size="18">
			</div>
		</div>
		<div class="previews">
			<div class="preview scale">
				<div class="color" use:copyToClipboardOnClick={{ value: colorShade(-1) }} use:mouseEventListeners data-preview-color={String(colorShade(-1)).toUpperCase()} style="--bg-color: {colorShade(-1)}; background: var(--bg-color)"></div>
				<div class="color" use:copyToClipboardOnClick={{ value: colorShade(-.9) }} use:mouseEventListeners data-preview-color={String(colorShade(-.9)).toUpperCase()} style="--bg-color: {colorShade(-.9)}; background: var(--bg-color)"></div>
				<div class="color" use:copyToClipboardOnClick={{ value: colorShade(-.8) }} use:mouseEventListeners data-preview-color={String(colorShade(-.8)).toUpperCase()} style="--bg-color: {colorShade(-.8)}; background: var(--bg-color)"></div>
				<div class="color" use:copyToClipboardOnClick={{ value: colorShade(-.7) }} use:mouseEventListeners data-preview-color={String(colorShade(-.7)).toUpperCase()} style="--bg-color: {colorShade(-.7)}; background: var(--bg-color)"></div>
				<div class="color" use:copyToClipboardOnClick={{ value: colorShade(-.6) }} use:mouseEventListeners data-preview-color={String(colorShade(-.6)).toUpperCase()} style="--bg-color: {colorShade(-.6)}; background: var(--bg-color)"></div>
				<div class="color" use:copyToClipboardOnClick={{ value: colorShade(-.5) }} use:mouseEventListeners data-preview-color={String(colorShade(-.5)).toUpperCase()} style="--bg-color: {colorShade(-.5)}; background: var(--bg-color)"></div>
				<div class="color" use:copyToClipboardOnClick={{ value: colorShade(-.4) }} use:mouseEventListeners data-preview-color={String(colorShade(-.4)).toUpperCase()} style="--bg-color: {colorShade(-.4)}; background: var(--bg-color)"></div>
				<div class="color" use:copyToClipboardOnClick={{ value: colorShade(-.3) }} use:mouseEventListeners data-preview-color={String(colorShade(-.3)).toUpperCase()} style="--bg-color: {colorShade(-.3)}; background: var(--bg-color)"></div>
				<div class="color" use:copyToClipboardOnClick={{ value: colorShade(-.2) }} use:mouseEventListeners data-preview-color={String(colorShade(-.2)).toUpperCase()} style="--bg-color: {colorShade(-.2)}; background: var(--bg-color)"></div>
				<div class="color selected" use:copyToClipboardOnClick={{ value: color.toHex() }} data-preview-color={color.toHex().toUpperCase()} style="--bg-color: {color.toHex()}; background: var(--bg-color); --text-active: {showMainColorShade ? 1 : 0};"></div>
				<div class="color" use:copyToClipboardOnClick={{ value: colorShade(.2) }} use:mouseEventListeners data-preview-color={String(colorShade(.2)).toUpperCase()} style="--bg-color: {colorShade(.2)}; background: var(--bg-color)"></div>
				<div class="color" use:copyToClipboardOnClick={{ value: colorShade(.3) }} use:mouseEventListeners data-preview-color={String(colorShade(.3)).toUpperCase()} style="--bg-color: {colorShade(.3)}; background: var(--bg-color)"></div>
				<div class="color" use:copyToClipboardOnClick={{ value: colorShade(.4) }} use:mouseEventListeners data-preview-color={String(colorShade(.4)).toUpperCase()} style="--bg-color: {colorShade(.4)}; background: var(--bg-color)"></div>
				<div class="color" use:copyToClipboardOnClick={{ value: colorShade(.5) }} use:mouseEventListeners data-preview-color={String(colorShade(.5)).toUpperCase()} style="--bg-color: {colorShade(.5)}; background: var(--bg-color)"></div>
				<div class="color" use:copyToClipboardOnClick={{ value: colorShade(.6) }} use:mouseEventListeners data-preview-color={String(colorShade(.6)).toUpperCase()} style="--bg-color: {colorShade(.6)}; background: var(--bg-color)"></div>
				<div class="color" use:copyToClipboardOnClick={{ value: colorShade(.7) }} use:mouseEventListeners data-preview-color={String(colorShade(.7)).toUpperCase()} style="--bg-color: {colorShade(.7)}; background: var(--bg-color)"></div>
				<div class="color" use:copyToClipboardOnClick={{ value: colorShade(.8) }} use:mouseEventListeners data-preview-color={String(colorShade(.8)).toUpperCase()} style="--bg-color: {colorShade(.8)}; background: var(--bg-color)"></div>
				<div class="color" use:copyToClipboardOnClick={{ value: colorShade(.9) }} use:mouseEventListeners data-preview-color={String(colorShade(.9)).toUpperCase()} style="--bg-color: {colorShade(.9)}; background: var(--bg-color)"></div>
				<div class="color" use:copyToClipboardOnClick={{ value: colorShade(.95) }} use:mouseEventListeners data-preview-color={String(colorShade(.95)).toUpperCase()} style="--bg-color: {colorShade(.95)}; background: var(--bg-color)"></div>
			</div>
			<div class="preview harmony">
				<h1 class="harmony-type">Analogous</h1>
				<div class="harmonies">
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('analogous', 1) }} data-preview-color={String(colorMix('analogous', 1)).toUpperCase()} style="--bg-color: {colorMix('analogous', 1)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('analogous', .9) }} data-preview-color={String(colorMix('analogous', .9)).toUpperCase()} style="--bg-color: {colorMix('analogous', .9)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('analogous', .8) }} data-preview-color={String(colorMix('analogous', .8)).toUpperCase()} style="--bg-color: {colorMix('analogous', .8)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('analogous', .7) }} data-preview-color={String(colorMix('analogous', .7)).toUpperCase()} style="--bg-color: {colorMix('analogous', .7)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('analogous', .6) }} data-preview-color={String(colorMix('analogous', .6)).toUpperCase()} style="--bg-color: {colorMix('analogous', .6)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('analogous', .5) }} data-preview-color={String(colorMix('analogous', .5)).toUpperCase()} style="--bg-color: {colorMix('analogous', .5)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('analogous', .4) }} data-preview-color={String(colorMix('analogous', .4)).toUpperCase()} style="--bg-color: {colorMix('analogous', .4)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('analogous', .3) }} data-preview-color={String(colorMix('analogous', .3)).toUpperCase()} style="--bg-color: {colorMix('analogous', .3)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('analogous', .2) }} data-preview-color={String(colorMix('analogous', .2)).toUpperCase()} style="--bg-color: {colorMix('analogous', .2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('analogous', .1) }} data-preview-color={String(colorMix('analogous', .1)).toUpperCase()} style="--bg-color: {colorMix('analogous', .1)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: color.toHex() }} data-preview-color={color.toHex().toUpperCase()} style="--bg-color: {color.toHex()}; background: var(--bg-color); --text-active: {showMainColorShade ? 1 : 0};"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('analogous', .1, 2) }} data-preview-color={String(colorMix('analogous', .1, 2)).toUpperCase()} style="--bg-color: {colorMix('analogous', .1, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('analogous', .2, 2) }} data-preview-color={String(colorMix('analogous', .2, 2)).toUpperCase()} style="--bg-color: {colorMix('analogous', .2, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('analogous', .3, 2) }} data-preview-color={String(colorMix('analogous', .3, 2)).toUpperCase()} style="--bg-color: {colorMix('analogous', .3, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('analogous', .4, 2) }} data-preview-color={String(colorMix('analogous', .4, 2)).toUpperCase()} style="--bg-color: {colorMix('analogous', .4, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('analogous', .5, 2) }} data-preview-color={String(colorMix('analogous', .5, 2)).toUpperCase()} style="--bg-color: {colorMix('analogous', .5, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('analogous', .6, 2) }} data-preview-color={String(colorMix('analogous', .6, 2)).toUpperCase()} style="--bg-color: {colorMix('analogous', .6, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('analogous', .7, 2) }} data-preview-color={String(colorMix('analogous', .7, 2)).toUpperCase()} style="--bg-color: {colorMix('analogous', .7, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('analogous', .8, 2) }} data-preview-color={String(colorMix('analogous', .8, 2)).toUpperCase()} style="--bg-color: {colorMix('analogous', .8, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('analogous', .9, 2) }} data-preview-color={String(colorMix('analogous', .9, 2)).toUpperCase()} style="--bg-color: {colorMix('analogous', .9, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('analogous', 1, 2) }} data-preview-color={String(colorMix('analogous', 1, 2)).toUpperCase()} style="--bg-color: {colorMix('analogous', 1, 2)}; background: var(--bg-color)"></div>
				</div>
				<h1 class="harmony-type">Tetradic</h1>
				<div class="harmonies">
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('tetradic', 1, 1) }} data-preview-color={String(colorMix('tetradic', 1, 1)).toUpperCase()} style="--bg-color: {colorMix('tetradic', 1, 1)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('tetradic', .9, 1) }} data-preview-color={String(colorMix('tetradic', .9, 1)).toUpperCase()} style="--bg-color: {colorMix('tetradic', .9, 1)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('tetradic', .8, 1) }} data-preview-color={String(colorMix('tetradic', .8, 1)).toUpperCase()} style="--bg-color: {colorMix('tetradic', .8, 1)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('tetradic', .7, 1) }} data-preview-color={String(colorMix('tetradic', .7, 1)).toUpperCase()} style="--bg-color: {colorMix('tetradic', .7, 1)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('tetradic', .6, 1) }} data-preview-color={String(colorMix('tetradic', .6, 1)).toUpperCase()} style="--bg-color: {colorMix('tetradic', .6, 1)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('tetradic', .5, 1) }} data-preview-color={String(colorMix('tetradic', .5, 1)).toUpperCase()} style="--bg-color: {colorMix('tetradic', .5, 1)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('tetradic', .4, 1) }} data-preview-color={String(colorMix('tetradic', .4, 1)).toUpperCase()} style="--bg-color: {colorMix('tetradic', .4, 1)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('tetradic', .3, 1) }} data-preview-color={String(colorMix('tetradic', .3, 1)).toUpperCase()} style="--bg-color: {colorMix('tetradic', .3, 1)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('tetradic', .2, 1) }} data-preview-color={String(colorMix('tetradic', .2, 1)).toUpperCase()} style="--bg-color: {colorMix('tetradic', .2, 1)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('tetradic', .1, 1) }} data-preview-color={String(colorMix('tetradic', .1, 1)).toUpperCase()} style="--bg-color: {colorMix('tetradic', .1, 1)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: color.toHex() }} data-preview-color={color.toHex().toUpperCase()} style="--bg-color: {color.toHex()}; background: var(--bg-color); --text-active: {showMainColorShade ? 1 : 0};"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('tetradic', .1, 2) }} data-preview-color={String(colorMix('tetradic', .1, 2)).toUpperCase()} style="--bg-color: {colorMix('tetradic', .1, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('tetradic', .2, 2) }} data-preview-color={String(colorMix('tetradic', .2, 2)).toUpperCase()} style="--bg-color: {colorMix('tetradic', .2, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('tetradic', .3, 2) }} data-preview-color={String(colorMix('tetradic', .3, 2)).toUpperCase()} style="--bg-color: {colorMix('tetradic', .3, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('tetradic', .4, 2) }} data-preview-color={String(colorMix('tetradic', .4, 2)).toUpperCase()} style="--bg-color: {colorMix('tetradic', .4, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('tetradic', .5, 2) }} data-preview-color={String(colorMix('tetradic', .5, 2)).toUpperCase()} style="--bg-color: {colorMix('tetradic', .5, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('tetradic', .6, 2) }} data-preview-color={String(colorMix('tetradic', .6, 2)).toUpperCase()} style="--bg-color: {colorMix('tetradic', .6, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('tetradic', .7, 2) }} data-preview-color={String(colorMix('tetradic', .7, 2)).toUpperCase()} style="--bg-color: {colorMix('tetradic', .7, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('tetradic', .8, 2) }} data-preview-color={String(colorMix('tetradic', .8, 2)).toUpperCase()} style="--bg-color: {colorMix('tetradic', .8, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('tetradic', .9, 2) }} data-preview-color={String(colorMix('tetradic', .9, 2)).toUpperCase()} style="--bg-color: {colorMix('tetradic', .9, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('tetradic', 1, 2) }} data-preview-color={String(colorMix('tetradic', 1, 2)).toUpperCase()} style="--bg-color: {colorMix('tetradic', 1, 2)}; background: var(--bg-color)"></div>
				</div>
				<h1 class="harmony-type">Split-Complementary</h1>
				<div class="harmonies">
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('split-complementary', 1, 1) }} data-preview-color={String(colorMix('split-complementary', 1, 1)).toUpperCase()} style="--bg-color: {colorMix('split-complementary', 1, 1)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('split-complementary', .9, 1) }} data-preview-color={String(colorMix('split-complementary', .9, 1)).toUpperCase()} style="--bg-color: {colorMix('split-complementary', .9, 1)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('split-complementary', .8, 1) }} data-preview-color={String(colorMix('split-complementary', .8, 1)).toUpperCase()} style="--bg-color: {colorMix('split-complementary', .8, 1)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('split-complementary', .7, 1) }} data-preview-color={String(colorMix('split-complementary', .7, 1)).toUpperCase()} style="--bg-color: {colorMix('split-complementary', .7, 1)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('split-complementary', .6, 1) }} data-preview-color={String(colorMix('split-complementary', .6, 1)).toUpperCase()} style="--bg-color: {colorMix('split-complementary', .6, 1)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('split-complementary', .5, 1) }} data-preview-color={String(colorMix('split-complementary', .5, 1)).toUpperCase()} style="--bg-color: {colorMix('split-complementary', .5, 1)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('split-complementary', .4, 1) }} data-preview-color={String(colorMix('split-complementary', .4, 1)).toUpperCase()} style="--bg-color: {colorMix('split-complementary', .4, 1)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('split-complementary', .3, 1) }} data-preview-color={String(colorMix('split-complementary', .3, 1)).toUpperCase()} style="--bg-color: {colorMix('split-complementary', .3, 1)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('split-complementary', .2, 1) }} data-preview-color={String(colorMix('split-complementary', .2, 1)).toUpperCase()} style="--bg-color: {colorMix('split-complementary', .2, 1)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('split-complementary', .1, 1) }} data-preview-color={String(colorMix('split-complementary', .1, 1)).toUpperCase()} style="--bg-color: {colorMix('split-complementary', .1, 1)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: color.toHex() }} data-preview-color={color.toHex().toUpperCase()} style="--bg-color: {color.toHex()}; background: var(--bg-color); --text-active: {showMainColorShade ? 1 : 0};"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('split-complementary', .1, 2) }} data-preview-color={String(colorMix('split-complementary', .1, 2)).toUpperCase()} style="--bg-color: {colorMix('split-complementary', .1, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('split-complementary', .2, 2) }} data-preview-color={String(colorMix('split-complementary', .2, 2)).toUpperCase()} style="--bg-color: {colorMix('split-complementary', .2, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('split-complementary', .3, 2) }} data-preview-color={String(colorMix('split-complementary', .3, 2)).toUpperCase()} style="--bg-color: {colorMix('split-complementary', .3, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('split-complementary', .4, 2) }} data-preview-color={String(colorMix('split-complementary', .4, 2)).toUpperCase()} style="--bg-color: {colorMix('split-complementary', .4, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('split-complementary', .5, 2) }} data-preview-color={String(colorMix('split-complementary', .5, 2)).toUpperCase()} style="--bg-color: {colorMix('split-complementary', .5, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('split-complementary', .6, 2) }} data-preview-color={String(colorMix('split-complementary', .6, 2)).toUpperCase()} style="--bg-color: {colorMix('split-complementary', .6, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('split-complementary', .7, 2) }} data-preview-color={String(colorMix('split-complementary', .7, 2)).toUpperCase()} style="--bg-color: {colorMix('split-complementary', .7, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('split-complementary', .8, 2) }} data-preview-color={String(colorMix('split-complementary', .8, 2)).toUpperCase()} style="--bg-color: {colorMix('split-complementary', .8, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('split-complementary', .9, 2) }} data-preview-color={String(colorMix('split-complementary', .9, 2)).toUpperCase()} style="--bg-color: {colorMix('split-complementary', .9, 2)}; background: var(--bg-color)"></div>
					<div class="color" use:copyToClipboardOnClick={{ value: colorMix('split-complementary', 1, 2) }} data-preview-color={String(colorMix('split-complementary', 1, 2)).toUpperCase()} style="--bg-color: {colorMix('split-complementary', 1, 2)}; background: var(--bg-color)"></div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
    /* Desktop & Tablet (Page specific) */
    @media (width >= 59rem) {
        :root {
            --max-width: min(84rem, 80vw);
        }

        .color-picker-page .values {
            flex-flow: row nowrap;
            justify-content: center;
        }

        .preview, .preview.harmony .harmonies {
            .color {
								width: 5vw;
								aspect-ratio: 1;

                &::after {
										font-size: .9rem;
								}
                &.selected::before {
										font-size: 1.2rem;
								}
            }

            .selected {
								min-width: 3.25rem;
                width: 6vw !important;
            }
				}
    }

    /* Phone (Page specific) */
    @media (width <= 59rem) {
        :root {
            --max-width: min(76rem, 75vw);
        }

        .color-picker-page .values {
						flex-flow: column nowrap;
						align-items: center;
				}

        .preview, .preview.harmony .harmonies {
            .color {
                width: 5vw;
                aspect-ratio: .5;
            }

            .selected {
                min-width: 2.5rem;
                width: 6vw !important;
								max-height: 11vw;
            }

            & .color, &.harmony .harmonies .color {
                &::after {
										filter: blur(2px);
								}
                &:hover::after, &.selected:hover::before {
										filter: none;
								}
                &:hover::after {
                    font-size: .9rem;
								}
                &.selected:hover::before {
										font-size: 1.05rem;
								}
                &.selected::before {
                    font-size: 1rem;
                }
            }
        }
		}

		:global html {
				/* Prevents the input text to be selected when the user is dragging the slider */
				user-select: none;
		}

    .color-picker-page {
        width: var(--max-width);
        height: fit-content;
				margin: 0 auto;
				padding-top: 1px;

				.page-header {
            width: 100%;
						padding: min(3rem, 4vw) 0;

						.title {
								margin-left: 2rem;
								font-size: min(3.5rem, 5vw);

                background-image: var(--theme-text-gradient);
                background-clip: text;
                color: transparent;
						}
				}

        .color-picker-cursor {
            position: fixed;
            transform: translate(-10px, -10px);
            width: 24px;
            height: 24px;
            border-radius: 100%;

            border: 4px solid;

            background: var(--current-color);

            z-index: 500 !important;
        }

        .color-picker-content {
            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            justify-content: flex-start;

            width: 100%;
            height: 100%;

            .color-picker {
                width: inherit;
                height: inherit;

                min-width: 200px;
                max-width: min(92rem, 86vw);
                min-height: 200px;
                max-height: 50vh;

								border: solid 3px color-mix(var(--theme-ui-line-highlight) 40%, var(--theme-color-primary-reverse) 60%);

                background: linear-gradient(#FFFFFF00, #000000FF), linear-gradient(0.25turn, #FFFFFFFF, #00000000), var(--picker-color-bg);

								cursor: pointer;

                transition: border-radius 200ms 1s ease-out;

								&:hover {
										transition-timing-function: ease-out;
                    transition-delay: 0s;
								}
            }

						.actions {
                gap: 1rem;

                width: 100%;
								max-width: var(--max-width);
                height: fit-content;
                padding: 0 .5rem;

                box-sizing: border-box;

                margin-top: .75rem;

								overflow: hidden;
						}

            .actions-parent {
                gap: .4rem;

								.title {
                    display: flex;
                    flex-flow: row nowrap;
                    align-items: center;
                    justify-content: center;
										gap: .2rem;
										font-size: 1.025rem;

										svg {
												color: var(--theme-text-third);
										}
								}
						}

						.actions-parent .title, .actions .action {
                svg {
                    height: 1.4rem;
                }
						}

						.actions, .actions-parent {
								display: flex;
								flex-flow: row nowrap;
								align-items: center;
								justify-content: flex-end;

								.action {
										display: flex;
										flex-flow: row nowrap;
										align-items: center;
										justify-content: center;
										gap: .2rem;
										font-size: 1.025rem;

										h4, svg {
                        color: var(--theme-text-third);
										}

                    &:hover h4, &:hover svg {
                        color: var(--theme-text-secondary);
                    }

										&:active h4, &:active svg {
                        color: var(--theme-color-accent);
										}
								}
						}

            .slider {
                height: min(.5rem, .8vw);
                width: 95%;
                margin-top: 4.5rem;

                pointer-events: bounding-box;
								cursor: pointer;

                border-radius: .35rem;

                .slider-knob {
                    height: min(1.65rem, 3vw);
                    width: min(1.65rem, 3vw);
                    border-radius: 100%;
                    border: 4px solid var(--theme-color-offwhite);
                    transform: translate(var(--pos-x), max(-.5rem, -1vw));

                    transition: transform 35ms ease;
                }

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
            }

            .values {
                display: flex;
                margin-top: 1.5rem;
                width: 100%;

                .value {
                    display: flex;
                    flex-flow: column nowrap;
                    align-items: center;
                    justify-content: flex-start;

                    width: 20%;
                    padding: 0 .5rem;
                    margin: 0 .25rem;

                    user-select: none;

                    .title {
												display: flex;
												flex-flow: row nowrap;
												align-items: center;
												justify-content: center;
												gap: .25rem;

                        color: var(--theme-text-third);
                        font-weight: 650;

												margin-left: 1.35rem;

												.copy-color {
														width: 1.1rem;
														height: 1.1rem;

														svg {
                                color: var(--theme-text-fourth);
														}

														&:hover svg {
																color: var(--theme-text-secondary);
														}
												}
                    }

                    .input {
                        font-family: 'Geologica', 'Google Sans', sans-serif;
                        text-align: center;

                        width: fit-content;
                        color: var(--theme-text-primary);
                        font-weight: 450;
                        user-select: all;
                    }
                }
            }

            .previews {
                display: flex;
                flex-flow: column nowrap;
                justify-content: center;
                align-items: center;

                min-width: 200px;
                width: 100%;
                max-width: min(76rem, 70vw);

                .preview, .preview.harmony .harmonies {
                    display: flex;
                    flex-flow: row nowrap;
                    align-items: center;

                    width: fit-content;
                    height: fit-content;
                    max-width: inherit;
                }

                .preview {
                    width: 100%;
                    margin-top: 3rem;
										margin-bottom: 1rem;
										padding-bottom: 1rem;

										&.harmony {
												display: flex;
												flex-flow: column nowrap;
                        max-width: min(76rem, 70vw);

												.harmony-type {
														align-self: start;
														margin-bottom: .2rem;
												}

                        .harmonies {
														margin-bottom: 2rem;

														.color::after {
                                transform: translateY(1.5rem) !important;
														}
												}
										}

                    &.harmony .harmonies .color {
												&:hover::after {
														font-weight: 600 !important;
												}
										}

                    .color {
                        cursor: cell;

                        --border-radius: .5rem;

                        &:first-child {
                            border-top-left-radius: var(--border-radius);
                            border-bottom-left-radius: var(--border-radius);
                        }

                        &:last-child {
                            border-top-right-radius: var(--border-radius);
                            border-bottom-right-radius: var(--border-radius);
                        }

                        &.selected {
                            border-radius: var(--border-radius);
                            box-shadow: -.15rem 0 1.5rem rgba(from color-mix(var(--bg-color) 50%, #000 50%) r g b / .25);
                            z-index: 650;

                            &:hover::after {
                                transform: none;
                                opacity: 0 !important;
                            }
                        }

                        perspective: 0;
                        transition: z-index 3s 3s linear, transform 500ms, border-radius 500ms;
                        transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);

                        &:hover {
                            transform: scale(1.25);
                            transition: transform 350ms, z-index 0ms, border-radius 200ms;
                            transition-timing-function: linear(0, 0.002 0.2%, 0.008 0.4%, 0.029 0.8%, 0.073 1.3%, 0.13 1.8%, 0.258 2.7%, 0.686 5.4%, 0.807 6.3%, 0.908 7.2%, 0.987 8.1%, 1.051 9.1%, 1.091 10.1%, 1.103 10.6%, 1.112 11.2%, 1.115 11.7%, 1.116 12.2%, 1.112 12.8%, 1.106 13.4%, 1.089 14.5%, 1.033 17.6%, 1.007 19.5%, 0.993 21.2%, 0.987 23.1%, 0.987 25%, 0.998 30.9%, 1.001 35%, 1 46.8%, 1);
                            box-shadow: -.15rem 0 1.5rem rgba(from color-mix(var(--bg-color) 50%, #000 50%) r g b / .25);
                            border-radius: var(--border-radius);

                            z-index: 700;

                            &::after {
                                opacity: 1;
                                font-weight: 700;
                                transition: opacity 150ms ease, font-weight 150ms ease, font-size 150ms ease;
                            }
                        }

                        &::after, &.selected::before {
                            pointer-events: none;
                            content: attr(data-preview-color);
                            transform: translateY(2rem);
                            display: block;
                            position: absolute;
                            bottom: 0;
                            justify-self: center;
                            will-change: transform;

                            color: var(--theme-color-primary);
                            font-weight: 400;

                            opacity: 0;
                            transition: opacity 250ms ease, font-weight 300ms ease, font-size 300ms ease, filter 200ms ease;
                        }

                        &.selected::before {
                            opacity: var(--text-active, 1);
                            font-weight: 700;
                        }
                    }
                }
						}
        }
    }
</style>