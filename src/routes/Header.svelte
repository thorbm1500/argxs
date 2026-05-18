<script lang="ts">
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import HeaderBurgerMenuComponent from '$lib/components/HeaderBurgerMenuComponent.svelte';
	import { innerHeight } from 'svelte/reactivity/window';
	
	let { theme = $bindable(), sidebarState = $bindable(), scrollY = $bindable() } = $props();
	const seed = Math.trunc(Date.now() / 1000000);
</script>

<div style="display:none;position:fixed;" inert>
	<svg>
		<defs>
			<filter id="header-bottom-glass-edge-distortion" x="0%" y="0%" width="100%" height="100%">
				<feTurbulence type="fractalNoise" baseFrequency="0.001 0.001" numOctaves="1" seed="{seed}" result="noise" />
				<feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
				<feDisplacementMap in="SourceGraphic" in2="blurred" scale="-50" xChannelSelector="R" yChannelSelector="G" result="displace" />
				<feDisplacementMap in="SourceGraphic" in2="blurred" scale="50" xChannelSelector="R" yChannelSelector="G" result="displace2" />
				<feGaussianBlur stdDeviation="1.2 1.75" x="0%" y="0%" width="100%" height="100%" in="displace" edgeMode="wrap" />
			</filter>
			<filter id="header-glass-distortion" x="0%" y="0%" width="100%" height="100%">
				<feMorphology operator="dilate" radius="1 1" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" result="blur" />
				<feGaussianBlur stdDeviation=".75 0.5" x="0%" y="0%" width="100%" height="100%" in="blur" edgeMode="none" result="blur2" />
				<feTurbulence type="fractalNoise" baseFrequency="0.010" numOctaves="32" seed="{seed}" stitchTiles="stitch" result="noise" />
				<feGaussianBlur in="offset" stdDeviation="2" result="blurred" />
				<feDisplacementMap in="blur2" in2="blurred" scale="4" xChannelSelector="R" yChannelSelector="B" result="displace" />
			</filter>
		</defs>
	</svg>
</div>

<div class="header-effect a" inert></div>
<div class="header-effect b" inert></div>
<div class="header-effect c" inert></div>
<div class="header-effect d" inert></div>

<section class="header-section {theme}">
	<div class="content">
		<a href="/" class="argxs" tabindex="-1">
			argxs
		</a>
		<div class="actions">
			<ThemeSwitcher bind:theme />
			<div class="phone-action" tabindex="-1">
				<HeaderBurgerMenuComponent bind:sidebarState />
			</div>
		</div>
	</div>
</section>

