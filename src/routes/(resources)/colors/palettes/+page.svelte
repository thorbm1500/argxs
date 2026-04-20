<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import ColorPaletteComponent from '$lib/components/ColorPaletteComponent.svelte';

	let theme: 'light' | 'dark' = $state(getContext('theme'));

	onMount(async () => {
		window.cookieStore.addEventListener('change', async (e) => {
			for (const cookie of e.changed) {
				if (cookie.name === 'argxs_theme') {
					const currentTheme = await window.cookieStore.get('argxs_theme');
					if (currentTheme !== null) {
						theme = currentTheme.value === 'light' || currentTheme.value === 'dark' ? currentTheme.value : 'light';
					}
				}
			}
		});
	});
</script>

<section class="color-palette-content">
	<section class="content-header {theme}">
		<div class="text">
			<h1 class="title">
				Color Palettes
			</h1>
			<div class="subtitle">
				<!--todo: Write subtitle-->
				<p>argxs currently showcases <strong style="color:color-mix(var(--theme-text-third) 25%, var(--theme-color-accent) 75%);">0</strong> different palettes</p>
			</div>
		</div>
	</section>

	<section class="color-palette-sec">
		<ColorPaletteComponent title="Red" color="red" />
		<ColorPaletteComponent title="Blood Orange" color="blood-orange" />
		<ColorPaletteComponent title="Orange" color="orange" />
		<ColorPaletteComponent title="Yellow" color="yellow" />
		<ColorPaletteComponent title="Light Green" color="light-green" />
		<ColorPaletteComponent title="Mint" color="mint" />
		<ColorPaletteComponent title="Cyan" color="cyan" />
		<ColorPaletteComponent title="Light Blue" color="light-blue" />
		<ColorPaletteComponent title="Blue" color="blue" />
		<ColorPaletteComponent title="Indigo" color="indigo" />
		<ColorPaletteComponent title="Purple" color="purple" />
		<ColorPaletteComponent title="Pink" color="pink" />
		<ColorPaletteComponent title="Rose" color="rose" />
	</section>
</section>

<style>
		.color-palette-content {
				padding: 2rem;
		}

    .color-palette-sec {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        padding: 2rem;

        width: 100%;
        height: fit-content;
    }
</style>