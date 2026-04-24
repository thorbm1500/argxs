<script lang="ts">
	import { onMount } from 'svelte';
	import { Spring } from 'svelte/motion';

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
</script>

<section class="home-page-sec">
	<div style="transform-style: preserve-3d; transform: translateY({Math.max(minY, Math.min(maxY, (coords.current.y / 750) - .6))}rem) translateX({Math.max(minX, Math.min(maxX, (coords.current.x / 750) - 1.1))}rem) rotate3d(-1,0,0, -15deg) rotate3d(0,1,0, {$state.eager(deg)}deg)">
		<h1 class="title">argxs</h1>
		<div class="subtitle top">
			<div class="content">
				<p>Proudly made 100% by humans</p>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
					<path
						d="M4.5 22V17M4.5 7V2M2 4.5H7M2 19.5H7M13 3L11.2658 7.50886C10.9838 8.24209 10.8428 8.60871 10.6235 8.91709C10.4292 9.1904 10.1904 9.42919 9.91709 9.62353C9.60871 9.8428 9.24209 9.98381 8.50886 10.2658L4 12L8.50886 13.7342C9.24209 14.0162 9.60871 14.1572 9.91709 14.3765C10.1904 14.5708 10.4292 14.8096 10.6235 15.0829C10.8428 15.3913 10.9838 15.7579 11.2658 16.4911L13 21L14.7342 16.4911C15.0162 15.7579 15.1572 15.3913 15.3765 15.0829C15.5708 14.8096 15.8096 14.5708 16.0829 14.3765C16.3913 14.1572 16.7579 14.0162 17.4911 13.7342L22 12L17.4911 10.2658C16.7579 9.98381 16.3913 9.8428 16.0829 9.62353C15.8096 9.42919 15.5708 9.1904 15.3765 8.91709C15.1572 8.60871 15.0162 8.24209 14.7342 7.50886L13 3Z"
						stroke="currentColor"
						stroke-width="2.25"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>
		</div>
	</div>
</section>

<style>
		.home-page-sec.copy {
				position: absolute;
        overflow: visible;
				justify-self: center;
				height: 0;

				color: var(--theme-text-third);
				filter: blur(.5rem);

				opacity: .25;
		}

    .home-page-sec {
        height: 65vh;
        padding-top: 10rem;
				transform-style: preserve-3d !important;
				overflow: hidden;
				perspective: 500px;

        color: var(--theme-text-primary);
        text-align: center;
        text-rendering: geometricPrecision;

        user-select: none;

        .title {
            font-family: 'Funnel Display', sans-serif;
            font-size: 6.5rem;
            font-weight: 900;
            margin: 1rem;
            filter: drop-shadow(0 0 1rem rgba(from var(--theme-text-primary) r g b / .15));
            transition: 650ms linear(0, 0.002 0.3%, 0.007 0.6%, 0.029 1.3%, 0.065 2%, 0.119 2.8%, 0.237 4.2%, 0.659 8.7%, 0.778 10.2%, 0.871 11.6%, 0.95 13.1%, 1.009 14.6%, 1.033 15.4%, 1.052 16.2%, 1.066 17%, 1.078 17.9%, 1.085 18.8%, 1.088 19.7%, 1.088 20.7%, 1.085 21.7%, 1.074 23.6%, 1.032 28.7%, 1.014 31.4%, 1.006 33%, 1 34.6%, 0.993 38%, 0.992 41.9%, 0.999 51.4%, 1.001 57.6%, 1);
        }

        .subtitle {
						display: flex;
						flex-flow: row nowrap;
						align-items: center;
						justify-content: center;
						gap: .35rem;

            font-family: 'Funnel Display', sans-serif;
            font-size: 1.1rem;
            font-weight: 500;

						width: 100%;
						height: fit-content;
            transform-style: preserve-3d;
            transform: translateY(1rem) translateZ(1rem);

						svg {
								width: 1.25rem;
								height: 1.25rem;
						}
        }

				.subtitle.top {
            pointer-events: none !important;

						.content {
                position: absolute;

                align-self: center;
                align-content: center;

								display: flex;
								flex-flow: row nowrap;
								align-items: center;
								justify-content: center;
								gap: .35rem;
						}
				}
    }

		@keyframes subtitleAnim {
				0%,100% {
						background-position: -1000px;
				}
				50% {
            background-position: 1000px;
				}
		}
</style>