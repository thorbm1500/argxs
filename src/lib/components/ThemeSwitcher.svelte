<script lang="ts">
	import { getContext } from 'svelte';
	
	const updateThemeContext = getContext('toggleTheme') as Function;
	
	let { theme = $bindable() } = $props();
	
	async function updateTheme() {
		if (!updateThemeContext) return;
		updateThemeContext();
		await window.cookieStore.set('argxs_theme', theme);
	}
</script>

<!--svelte-ignore a11y_positive_tabindex-->
<button title="" onclick={updateTheme} class="theme-switch-button {theme}" tabindex="999">
	<!--suppress HtmlUnknownTag -->
	<div class="button-switch">
		{#if theme === 'light'}
			<svg fill="currentColor" width="512" height="512" viewBox="0 0 512 512">
				<path
					d="M256 118a22 22 0 0 1-22-22V48a22 22 0 0 1 44 0v48a22 22 0 0 1-22 22m0 368a22 22 0 0 1-22-22v-48a22 22 0 0 1 44 0v48a22 22 0 0 1-22 22m113.14-321.14a22 22 0 0 1-15.56-37.55l33.94-33.94a22 22 0 0 1 31.11 31.11l-33.94 33.94a21.93 21.93 0 0 1-15.55 6.44M108.92 425.08a22 22 0 0 1-15.55-37.56l33.94-33.94a22 22 0 1 1 31.11 31.11l-33.94 33.94a21.94 21.94 0 0 1-15.56 6.45M464 278h-48a22 22 0 0 1 0-44h48a22 22 0 0 1 0 44m-368 0H48a22 22 0 0 1 0-44h48a22 22 0 0 1 0 44m307.08 147.08a21.94 21.94 0 0 1-15.56-6.45l-33.94-33.94a22 22 0 0 1 31.11-31.11l33.94 33.94a22 22 0 0 1-15.55 37.56M142.86 164.86a21.9 21.9 0 0 1-15.55-6.44l-33.94-33.94a22 22 0 0 1 31.11-31.11l33.94 33.94a22 22 0 0 1-15.56 37.55M256 358a102 102 0 1 1 102-102a102.12 102.12 0 0 1-102 102" />
			</svg>
		{:else}
			<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 1.992a10 10 0 1 0 9.236 13.838c.341 -.82 -.476 -1.644 -1.298 -1.31a6.5 6.5 0 0 1 -6.864 -10.787l.077 -.08c.551 -.63 .113 -1.653 -.758 -1.653h-.266l-.068 -.006l-.06 -.002z" />
			</svg>
		{/if}
	</div>
</button>

<style>
	.theme-switch-button {
		position:        relative;
		
		width:           3rem;
		height:          1.5rem;
		
		cursor:          pointer;
		background:      transparent;
		background: var(--theme-ui-container);
		
		border:          1px solid rgba(from var(--theme-ui-line) r g b / .75);
		border-radius:   1rem;
		
		.button-switch {
			position:        relative;
			top:             0.05rem;
			left:            0.15rem;
			
			width:           1.125rem;
			height:          1.125rem;
			border-radius:   100%;
			
			display:         flex;
			align-items:     center;
			justify-content: center;
			
			transition:      175ms cubic-bezier(0.125, 0.885, 0.42, 1.2);
			
			svg {
				height:         100%;
				width:          100%;
				padding:        .1rem;
				pointer-events: none !important;
				
				color:           var(--theme-text-secondary);
				
				transition:      175ms cubic-bezier(0.125, 0.885, 0.42, 1.2);
			}
		}
	}
	
	.theme-switch-button:hover .button-switch {
		svg {
			transform: scale(1.5);
			color: var(--theme-color-primary);
			transition: 125ms cubic-bezier(0.125, 0.885, 0.42, 1.2);
		}
	}
	
	.theme-switch-button.dark .button-switch {
		left:       1.6rem;
		transform:  rotate(720deg);
		transition: 175ms cubic-bezier(0.125, 0.885, 0.42, 1.2);
	}
</style>