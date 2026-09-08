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
		<div style="position: fixed; width: 100%; height: 100%; display: flex; align-items: center; filter: blur(.3rem); opacity: .8;" inert>
			<div class="argxs fx" inert>
				<svg fill="none" width="100%" height="100%" viewBox="0 0 1025 354">
					<rect x="0" y="0" width="1025" height="354"/>
				</svg>
			</div>
		</div>
		<a href="/" class="argxs" title="" tabindex="-1">
			<svg id="https://argxs.com" fill="currentColor" width="100%" height="100%" viewBox="0 0 1025 354">
				<rect x="0" y="0" width="1025" height="354" fill="none"/>
				<path d="M73.7,276.6c-23,0-41-5.5-53.9-16.5C7,249.2.5,234.5.5,216.2s6.8-33.6,20.3-44c13.5-10.3,32.9-15.5,58-15.5h51.5v-7c0-17.5-11.1-26.2-33.3-26.2s-31.6,6.6-35.8,19.8H3.1c4.5-21.8,14.6-38.2,30.4-49.2,15.8-11.1,36.9-16.6,63.3-16.6s51.5,6.5,66.8,19.4c15.3,12.9,23,31.7,23,56.4v62.4h27.5v57.6h-58.8v-32h-13.4c-6.6,11.5-15.3,20.3-26.2,26.4s-24.8,9.1-41.9,9.1h0s0,0,0,0ZM82.7,232.5c9.4,0,17.6-1.6,24.8-4.8s12.7-7.6,16.8-13.1c4-5.5,6.1-11.7,6.1-18.6v-1h-48.9c-16.4,0-24.6,6.1-24.6,18.2s2.3,10.9,6.9,14.2c4.6,3.3,10.9,5,19,5h0,0Z"/>
				<path d="M251.9,273.1v-134.3h-28.8v-57.6h58.8v38.4h13.4c4.9-13.8,12.9-24.1,24-30.9,11.1-6.7,23.4-10.1,37.1-10.1h16.3v51.2h-18.9c-15.8,0-27.1,4.4-34.1,13.1-6.9,8.8-10.4,20.2-10.4,34.2v95.9h-57.6s0,0,0,0Z"/>
				<path d="M485.6,353.7c-29.6,0-53.7-5.9-72.1-17.7s-29.4-28.3-32.8-49.4h62c4.9,14.1,18.4,21.1,40.6,21.1s27.4-3.5,35.7-10.6c8.2-7,12.3-17.1,12.3-30.1v-24h-1.6c-6,10-13.8,17.5-23.5,22.5-9.7,5-21.5,7.5-35.3,7.5s-33.5-4-46.8-12-23.7-19.4-31-34.1c-7.4-14.7-11-32-11-51.8,0-29.8,8.3-53.6,24.8-71.3,16.5-17.7,39.4-26.5,68.6-26.5s30.1,3.1,41.7,9.4c11.6,6.3,20.8,15.1,27.7,26.4h13.4v-32h58.8v57.6h-28.8v128.2c0,27.7-8.9,49.1-26.5,64.1-17.7,15-43.1,22.5-76.1,22.5h0s0,0,0,0ZM485.6,221.9c13.8,0,24.6-3.7,32.3-11.2,7.7-7.5,11.5-17.8,11.5-31v-9.6c0-13-3.9-23.2-11.7-30.5s-18.5-11-32.1-11-25.3,4.1-33.1,12.3c-7.8,8.2-11.7,19.8-11.7,34.7s3.9,26.4,11.7,34.4c7.8,8,18.8,12,33.1,12h0Z"/>
				<path d="M622.8,273.1l74.5-98.2-70.7-93.7h65.9l38.1,51.8,38.7-51.8h65.2l-70.3,93.7,74.2,98.2h-65.6l-42.2-57.2-42.5,57.2h-65.3s0,0,0,0Z"/>
				<path d="M938.1,276.9c-28.8,0-51.4-6.1-68-18.2-16.5-12.2-25.4-29.1-26.7-50.8h56.6c1.7,8.5,5.8,14.8,12.3,18.9,6.5,4.1,15.9,6.1,28.3,6.1,19.2,0,28.8-5,28.8-15s-1.4-7.3-4.3-9.8-7.6-4.3-14.2-5.6l-42.9-8.3c-39.2-7.7-58.8-26-58.8-55s7.6-33.7,22.7-44.9c15.1-11.2,36-16.8,62.7-16.8s47.6,5.8,63,17.3c15.3,11.5,23.7,27.7,24.9,48.6h-56.6c-2.1-8.3-5.9-14.3-11.4-18.1s-13.4-5.6-23.8-5.6-15.1,1.2-19.7,3.5c-4.6,2.3-6.9,5.9-6.9,10.6s1.4,6.3,4.2,8.6,6.9,4.1,12.5,5.1l44.1,8.6c20.5,4.1,35.5,10.7,45.1,19.8,9.6,9.2,14.4,21.5,14.4,37.1s-7.4,35.7-22.2,47c-14.8,11.3-36.2,16.9-64.1,16.9h0Z"/>
			</svg>
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
        }
    }

    @keyframes HeaderLightbarAnimation {
				from {
						left: 0;
				}
				to {
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

        animation: HeaderLightbarAnimation 3s linear infinite !important;

        z-index: 1000000 !important;
    }

    .header-section, .header-effect {
        position: fixed !important;
        top: 2px;
        left: 0;

        height: var(--header-height);
        width: 100vw;
        overflow: hidden;
    }

    .header-section {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: center;

        border-bottom: 1px solid rgba(from var(--theme-ui-line-highlight) r g b / 1);
        background-image: linear-gradient(to top, rgba(from var(--theme-ui-header) r g b / .1) 0%, rgba(from var(--theme-ui-header) r g b / .4) 25%, rgba(from var(--theme-ui-header) r g b / .85) 50%, var(--theme-ui-header) 100%), linear-gradient(to left, rgba(from var(--theme-ui-header) r g b / .95) 0%, transparent 5%, transparent 95%, rgba(from var(--theme-ui-header) r g b / .95) 100%);
        backdrop-filter: brightness(.9) grayscale(.25) blur(1px);

        user-select: none;

        z-index: 999999 !important;

        .content {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            justify-content: space-between;

            .actions {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: space-between;
            }

            .argxs {
                height: 1.5rem;
                width: fit-content;
								margin-left: 1.3rem;
								padding: 0 .2rem;
            }

            .argxs.fx {
                position: inherit;
                mask-image: url('$lib/argxs-logo-mask.svg');
								opacity: 0;
                animation: logoLightAnimation 20s infinite;
            }

            a {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: center;
                gap: 0.1rem;

                font-size: 0.91rem;
                font-weight: 500;
                color: var(--theme-text-third);
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
            mask-image: linear-gradient(to bottom, black 0%, black 7.5%, transparent 30%, transparent 100%), linear-gradient(to right, black 0%, transparent .75%, transparent 100%);
            backdrop-filter: url('#header-bottom-glass-edge-distortion') saturate(1.3);

            transform: rotate(180deg);
            padding: 1px 0;

            z-index: 999990 !important;
        }

        .dark&.b {
            display: initial;
            backdrop-filter: brightness(1.05) url('#header-glass-distortion') saturate(1.15);
        }

        &.b {
            backdrop-filter: brightness(.975) saturate(1.15);
            z-index: 999991 !important;
        }

        &.c {
            mask-image: linear-gradient(to bottom, transparent 25%, black 100%);
            backdrop-filter: blur(4px);
            z-index: 999992 !important;
        }

        &.d {
            mask-image: linear-gradient(to top, transparent 0%, transparent 40%, black 90%, black 100%);
            backdrop-filter: blur(2px) blur(1px) brightness(1.15);
            z-index: 999993 !important;
        }
    }

    /* Navigation Light effect */
    @media (width >= 44rem) {
        #header-light, #header-light #header-light-mask {
            position: fixed;
        }

        #header-light {
            top: calc(var(--header-height) - 2px);
            left: 0;

            z-index: 999989 !important;

            #header-light-mask, #light {
                animation-timing-function: ease-out;
            }

            #header-light-mask {
                filter: saturate(1.5);
                mask-image: linear-gradient(90deg, black 30%, white 50%, black 70%);
                mask-mode: luminance;

                width: 40vw;
                transform: translateX(-10vw);
                opacity: 0;
                height: 8px;

                #light {
                    justify-self: center;
                    height: 2px !important;
                    width: 30vw;
                    filter: saturate(1.2) contrast(1.05);
                    background-repeat: repeat-x;
                    background-image: linear-gradient(90deg, rgb(222, 168, 248) 0%, rgb(168, 222, 248) 21.8%, rgb(189, 250, 205) 35.6%, rgb(243, 250, 189) 52.9%, rgb(250, 227, 189) 66.8%, rgb(248,
                    172, 172) 90%, rgb(254, 211, 252) 99.7%);

                    z-index: 999989 !important;
                }
            }
        }

        #header-light.active #header-light-mask {
            animation: headerNavMaskAnimation 3.5s;
            animation-delay: 500ms;

            #light {
                animation: headerNavLightAnimation 3.5s;
                animation-delay: 500ms;
            }
        }

        #header-light {
            #header-light-mask, #header-light-mask #light {
                animation: none;
            }
        }

        @keyframes headerNavMaskAnimation {
            0% {
                width: 40vw;
                transform: translateX(-20vw);
            }
            50% {
                width: 70vw;
            }
            100% {
                width: 40vw;
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
                width: 30vw !important;
                background-position-x: 115vw;
            }
            10% {
                background-position-x: 100vw;
            }
            50% {
                width: 60vw !important;
            }
            100% {
                width: 30vw !important;
                background-position-x: -15vw;
            }
        }
    }

    @keyframes logoLightAnimation {
        from, to {
            transition-timing-function: cubic-bezier(0.860, 0.000, 0.070, 1.050);
            background-image: radial-gradient(circle at 35% 45%, transparent 0%, rgb(222, 168, 248) 5%, rgb(168, 222, 248) 15.8%, rgb(189, 250, 205) 23.6%, rgb(243, 250, 189) 35%, transparent 50%, rgb(250, 227, 189) 65%, rgb(248, 172, 172) 70%, rgb(254, 211, 252) 80%, transparent 100%);
        }
        0%, 5%, 100% {
            background-position: -10rem 0;
        }
        30%, 42.5% {
            background-position: 10rem 0;
        }
        50% {
            background-position: 11rem 0;
        }
        4%, 37% {
            opacity: 0;
        }
        10%, 20% {
            opacity: 1;
        }
    }
</style>