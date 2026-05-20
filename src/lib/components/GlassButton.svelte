<script lang="ts">
	import { getContext } from 'svelte';
	import type { PageTheme } from '$lib/components/interfaces';
	import { prefersReducedMotion } from 'svelte/motion';
	
	const { children, className } = $props();
	
	const themeFunction: Function | undefined = getContext('theme');
	let theme: PageTheme = $derived(themeFunction?.() ?? 'dark');
	let scrollY: number = $derived(getContext('scrollY') ?? 0);
</script>

<svg style="display: none;">
	<defs>
		<filter id="svt-glass-button-distortion-filter" x="0%" y="0%" width="200%" height="200%">
			<feTurbulence type="fractalNoise" baseFrequency="0.001 0.001" numOctaves="4" seed="{Math.trunc(Date.now() / 1000000)}" result="noise" />
			<feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
			<feDisplacementMap in="SourceGraphic" in2="blurred" scale="20" xChannelSelector="R" yChannelSelector="G" />
		</filter>
		<filter id="svt-glass-button-morph-filter" color-interpolation-filters="linearRGB" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
			<feMorphology operator="dilate" radius="1 1" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" result="morphology" />
			<!--suppress HtmlUnknownAttribute - edgeMode is a legal attribute for feGaussianBlur, but is giving an error, hence the suppression -->
			<feGaussianBlur stdDeviation="0 1" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur" />
		</filter>
		<filter id="svt-glass-button-blur-filter" color-interpolation-filters="linearRGB" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse">
			<!--suppress HtmlUnknownAttribute - edgeMode is a legal attribute for feGaussianBlur, but is giving an error, hence the suppression -->
			<feGaussianBlur stdDeviation="1 1" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" edgeMode="none" result="blur" />
		</filter>
	</defs>
</svg>

<div class="{theme} svt-glass-button-parent {className}">
	<div inert>
		<div class="svt-glass-button effect-a"></div>
		<div class="svt-glass-button effect-b"></div>
		<div class="svt-glass-button effect-c">
			<div class="effect-d"></div>
		</div>
		<div class="svt-glass-button effect-e"></div>
		<div class="svt-glass-button effect-f">
			<div class="effect-g"></div>
		</div>
		{#if !prefersReducedMotion.current}
			<div class="svt-glass-button effect-h" style="mask-image:linear-gradient({(scrollY - 180) / 8}deg, transparent 0%, transparent 65%, black 100%);mask-type:alpha;">
				<div class="effect-i" style="filter:hue-rotate({scrollY / 2}deg);"></div>
			</div>
		{/if}
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
		
		&.hide {
			opacity: 0;
			pointer-events: none;
		}
		
		:global(*) {
			z-index:    999 !important;
		}
		
		.svt-glass-button {
			position: absolute;
			width:    100%;
			height:   100%;
			top: inherit;
			left: inherit;
			right: inherit;
			bottom: inherit;
			
			z-index:       999 !important;
			border-radius: .9rem;
		}
		
		.effect-a {
			
			overflow:        visible !important;
			
			mask-image:      linear-gradient(to top, transparent 80%, black 96%), linear-gradient(to bottom, transparent 80%, black 96%),
			                 linear-gradient(to left, transparent 88.5%, black 100%), linear-gradient(to right, transparent 88.5%, black 100%),
			                 radial-gradient(ellipse 87.5% 100% at 25%, transparent 80%, black 90%, black 100%),
			                 radial-gradient(ellipse 87.5% 100% at 75%, transparent 80%, black 90%, black 100%);
			mask-type:       alpha;
			backdrop-filter: url('#svt-glass-button-distortion-filter') url('#svt-glass-button-morph-filter') saturate(1.5) brightness(1.2) blur(1px) url('#svt-glass-button-distortion-filter');
			
			z-index:         997 !important;
		}
		
		.effect-b {
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
			
			background-color: #FFFFFF11;
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
		
		.effect-h {
			display: none;
			overflow:       visible !important;
			mix-blend-mode: soft-light;
			
			z-index:        992 !important;
			
			.effect-i {
				overflow:         inherit;
				position:         inherit;
				width:            inherit;
				height:           inherit;
				border-radius:    inherit;
				mix-blend-mode: soft-light;
				
				mask-image:       linear-gradient(to top, transparent 80%, black 96%), linear-gradient(to bottom, transparent 80%, black 96%),
				                  linear-gradient(to left, transparent 92.5%, black 100%), linear-gradient(to right, transparent 90.5%, black 100%),
				                  radial-gradient(ellipse 87.5% 100% at 18.5%, transparent 85%, black 97.5%, black 100%),
				                  radial-gradient(ellipse 87.5% 100% at 82.5%, transparent 85%, black 97.5%, black 100%);
				
				filter:           blur(2px);
				background-image: linear-gradient(160deg, #00000033 0%, transparent 50%), linear-gradient(-25deg, #ECF0F355 0%, transparent 50%);
				
				z-index:          993 !important;
			}
		}
		
		&.dark {
			.effect-c {
				mask-image:     linear-gradient(0deg, black 0%, transparent 35%, transparent 65%, black 100%), linear-gradient(15deg, black 0%, transparent 35%, transparent 100%);
				mix-blend-mode: lighten;
				
				.effect-d {
					border: .15rem solid #FFFFFFAA;
				}
			}
			
			.effect-g {
				border-color: #000000AA;
			}
		}
	}
</style>