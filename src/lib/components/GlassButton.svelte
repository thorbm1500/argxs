<script lang="ts">
	import { getContext } from 'svelte';
	import type { PageTheme } from '$lib/components/interfaces';
	import { prefersReducedMotion } from 'svelte/motion';
	
	const { children, className, marginTop = 0, marginRight = 0, marginBottom = 0, marginLeft = 0 } = $props();
	
	const themeFunction: Function | undefined = getContext('theme');
	let theme: PageTheme = $derived(themeFunction?.() ?? 'dark');
	let scrollY: number = $derived(getContext('scrollY') ?? 0);
</script>

<div class="{theme} svt-glass-button-parent {className}" style:margin-top="{marginTop}rem">
	<div inert>
		<div class="svt-glass-button effect-b"></div>
		<div class="svt-glass-button effect-c">
			<div class="effect-d"></div>
		</div>
		<div class="svt-glass-button effect-e"></div>
		<div class="svt-glass-button effect-f">
			<div class="effect-g"></div>
		</div>
	</div>
	{@render children?.()}
</div>

<style>
	.svt-glass-button-parent {
		width:    fit-content;
		height:   fit-content;
		
		top: inherit;
		left: inherit;
		right: inherit;
		bottom: inherit;
		
		backdrop-filter: brightness(1.025);
		
		&.hide {
			opacity: 0 !important;
			pointer-events: none !important;
		}
		
		:global(*) {
			z-index:    999;
		}
		
		.svt-glass-button {
			position: absolute;
			width:    100%;
			height:   100%;
			top: inherit;
			left: inherit;
			right: inherit;
			bottom: inherit;
			
			z-index:       999;
			border-radius: .9rem;
		}
		
		.effect-b {
			display: none;
			backdrop-filter: url('#svt-glass-button-distortion-filter') brightness(1.1) saturate(1.35) contrast(1.0025) url('#svt-glass-button-blur-filter');
			z-index:         990 !important;
		}
		
		.effect-c {
			overflow:       hidden;
			mask-type:      luminance;
			
			mask-image:     linear-gradient(0deg, black 0%, transparent 35%, transparent 65%, black 100%), linear-gradient(15deg, black 0%, transparent 35%, transparent 100%);
			mix-blend-mode: darken;
			
			z-index:        990 !important;
			
			.effect-d {
				position:      inherit;
				width:         inherit;
				height:        inherit;
				border-radius: inherit;
				
				border:        .15rem solid rgb(44 44 61 / 0.2);
				filter:        blur(2px);
				
				z-index:       990 !important;
			}
		}
		
		.effect-e {
			overflow:         hidden;
			
			background-color: rgb(236 242 245 / 0.07);
			mask-image:       linear-gradient(30deg, transparent 0%, black 100%), linear-gradient(to top, transparent 0%, rgb(0 0 0 / .5) 100%);
			
			z-index:          990 !important;
		}
		
		.effect-f {
			overflow:       hidden;
			mask-type:      luminance;
			
			mask-image:     linear-gradient(-20deg, black 0%, transparent 35%, transparent 65%, black 100%);
			mix-blend-mode: darken;
			
			z-index:        990 !important;
			
			.effect-g {
				position:      inherit;
				width:         inherit;
				height:        inherit;
				border-radius: inherit;
				
				border:        .15rem solid rgb(40 51 77 / 0.425);
				filter:        blur(2px);
				
				z-index:       990 !important;
			}
		}
		
		&.dark {
			.effect-c {
				mask-image:     linear-gradient(0deg, black 0%, transparent 35%, transparent 65%, black 100%), linear-gradient(15deg, black 0%, transparent 35%, transparent 100%);
				mix-blend-mode: lighten;
				
				.effect-d {
					border: .15rem solid rgb(244 248 252 / 0.67);
				}
			}
			
			.effect-g {
				border-color: rgb(55 72 86 / 0.67);
			}
		}
	}
</style>