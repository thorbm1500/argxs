<script lang="ts">
	import { getContext } from 'svelte';
	import { copyToClipboard } from '$lib/utilities';

	let { color } = $props();

	const sendToast: any = $derived(getContext('sendToast'));
</script>

<div class="color {color.dark ? 'dark' : 'light'}" style="--current-color: {color.hex};">
	<button class="value" onclick="{async () => {
		if (await copyToClipboard(color.hex)) {
			sendToast?.({ message: 'Copied', duration: 1250, type: 'copy', status: 'success' })
		}}}">
		{color.hex}
	</button>
	<button class="value" onclick="{async () => {
		if (await copyToClipboard(color.rgb)) {
			sendToast?.({ message: 'Copied', duration: 1250, type: 'copy', status: 'success' })
		}}}">
		{color.rgb}
	</button>
	<button class="value" onclick="{async () => {
		if (await copyToClipboard(color.hsl)) {
			sendToast?.({ message: 'Copied', duration: 1250, type: 'copy', status: 'success' })
		}}}">
		{color.hsl}
	</button>
	<button class="value" onclick="{async () => {
		if (await copyToClipboard(color.oklch)) {
			sendToast?.({ message: 'Copied', duration: 1250, type: 'copy', status: 'success' })
		}}}">
		{color.oklch}
	</button>
</div>

<style>
    .color {
        flex: 1;
				display: inline-flex;
        width: 100%;
        height: 20rem;
				flex-flow: column nowrap;
				align-items: flex-start;

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
</style>