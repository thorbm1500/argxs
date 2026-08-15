<script lang="ts">
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';
	
	const { data } = $props();
	
	let coords = new Spring({ x: 0, y: 0 }, {
		stiffness: 0.085,
		damping: 0.175
	});
	
	const minX = -1.1;
	const maxX = 1.1;
	const minY = -0.7;
	const maxY = 0.7;
	
	let deg: number = $state(0.0);
	
	onMount(() => {
		if (!document) return;
		document.addEventListener('mousemove', (event) => {
			coords.target = { x: event.x, y: event.y };
		});
		
		let turnLeft: boolean = false;
		const initialStepCount = 1.5;
		let stepCount: number = initialStepCount;
		
		setInterval(() => {
			if (turnLeft) {
				if (deg < -15.0) {
					deg = -15.0;
					turnLeft = false;
					stepCount = initialStepCount;
				}
			} else {
				if (deg > 15.0) {
					deg = 15.0;
					turnLeft = true;
					stepCount = initialStepCount;
				}
			}
			
			const diff = 0.005 * Math.pow(12, Math.max(0.8, stepCount));
			if (turnLeft) {
				deg -= diff;
			} else {
				deg += diff;
			}
			
			stepCount -= 0.00225;
		}, 10);
	});
	
	onMount(() => {
		if (!window) return;
		coords.target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
	});
</script>

