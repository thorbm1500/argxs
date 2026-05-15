<script lang="ts">
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import HeaderBurgerMenuComponent from '$lib/components/HeaderBurgerMenuComponent.svelte';
	
	let { theme = $bindable(), sidebarState = $bindable() } = $props();
	
	/*For future use
	let saveData: boolean = $state(false);
	
	onMount(() => {
		setInterval(() => {
			if (!navigator) return;
			saveData = navigator?.connection.saveData ?? false;
		}, 500);
	});*/
</script>

<section class="header-section {theme}">
	<div class="content">
		<a href="/" class="argxs">
			argxs
		</a>
		<div class="actions">
			<ThemeSwitcher bind:theme />
			<div class="phone-action">
				<HeaderBurgerMenuComponent bind:sidebarState />
			</div>
		</div>
	</div>
</section>
<div class="header-blur-effect"></div>
<svg style="display: none;">
	<filter id="header-glass-distortion" x="0%" y="0%" width="100%" height="100%">
		<feTurbulence type="fractalNoise" baseFrequency="0.001 0.001" numOctaves="5" seed="{Math.trunc((Date.now() / 1000) / 1000)}" result="noise" />
		<feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
		<feDisplacementMap in="SourceGraphic" in2="blurred" scale="30" xChannelSelector="R" yChannelSelector="G" />
	</filter>
</svg>
<div class="header-glass-blur-effect"></div>
<div class="header-glass-edge-blur-effect top"></div>
<div class="header-glass-edge-blur-effect bottom"></div>
<!--<div class="save-data-bar {saveData ? 'visible' : 'hidden'}">Reduced Data Usage Enabled</div>-->

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
	
	/*.save-data-bar {
		position:        absolute;
		top:             var(--header-height);
		height:          1.75rem;
		width:           100vw;
		background:      var(--theme-color-alert);
		
		color:           var(--theme-ui-white);
		font-size:       .85rem;
		font-weight:     700;
		
		display:         flex;
		align-items:     center;
		justify-content: center;
		
		pointer-events:  none !important;
		
		z-index:         99998;
		
		&.visible {
			opacity: 1;
		}
		
		&.hidden {
			opacity: 0;
		}
	}*/
	
	.header-blur-effect {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: var(--header-height);
		
		backdrop-filter: blur(2px) brightness(1.25);
		mask-image: linear-gradient(to top, transparent 0%, black 60%);
		z-index: 99990 !important;
	}
	
	.header-glass-blur-effect {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: var(--header-height);
		
		filter: brightness(1.15);
		backdrop-filter: blur(1px) url('#header-glass-distortion');
		mask-image: linear-gradient(to top, transparent 0%, black 60%);
		z-index: 99990 !important;
	}
	
	.header-glass-edge-blur-effect {
		position: absolute;
		left: 0;
		width: 100vw;
		height: calc(var(--header-height) / 4);
		
		&.bottom {
			top: calc((var(--header-height) / 4) * 3);
			mask-image: linear-gradient(to bottom, transparent 0%, black 75%);
			backdrop-filter: blur(1px) url('#header-glass-distortion') saturate(1.5) brightness(1.05) blur(1px);
			filter: brightness(1.05);
			z-index: 99999 !important;
		}
		&.top {
			top: -3px;
			mask-image: linear-gradient(to top, transparent 0%, black 75%);
			backdrop-filter: blur(1px) url('#header-glass-distortion') saturate(1.5) brightness(1.2);
			z-index: 99999 !important;
		}
	}
	
	.header-section {
		position:        fixed;
		top:             0;
		left:            0;
		
		height:          var(--header-height);
		width:           100vw;
		overflow:        hidden;
		
		display:         flex;
		flex-flow:       row nowrap;
		align-items:     center;
		justify-content: center;
		
		border-bottom:   1px solid rgba(from var(--theme-ui-line) r g b / .5);
		background:      rgba(from var(--theme-ui-header) r g b / .5);
		backdrop-filter: blur(2px) grayscale(.2) brightness(.95);
		
		user-select:     none;
		
		z-index:         999999 !important;
		
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