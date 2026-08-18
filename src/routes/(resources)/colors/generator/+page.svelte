<script lang="ts">
	import GlassButton from '$lib/components/GlassButton.svelte';
	import { type Colord, colord } from 'colord';
	import chroma from 'chroma-js';
	import { onMount } from 'svelte';

	const { data } = $props();

	const random = () => Math.trunc(Math.random() * 256);

	enum Color {
		RED = 'Red',
		ORANGE = 'Orange',
		YELLOW = 'Yellow',
		GREEN = 'Green',
		BLUE = 'Blue',
		PURPLE = 'Purple',
	}
	function getColorFromString(color: string): Color {
		switch (color.toLowerCase()) {
			case 'red': return Color.RED;
			case 'orange': return Color.ORANGE;
			case 'yellow': return Color.YELLOW;
			case 'green': return Color.GREEN;
			case 'blue': return Color.BLUE;
			case 'purple': return Color.PURPLE;
			default: return Color.RED;
		}
	}
	function allColors(): { name: string, preview: string }[] {
		return [
			{
				name: Color.RED,
				preview: '#D70D38'
			},
			{
				name: Color.ORANGE,
				preview: '#F4B408'
			},
			{
				name: Color.YELLOW,
				preview: '#FEFE67'
			},
			{
				name: Color.GREEN,
				preview: '#20C735'
			},
			{
				name: Color.BLUE,
				preview: '#4144E5'
			},
			{
				name: Color.PURPLE,
				preview: '#9349EF'
			}
		];
	}

	interface Instance {
		hex: string,
		rgb: string,
		hsl: string,
		oklch: string,
		dark: boolean
	}
	interface RGB {
		r: number,
		g: number,
		b: number
	}

	const colors: Instance[] = $state([]);

	const filter: { color: { current: Color | null, target: Color | null } } = $state({
		color: {
			current: null,
			target: null
		}
	});

	function isColorValid(color: Color, type: Color.RED | Color.GREEN | Color.BLUE, rgb: RGB) {
		switch (color) {
			case Color.RED:
				switch (type) {
					case Color.RED: { return rgb.r > 30 }
					case Color.GREEN: { return rgb.r / rgb.g > 2 && rgb.g < 30 }
					default: { return rgb.r / rgb.b > 2.5 && rgb.b < 60 }
			}
			case Color.ORANGE:
				switch (type) {
					case Color.RED: { return rgb.r > 140 }
					case Color.GREEN: { return rgb.r / rgb.g > 3.25 && rgb.g < 70 && rgb.g > 25 }
					default: { return rgb.b < 10 }
				}
			case Color.YELLOW:
				switch (type) {
					case Color.RED: { return rgb.r > 230 }
					case Color.GREEN: { return rgb.g > 205 && rgb.r / rgb.g > 1 }
					default: { return rgb.b < 2 }
				}
			case Color.GREEN: {
				switch (type) {
					case Color.RED: { return rgb.g / rgb.r > 1.5 && rgb.r < 200 }
					case Color.GREEN: { return rgb.g > 30 }
					default: { return rgb.g / rgb.b > 1.75 && rgb.b < 175 }
				}
			}
			case Color.BLUE: {
				switch (type) {
					case Color.RED: { return rgb.b / rgb.r > 1.15 && rgb.r < 150 }
					case Color.GREEN: { return rgb.b / rgb.g > 1.5 && rgb.g < 100 }
					default: { return rgb.b > 40 }
				}
			}
			case Color.PURPLE: {
				switch (type) {
					case Color.RED: { return (rgb.b / rgb.r > 1.05) && rgb.r > 40 }
					case Color.GREEN: { return rgb.b / rgb.g > 1.5 && rgb.g < 150 }
					default: { return rgb.b > 40 }
				}
			}
			default: { return true }
		}
	}

	async function generateColors() {
		filter.color.current = filter.color.target;
		for (let i = 0; i < 20; i++) {
			// Ensures that palettes only consists of the selected color, by forcing a restart if the color is changed midway.
			if (filter.color.current !== filter.color.target) break;
			const color: Colord = await generateColor();
			const oklch = chroma(color.toHex()).oklch();
			colors[i] = {
				hex: color.toHex().toUpperCase(),
				rgb: color.toRgbString(),
				hsl: color.toHslString(),
				oklch: `oklch(${(oklch[0]).toFixed(2)} ${(oklch[1]).toFixed(2)}% ${(oklch[2]).toFixed(2)}deg)`,
				dark: color.isDark()
			};
		}
	}

	async function generateColor(): Promise<Colord> {
		// Initialize new color with random numbers for better generation
		const rgb: RGB = { r: random(), g: random(), b: random() }

		/*
		* The colors require different colors to be generated first, otherwise the generation behaves weird, and can sometimes end in endless generation loops.
		* Example generating Purple:
		* When generating purple, we wish to achieve a color of this result:
		* 	Red should be at least 40.
		* 	Green should be less than 150.
		* 	Blue should be at least 40.
		*
		* Just generating based off of these requirements is easy. We just generate a random number for
		* each color until the requirement is met. The difficult part is the next set of requirements.
		*
		* To fine-tune the colors, they also have ratio requirements. For purple the requirements are as follows:
		* 	Blue should be bigger than red at a minimum ratio of 1.05.
		* 	Blue should be bigger than green at a minimum ratio of 1.5
		*
		* Now let's imagine we attempt to generate purple following the order RED => GREEN => BLUE.
		* Our baseline starts with a random generation across all colors: { r: random(), g: random(), b: random() }
		*	In this example our baseline has generated as { r: 184, g: 121, b: 21 }
		*
		* If we were to attempt to satisfy the requirements for purple by follow the order RED => GREEN => BLUE,
		* the generation would loop forever, as it would be impossible to satisfy:
		* 	BLUE / RED > 1.05 && RED > 40
		*
		* This is due to BLUE being generated well below the required minimum of 40, and since RED has
		* a minimum requirement of 40, it'll never be able to generate a number that'll ratio BLUE with 1.05
		* */
		switch (filter.color.target) {
			case Color.RED:
				while(!isColorValid(Color.RED, Color.RED, rgb)) rgb.r = random();
				while(!isColorValid(Color.RED, Color.BLUE, rgb)) rgb.b = random();
				while(!isColorValid(Color.RED, Color.GREEN, rgb)) rgb.g = random();
				break;
			case Color.ORANGE:
				while(!isColorValid(Color.ORANGE, Color.RED, rgb)) rgb.r = random();
				while(!isColorValid(Color.ORANGE, Color.BLUE, rgb)) rgb.b = random();
				while(!isColorValid(Color.ORANGE, Color.GREEN, rgb)) rgb.g = random();
				break;
			case Color.YELLOW:
				while(!isColorValid(Color.YELLOW, Color.RED, rgb)) rgb.r = random();
				while(!isColorValid(Color.YELLOW, Color.GREEN, rgb)) rgb.g = random();
				while(!isColorValid(Color.YELLOW, Color.BLUE, rgb)) rgb.b = random();
				break;
			case Color.GREEN:
				while(!isColorValid(Color.GREEN, Color.GREEN, rgb)) rgb.g = random();
				while(!isColorValid(Color.GREEN, Color.RED, rgb)) rgb.r = random();
				while(!isColorValid(Color.GREEN, Color.BLUE, rgb)) rgb.b = random();
				break;
			case Color.BLUE:
				while(!isColorValid(Color.BLUE, Color.BLUE, rgb)) rgb.b = random();
				while(!isColorValid(Color.BLUE, Color.RED, rgb)) rgb.r = random();
				while(!isColorValid(Color.BLUE, Color.GREEN, rgb)) rgb.g = random();
				break;
			case Color.PURPLE:
				while(!isColorValid(Color.PURPLE, Color.BLUE, rgb)) rgb.b = random();
				while(!isColorValid(Color.PURPLE, Color.RED, rgb)) rgb.r = random();
				while(!isColorValid(Color.PURPLE, Color.GREEN, rgb)) rgb.g = random();
				break;
			default:
				// Color is initialized with random values. Do nothing.
				break;
		}

		return colord(rgb);
	}

	onMount(() => generateColors());

	$effect(() => {
		if (filter.color.current !== filter.color.target) generateColors();
	})