<svelte:head>
	<title>{data.seo.title}</title>
	{#if data.seo.description}
		<meta name="description" content={data.seo.description} />
	{/if}
</svelte:head>

<section class="home-page-sec">
	<div
		style="transform-style: preserve-3d; transform: translateY({Math.max(minY, Math.min(maxY, (coords.current.y / 750) - .6)) - 3}rem) translateX({Math.max(minX, Math.min(maxX,(coords.current.x /
		 750) - 1.1))}rem) rotate3d(-1,0,0, -15deg) rotate3d(0,1,0, {$state.eager(deg)}deg)">
		<div class="title">
			<svg id="https://argxs.com" fill="currentColor" width="100%" height="100%" viewBox="0 0 1025 354">
				<rect x="0" y="0" width="1025" height="354" fill="none"/>
				<path d="M73.7,276.6c-23,0-41-5.5-53.9-16.5C7,249.2.5,234.5.5,216.2s6.8-33.6,20.3-44c13.5-10.3,32.9-15.5,58-15.5h51.5v-7c0-17.5-11.1-26.2-33.3-26.2s-31.6,6.6-35.8,19.8H3.1c4.5-21.8,14.6-38.2,30.4-49.2,15.8-11.1,36.9-16.6,63.3-16.6s51.5,6.5,66.8,19.4c15.3,12.9,23,31.7,23,56.4v62.4h27.5v57.6h-58.8v-32h-13.4c-6.6,11.5-15.3,20.3-26.2,26.4s-24.8,9.1-41.9,9.1h0s0,0,0,0ZM82.7,232.5c9.4,0,17.6-1.6,24.8-4.8s12.7-7.6,16.8-13.1c4-5.5,6.1-11.7,6.1-18.6v-1h-48.9c-16.4,0-24.6,6.1-24.6,18.2s2.3,10.9,6.9,14.2c4.6,3.3,10.9,5,19,5h0,0Z"/>
				<path d="M251.9,273.1v-134.3h-28.8v-57.6h58.8v38.4h13.4c4.9-13.8,12.9-24.1,24-30.9,11.1-6.7,23.4-10.1,37.1-10.1h16.3v51.2h-18.9c-15.8,0-27.1,4.4-34.1,13.1-6.9,8.8-10.4,20.2-10.4,34.2v95.9h-57.6s0,0,0,0Z"/>
				<path d="M485.6,353.7c-29.6,0-53.7-5.9-72.1-17.7s-29.4-28.3-32.8-49.4h62c4.9,14.1,18.4,21.1,40.6,21.1s27.4-3.5,35.7-10.6c8.2-7,12.3-17.1,12.3-30.1v-24h-1.6c-6,10-13.8,17.5-23.5,22.5-9.7,5-21.5,7.5-35.3,7.5s-33.5-4-46.8-12-23.7-19.4-31-34.1c-7.4-14.7-11-32-11-51.8,0-29.8,8.3-53.6,24.8-71.3,16.5-17.7,39.4-26.5,68.6-26.5s30.1,3.1,41.7,9.4c11.6,6.3,20.8,15.1,27.7,26.4h13.4v-32h58.8v57.6h-28.8v128.2c0,27.7-8.9,49.1-26.5,64.1-17.7,15-43.1,22.5-76.1,22.5h0s0,0,0,0ZM485.6,221.9c13.8,0,24.6-3.7,32.3-11.2,7.7-7.5,11.5-17.8,11.5-31v-9.6c0-13-3.9-23.2-11.7-30.5s-18.5-11-32.1-11-25.3,4.1-33.1,12.3c-7.8,8.2-11.7,19.8-11.7,34.7s3.9,26.4,11.7,34.4c7.8,8,18.8,12,33.1,12h0Z"/>
				<path d="M622.8,273.1l74.5-98.2-70.7-93.7h65.9l38.1,51.8,38.7-51.8h65.2l-70.3,93.7,74.2,98.2h-65.6l-42.2-57.2-42.5,57.2h-65.3s0,0,0,0Z"/>
				<path d="M938.1,276.9c-28.8,0-51.4-6.1-68-18.2-16.5-12.2-25.4-29.1-26.7-50.8h56.6c1.7,8.5,5.8,14.8,12.3,18.9,6.5,4.1,15.9,6.1,28.3,6.1,19.2,0,28.8-5,28.8-15s-1.4-7.3-4.3-9.8-7.6-4.3-14.2-5.6l-42.9-8.3c-39.2-7.7-58.8-26-58.8-55s7.6-33.7,22.7-44.9c15.1-11.2,36-16.8,62.7-16.8s47.6,5.8,63,17.3c15.3,11.5,23.7,27.7,24.9,48.6h-56.6c-2.1-8.3-5.9-14.3-11.4-18.1s-13.4-5.6-23.8-5.6-15.1,1.2-19.7,3.5c-4.6,2.3-6.9,5.9-6.9,10.6s1.4,6.3,4.2,8.6,6.9,4.1,12.5,5.1l44.1,8.6c20.5,4.1,35.5,10.7,45.1,19.8,9.6,9.2,14.4,21.5,14.4,37.1s-7.4,35.7-22.2,47c-14.8,11.3-36.2,16.9-64.1,16.9h0Z"/>
			</svg>
		</div>
		<div class="subtitle">
			<div>Your <i style="color: var(--theme-color-accent)">#1</i> source of Web Development resources!</div>
			<div class="bottom">Proudly made 100% by humans.
				<a class="human-made-icon" title="" href="https://thisishumanmade.org" target="_blank" rel="noopener noreferrer">
					<svg class="transition-default" id="https://argxs.com" fill="currentColor" viewBox="0 0 138.14 183.88">
						<path d="M83.07,175.55c-.26.05-.51.1-.77.15-31.43,5.94-61.82-14.8-67.76-46.22l-6.79-33.49c-.94-4.65,2.07-9.19,6.72-10.13s9.19,2.07,10.13,6.72l6.81,33.6c4.2,22.22,25.58,36.81,47.69,32.63,10.7-1.99,19.99-8.1,26.13-17.1,6.14-9,8.41-19.86,6.39-30.57l-12.24-60.42c-.94-4.65,2.07-9.19,6.72-10.13s9.19,2.07,10.13,6.72l12.27,60.54c2.9,15.34-.33,30.77-9.06,43.57-8.58,12.58-21.48,21.14-36.37,24.16Z"/>
						<path d="M93.4,59.28l-8.11-40.02c-.94-4.65-5.48-7.66-10.13-6.72s-7.66,5.48-6.72,10.13l5.36,26.44c7.27,1.52,14.27,4.98,19.61,10.17Z"/>
						<path d="M57.34,49.05h.07s.07-.03.07-.03c.15-.03.29-.06.44-.09,2.62-.53,5.34-.76,8.1-.71l-6.92-34.16c-.94-4.65-5.48-7.66-10.13-6.72s-7.66,5.48-6.72,10.13l6.92,34.15c2.64-1.17,5.39-2.04,8.18-2.57Z"/>
						<path d="M81.79,57.85c-7.06-3.67-15.32-4.9-22.73-3.4-.13.03-.26.05-.39.08l-.14.03-.14.03c-.13.03-.26.05-.39.08-5.14,1.04-10.14,3.45-14.42,6.88l-6.59-32.51c-.94-4.65-5.48-7.66-10.14-6.72s-7.66,5.48-6.72,10.13l11.63,57.4.58,2.88,6.79,33.5c.94,4.65,5.48,7.66,10.14,6.72s7.66-5.48,6.72-10.13l-6.79-33.5-.56-2.77c-1.11-5.87,5.43-13.54,12.76-15.03.06-.01.12-.02.17-.03l.25-.05.22-.04.25-.05c3.58-.79,7.92-.12,11.54,1.77,3.37,1.75,5.64,4.33,6.21,6.96l7.37,36.37c.94,4.65,5.48,7.66,10.14,6.72s7.66-5.48,6.72-10.13l-7.39-36.48c-1.68-7.76-7.18-14.57-15.11-18.69Z"/>
					</svg>
				</a>
			</div>
		</div>
	</div>
