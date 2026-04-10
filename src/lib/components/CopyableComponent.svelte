<script lang="ts">
	let { icon = null, content = '', type = 'SVG' } = $props();
</script>

<div class="copyable-container">
	<div class="inner-content">
		{#if icon !== null}
			{@html icon.html}
		{:else}
			{@html content}
		{/if}
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

        border: 1px solid var(--theme-ui-line);
        border-radius: .5rem;

        .inner-content :global {
            svg {
                height: 100%;
								width: 100%;
            }

						height: 100%;
						max-height: 2.5rem;
        }
    }

    .copyable-container:hover {
        border-color: var(--theme-ui-line-highlight);
    }
</style>