<style>
	/* Desktop & Tablet */
	@media (width >= 44rem) {
		:root :global {
			--header-height: 3rem;
		}
		
		.header-section {
			.content {
				width: 95vw;
				
				.actions {
					gap: 1rem;
					
					.phone-action {
						visibility: hidden;
					}
				}
			}
		}
	}
	
	/* Phone */
	@media (width < 44rem) {
		:root :global {
			--header-height: 3.5rem;
		}
		
		.header-section {
			.content {
				width: 90vw;
				
				.actions {
					gap: 0.75rem;
					
					.phone-action {
						visibility: visible;
					}
				}
			}
			
			&::after {
				position:         fixed;
				width:            100vw;
				height:           2.85rem;
				top:              calc(var(--header-height) + 3.5rem);
				left:             0;
				padding:          .25rem .5rem;
				background-image: linear-gradient(to bottom, var(--theme-ui-header) 0%, rgba(from var(--theme-ui-header) r g b / .25) 100%);
				color:            var(--theme-text-primary);
				text-justify:     inter-character;
				text-align:       center;
				
				content:          'This site is not optimized for mobile usage. Visit on Desktop for the full experience.';
				font-size:        .85rem;
				font-weight:      600;
				
				opacity:          .65;
				
				z-index:          9999999 !important;
			}
		}
	}
	
	.header-section, .header-effect {
		position: fixed !important;
		top:      0;
		left:     0;
		
		height:   var(--header-height);
		width:    100vw;
		overflow: hidden;
	}
	
	.header-section {
		display:          flex;
		flex-flow:        row nowrap;
		align-items:      center;
		justify-content:  center;
		
		border-bottom:    1px solid rgba(from var(--theme-ui-line-highlight) r g b / .15);
		background-image: linear-gradient(to top, rgba(from var(--theme-ui-header) r g b / .1) 0%, rgba(from var(--theme-ui-header) r g b / .4) 25%, rgba(from var(--theme-ui-header) r g b / .85)
		50%, var(--theme-ui-header) 100%), linear-gradient(to left, rgba(from var(--theme-ui-header) r g b / .95) 0%, transparent 5%, transparent 95%, rgba(from var(--theme-ui-header) r g b / .95) 100%);
		backdrop-filter:  brightness(.9) grayscale(.25) blur(1px);
		
		user-select:      none;
		
		z-index:          999999 !important;
		
		.content {
			display:         flex;
			flex-flow:       row nowrap;
			align-items:     center;
			justify-content: space-between;
			
			.actions {
				display:         flex;
				flex-flow:       row nowrap;
				align-items:     center;
				justify-content: space-between;
			}
			
			.argxs {
				font-size:         1.35rem;
				font-weight:       600;
				font-family:       'Lexend Variable', sans-serif;
				
				color:             transparent;
				background-clip:   text;
				
				padding:           1.5rem;
				
				background-repeat: no-repeat;
				background-color:  var(--theme-text-primary);
				
				animation:         argxsAnim 12s infinite;
			}
			
			.argxs::before {
				position:          absolute;
				
				filter:            blur(.3rem);
				opacity:           .8;
				content:           'argxs';
				
				font-size:         1.35rem;
				font-weight:       600;
				font-family:       'Lexend Variable', sans-serif;
				
				color:             transparent;
				background-clip:   text;
				
				padding:           1.5rem;
				
				background-repeat: no-repeat;
				background-color:  transparent;
				
				animation:         argxsAnim 12s infinite;
			}
			
			a {
				display:         flex;
				flex-flow:       row nowrap;
				align-items:     center;
				justify-content: center;
				gap:             0.1rem;
				
				font-size:       0.91rem;
				font-weight:     500;
				color:           var(--theme-text-third);
			}
			
			a:hover {
				color: var(--theme-text-primary);
			}
		}
	}
	
	.header-effect {
		&.a {
			mask-type: luminance;
			mask-image:      linear-gradient(to bottom, black 0%, black 7.5%, transparent 30%, transparent 100%), linear-gradient(to right, black 0%, transparent .75%, transparent 100%);
			backdrop-filter: url('#header-bottom-glass-edge-distortion') brightness(1.35) saturate(1.5);
			
			transform: rotate(180deg);
			padding:   1px 0;
			
			z-index:   999990 !important;
		}
		
		&.b {
			backdrop-filter: brightness(1.05) url('#header-glass-distortion') saturate(1.15);
			z-index:         999991 !important;
		}
		
		&.c {
			mask-image: linear-gradient(to bottom, transparent 25%, black 100%);
			backdrop-filter: blur(4px);
			z-index:         999992 !important;
		}
		
		&.d {
			mask-image: linear-gradient(to top, transparent 0%, transparent 40%, black 90%, black 100%);
			backdrop-filter: blur(2px) blur(1px) brightness(1.15);
			z-index:         999993 !important;
		}
	}
	
	@keyframes argxsAnim {
		0%, 5%, 100% {
			background-position: -6rem 0;
		}
		18%, 29%, 30% {
			background-position: 6rem 0;
		}
		0%, 25%, 100% {
			background-image: radial-gradient(circle at 35% 45%, transparent 0%);
		}
		5%, 15%, 20% {
			transition-timing-function: cubic-bezier(0.860, 0.000, 0.070, 1.050);
			background-image:           radial-gradient(circle at 35% 45%, transparent 0%, rgb(222, 168, 248) 5%, rgb(168, 222, 248) 15.8%, rgb(189, 250, 205) 23.6%, rgb(243, 250, 189) 35%, transparent 50%, rgb(250, 227, 189) 65%, rgb(248, 172, 172) 70%, rgb(254, 211, 252) 80%, transparent 100%);
		}
	}
</style>