</section>

<style>
    /* Desktop & Tablet */
    @media (width >= 44rem) {
        .home-page-sec {
            .title {
                font-size: 8rem;
            }
        }
    }

    /* Phone */
    @media (width < 44rem) {
        .home-page-sec {
            .title {
                font-size: 6rem;
            }

            div {
                transform: none !important;
            }
        }
    }

    .home-page-sec {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        padding: 4rem;

        overflow: hidden;
        transform-style: preserve-3d !important;

        display: flex;
        align-items: center;
        justify-content: center;

        perspective: 500px;

        user-select: none;
        pointer-events: none;

        .title {
            transform-style: preserve-3d;
            transform: translateZ(-2rem);

						height: 10rem;
						margin: 4rem 0;
            filter: drop-shadow(0 0 1rem rgba(from var(--theme-text-primary) r g b / .15));
            transition: 650ms linear(0, 0.002 0.3%, 0.007 0.6%, 0.029 1.3%, 0.065 2%, 0.119 2.8%, 0.237 4.2%, 0.659 8.7%, 0.778 10.2%, 0.871 11.6%, 0.95 13.1%, 1.009 14.6%, 1.033 15.4%, 1.052 16.2%, 1.066 17%, 1.078 17.9%, 1.085 18.8%, 1.088 19.7%, 1.088 20.7%, 1.085 21.7%, 1.074 23.6%, 1.032 28.7%, 1.014 31.4%, 1.006 33%, 1 34.6%, 0.993 38%, 0.992 41.9%, 0.999 51.4%, 1.001 57.6%, 1);
        }

        .subtitle {
            pointer-events: none !important;
            transform-style: preserve-3d;
            transform: translateZ(1rem);

            display: flex;
						flex-flow: column;
            align-items: center;
						gap: .25rem;

						color: var(--theme-text-primary);

            font-family: 'Funnel Sans', sans-serif;
            font-size: 1.1rem;
            font-weight: 500;
            text-wrap: nowrap;

						.bottom {
                transform-style: preserve-3d;
                transform: translateZ(1rem);

								display: flex;
								flex-flow: row nowrap;
								align-items: center;
								justify-content: center;
								gap: .25rem;

								.human-made-icon {
										pointer-events: auto !important;
										&:hover svg {
												color: var(--theme-color-accent);
										}

                    svg {
                        height: 1.3rem;
												shape-rendering: geometricPrecision !important;
                    }
								}
						}
        }
    }

    @keyframes subtitleAnim {
        0%, 100% {
            background-position: -1000px;
        }
        50% {
            background-position: 1000px;
        }
    }
</style>