</script>

<svelte:head>
	<meta charset="utf-8">
	<title>{data.seo.title}</title>
	{#if data.seo.description}
		<meta name="description" content={data.seo.description} />
	{/if}
</svelte:head>

<section class="color-palette-content">
	<section class="header">
		<h1 class="title">Color Generator</h1>
		<div class="actions">
			<GlassButton className="regenerate">
				<button class="regenerate" onclick="{() => generateColors()}">Regenerate</button>
			</GlassButton>
		</div>
	</section>
	<section class="filters">
		{#each allColors() as color}
			<button class={{ filter: true, active: filter.color.current === color.name, "transition-default": true }} onclick="{() => {
				if (filter.color.current !== color.name) {
					filter.color.target = getColorFromString(color.name)
				} else filter.color.target = null;
			}}">
				<div class="circle" style="background: {color.preview};"></div>
				<p class="name">{color.name}</p>
			</button>
		{/each}
	</section>
	<section class="color-palette-sec">
		<div class="color-row">
			{#each colors.slice(0,3) as color}
				<div class="color {color.dark ? 'dark' : 'light'}" style="--current-color: {color.hex};">
					<p class="value">{color.hex}</p>
					<p class="value">{color.rgb}</p>
					<p class="value">{color.hsl}</p>
					<p class="value">{color.oklch}</p>
				</div>
			{/each}
		</div>
		<div class="color-row">
			{#each colors.slice(3,5) as color}
				<div class="color {color.dark ? 'dark' : 'light'}" style="--current-color: {color.hex};">
					<p class="value">{color.hex}</p>
					<p class="value">{color.rgb}</p>
					<p class="value">{color.hsl}</p>
					<p class="value">{color.oklch}</p>
				</div>
			{/each}
		</div>
		<div class="color-row">
			{#each colors.slice(5,9) as color}
				<div class="color {color.dark ? 'dark' : 'light'}" style="--current-color: {color.hex};">
					<p class="value">{color.hex}</p>
					<p class="value">{color.rgb}</p>
					<p class="value">{color.hsl}</p>
					<p class="value">{color.oklch}</p>
				</div>
			{/each}
		</div>
		<div class="color-row">
			{#each colors.slice(9,10) as color}
				<div class="color {color.dark ? 'dark' : 'light'}" style="--current-color: {color.hex};">
					<p class="value">{color.hex}</p>
					<p class="value">{color.rgb}</p>
					<p class="value">{color.hsl}</p>
					<p class="value">{color.oklch}</p>
				</div>
			{/each}
		</div>
		<div class="color-row">
			{#each colors.slice(10,13) as color}
				<div class="color {color.dark ? 'dark' : 'light'}" style="--current-color: {color.hex};">
					<p class="value">{color.hex}</p>
					<p class="value">{color.rgb}</p>
					<p class="value">{color.hsl}</p>
					<p class="value">{color.oklch}</p>
				</div>
			{/each}
		</div>
		<div class="color-row">
			{#each colors.slice(13,15) as color}
				<div class="color {color.dark ? 'dark' : 'light'}" style="--current-color: {color.hex};">
					<p class="value">{color.hex}</p>
					<p class="value">{color.rgb}</p>
					<p class="value">{color.hsl}</p>
					<p class="value">{color.oklch}</p>
				</div>
			{/each}
		</div>
		<div class="color-row">
			{#each colors.slice(15,19) as color}
				<div class="color {color.dark ? 'dark' : 'light'}" style="--current-color: {color.hex};">
					<p class="value">{color.hex}</p>
					<p class="value">{color.rgb}</p>
					<p class="value">{color.hsl}</p>
					<p class="value">{color.oklch}</p>
				</div>
			{/each}
		</div>
		<div class="color-row">
			{#each colors.slice(19,20) as color}
				<div class="color {color.dark ? 'dark' : 'light'}" style="--current-color: {color.hex};">
					<p class="value">{color.hex}</p>
					<p class="value">{color.rgb}</p>
					<p class="value">{color.hsl}</p>
					<p class="value">{color.oklch}</p>
				</div>
			{/each}
		</div>
	</section>
</section>

<style>
    .color-palette-content {
				height: fit-content;
				width: 100%;
				padding: 2rem;

				.header {
						display: flex;
						flex-flow: row nowrap;
						justify-content: space-between;
						align-items: center;

						margin-bottom: 2rem;

						.title {
								font-size: 3rem;
						}

						.actions {
								display: flex;

								.regenerate {
                    padding: .15rem .35rem .15rem .2rem;
										user-select: none;
								}

                .regenerate, :global .regenerate {
                    position: relative !important;

                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: .25rem;

                    padding: .3rem .45rem .3rem .25rem;
                    border-radius: .9rem;

                    font-size: .925rem;
                    font-weight: 800;
                    text-wrap: nowrap;

                    cursor: pointer;

                    z-index: 999;

                    transition: var(--theme-transition-off);

                    svg {
                        width: 1.35rem;
                        height: 1.35rem;
                    }

                    &:hover {
                        transform: scale(1.025);
                        filter: brightness(1.15);
                        transition: var(--theme-transition-on);
                    }

                    &:active {
                        transform: scale(.975);
                    }

                    &.inactive {
                        filter: grayscale(.75);
                        opacity: .5;
                    }

                    & > div {
                        top: 0;
                        left: 0;
                    }
                }

								button {
										font-size: 1.15rem;
										font-weight: 500;
								}
						}
				}

				.filters {
						display: flex;
						flex-flow: row wrap;
						gap: .25rem;

						width: fit-content;

						margin-bottom: .5rem;

						.filter {
								display: flex;
								flex-flow: row nowrap;
								align-items: center;
								justify-content: space-between;
								gap: .25rem;

								width: 7.25rem;
								height: 2.5rem;

								background: var(--theme-ui-button);
								border: 1px solid var(--theme-ui-button-border);
								border-radius: .9rem;

								.circle {
										width: .6rem;
										height: .6rem;
										border-radius: 100%;
										margin-left: 1rem;
										opacity: .7;
								}

								.name {
										margin-right: 1rem;

                    color: var(--theme-text-fourth);
										font-family: 'Funnel Sans', sans-serif;
										font-size: 1rem;
								}

								&.active {
										background: var(--theme-ui-button-active);
                    border-color: var(--theme-ui-button-border-active);

										.circle {
                        opacity: 1;
										}
										.name {
												color: var(--theme-text-primary) !important;
										}
								}

                &:active {
                    background: var(--theme-ui-button-click) !important;
                    border-color: var(--theme-ui-button-border-click) !important;
                }

								&:hover {
										background: var(--theme-ui-button-hover);
										border-color: var(--theme-ui-button-border-hover);

                    .circle {
                        opacity: 1;
                    }
										.name {
                        color: var(--theme-text-third);
										}
								}
						}
				}

        .color-palette-sec {
            display: flex;
            flex-flow: column nowrap;
            align-items: flex-start;
            justify-content: flex-start;
            gap: .5rem;

            width: 100%;
            height: calc(100% - 4rem);

            .color-row {
                flex: 1;

                display: flex;
                flex-flow: row wrap;
                align-items: center;
                justify-content: center;
								align-content: stretch;
								gap: .5rem;

                width: 100%;
                height: fit-content;

                .color {
                    flex: 1;
                    width: 100%;
										height: 20rem;

                    background: var(--current-color);
										border-radius: .9rem;

										padding: 1.5rem;
										box-sizing: border-box;

										.value {
												font-weight: 700;
												font-family: 'Funnel Display', sans-serif;
										}

										&.dark .value {
												color: var(--theme-color-white) !important
										}
										&.light .value {
                        color: var(--theme-color-black) !important;
										}
                }
            }
        }
    }
</style>