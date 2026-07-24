<script lang="ts">
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import HeaderBurgerMenuComponent from '$lib/components/HeaderBurgerMenuComponent.svelte';
	
	let { theme = $bindable(), pageState = $bindable(), sidebarState = $bindable() } = $props();
	
	const seed = Math.trunc(Date.now() / 1000000);
</script>

<div id="header-light" class={{active: pageState}} inert>
	<div id="header-light-mask">
		<div id="light"></div>
	</div>
</div>

<div style="display:none;position:fixed;" inert>
	<svg>
		<defs>
			<filter id="header-bottom-glass-edge-distortion" x="0%" y="0%" width="100%" height="100%">
				<feTurbulence type="fractalNoise" baseFrequency="0.001 0.001" numOctaves="1" seed="{seed}" result="noise" />
				<feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
				<feDisplacementMap in="SourceGraphic" in2="blurred" scale="-50" xChannelSelector="R" yChannelSelector="G" result="displace" />
				<feDisplacementMap in="SourceGraphic" in2="blurred" scale="50" xChannelSelector="R" yChannelSelector="G" result="displace2" />
				<!--suppress HtmlUnknownAttribute - Suppressing incorrect warnings for unknown attribute -->
				<feGaussianBlur stdDeviation="1.2 1.75" x="0%" y="0%" width="100%" height="100%" in="displace" edgeMode="wrap" />
			</filter>
			<filter id="header-glass-distortion" x="0%" y="0%" width="100%" height="100%">
				<feMorphology operator="dilate" radius="1 1" x="0%" y="0%" width="100%" height="100%" in="SourceGraphic" result="blur" />
				<!--suppress HtmlUnknownAttribute - Suppressing incorrect warnings for unknown attribute -->
				<feGaussianBlur stdDeviation=".75 0.5" x="0%" y="0%" width="100%" height="100%" in="blur" edgeMode="none" result="blur2" />
				<feTurbulence type="fractalNoise" baseFrequency="0.010" numOctaves="32" seed="{seed}" stitchTiles="stitch" result="noise" />
				<feGaussianBlur in="offset" stdDeviation="2" result="blurred" />
				<feDisplacementMap in="blur2" in2="blurred" scale="4" xChannelSelector="R" yChannelSelector="B" result="displace" />
			</filter>
		</defs>
	</svg>
</div>

<div class="{theme} header-effect a" inert></div>
<div class="{theme} header-effect b" inert></div>
<div class="{theme} header-effect c" inert></div>
<div class="{theme} header-effect d" inert></div>

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
<div class="{theme} header-lightbar"></div>

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
	
	@keyframes HeaderLightbarAnimation {
		0%,35%,65%,100% {
			filter: brightness(.35);
		}
		40% {
			left: 0;
		}
		45%,55% {
			filter: brightness(1);
		}
		60% {
			left: -100vw;
		}
	}
	
	.dark.header-lightbar {
		background-image: radial-gradient(circle at 10% 20%, rgb(218 149 252) 10%, rgb(138 217 255) 20%, rgb(140 253 170) 40%, rgb(245 255 166) 52.5%, rgb(250, 227, 189) 60%, rgb(248, 172, 172) 70%,
		rgb(254, 211, 252) 80%, rgb(222, 168, 248) 90%) !important;
	}
	
	.header-lightbar {
		position: fixed;
		
		top: 0;
		
		height: 2px;
		width: 200vw;
		opacity: 1;
		
		background-image: radial-gradient(circle at 10% 20%, rgb(181 102 255) 10%, rgb(62 175 229) 20%, rgb(45 208 51) 40%, rgb(224 196 16) 52.5%, rgb(255 143 28) 60%, rgb(222 70 70) 70%,
		rgb(255 123 249) 80%, rgb(181 102 255) 90%);
		background-repeat: repeat;
		background-size: 100vw;
		
		animation: HeaderLightbarAnimation 30s linear infinite !important;
		
		z-index:          1000000 !important;
	}
	
	.header-section, .header-effect {
		position: fixed !important;
		top:      2px;
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
		
		border-bottom:    1px solid rgba(from var(--theme-ui-line-highlight) r g b / 1);
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
		.dark&.a {
			backdrop-filter: url('#header-bottom-glass-edge-distortion') brightness(1.35) saturate(1.5);
		}
		
		&.a {
			mask-type: alpha;
			mask-image:      linear-gradient(to bottom, black 0%, black 7.5%, transparent 30%, transparent 100%), linear-gradient(to right, black 0%, transparent .75%, transparent 100%);
			backdrop-filter: url('#header-bottom-glass-edge-distortion') saturate(1.3);
			
			transform: rotate(180deg);
			padding:   1px 0;
			
			z-index:   999990 !important;
		}
		
		.dark&.b {
			display: initial;
			backdrop-filter: brightness(1.05) url('#header-glass-distortion') saturate(1.15);
		}
		
		&.b {
			backdrop-filter: brightness(.975) saturate(1.15);
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
	
	/* Navigation Light effect */
	@media (width >= 44rem) {
		#header-light, #header-light #header-light-mask {
			position: fixed;
		}
		
		#header-light {
			top:            calc(var(--header-height) - 2px);
			left:           0;
			
			z-index:        999989 !important;
			
			#header-light-mask, #light {
				animation-timing-function: ease-out;
			}
			
			#header-light-mask {
				filter:        saturate(1.5);
				mask-image:    linear-gradient(90deg, black 30%, white 50%, black 70%);
				mask-mode:     luminance;
				
				width:         40vw;
				transform:     translateX(-10vw);
				opacity:       0;
				height:        8px;
				
				#light {
					justify-self:      center;
					height:            2px !important;
					width:             30vw;
					filter:            saturate(1.2) contrast(1.05);
					background-repeat: repeat-x;
					background-image:  linear-gradient(90deg, rgb(222, 168, 248) 0%, rgb(168, 222, 248) 21.8%, rgb(189, 250, 205) 35.6%, rgb(243, 250, 189) 52.9%, rgb(250, 227, 189) 66.8%, rgb(248,
					172, 172) 90%, rgb(254, 211, 252) 99.7%);
					
					z-index:           999989 !important;
				}
			}
		}
		
		#header-light.active #header-light-mask {
			animation: headerNavMaskAnimation 3.5s;
			animation-delay: 500ms;
			
			#light {
				animation:                 headerNavLightAnimation 3.5s;
				animation-delay:           500ms;
			}
		}
		
		#header-light {
			#header-light-mask, #header-light-mask #light {
				animation: none;
			}
		}
		
		@keyframes headerNavMaskAnimation {
			0% {
				width:     40vw;
				transform: translateX(-20vw);
			}
			50% {
				width: 70vw;
			}
			100% {
				width:     40vw;
				transform: translateX(110vw);
			}
			0%, 100% {
				opacity: 0;
			}
			3.5%, 96.5% {
				opacity: 1;
			}
		}
		
		@keyframes headerNavLightAnimation {
			0% {
				width:                 30vw !important;
				background-position-x: 115vw;
			}
			10% {
				background-position-x: 100vw;
			}
			50% {
				width: 60vw !important;
			}
			100% {
				width:                 30vw !important;
				background-position-x: -15vw;
			}
		}
	}
</style>