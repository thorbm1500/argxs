<script lang="ts">
	import ColorPaletteComponent from '$lib/components/ColorPaletteComponent.svelte';
	import ContentHeaderComponent from '$lib/components/ContentHeaderComponent.svelte';
</script>

<section class="color-palette-content">
	<ContentHeaderComponent title="Color Palettes" type="palettes" amount={13} />

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
