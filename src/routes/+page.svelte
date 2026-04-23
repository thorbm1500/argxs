<script lang="ts">
	import { onMount } from 'svelte';

	const { data } = $props();

	let x: number = $state.raw(0);
	let y: number = $state.raw(0);

	onMount(() => {
		if (!document) return;
		document.addEventListener('mousemove', (event) => {
			x = event.x;
			y = event.y;
		});
	});
</script>

<section class="home-page-sec">
	<div style="transform-style: preserve-3d; transform: rotate3d(-1,0,0, {(y - 400) / 50}deg) rotate3d(0,1,0, {(x - 900) / 65}deg)">
		<h1 class="title">argxs</h1>
		<h3 class="subtitle top" style="position: absolute;">Proudly made 100% by humans
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
				<path
					d="M4.5 22V17M4.5 7V2M2 4.5H7M2 19.5H7M13 3L11.2658 7.50886C10.9838 8.24209 10.8428 8.60871 10.6235 8.91709C10.4292 9.1904 10.1904 9.42919 9.91709 9.62353C9.60871 9.8428 9.24209 9.98381 8.50886 10.2658L4 12L8.50886 13.7342C9.24209 14.0162 9.60871 14.1572 9.91709 14.3765C10.1904 14.5708 10.4292 14.8096 10.6235 15.0829C10.8428 15.3913 10.9838 15.7579 11.2658 16.4911L13 21L14.7342 16.4911C15.0162 15.7579 15.1572 15.3913 15.3765 15.0829C15.5708 14.8096 15.8096 14.5708 16.0829 14.3765C16.3913 14.1572 16.7579 14.0162 17.4911 13.7342L22 12L17.4911 10.2658C16.7579 9.98381 16.3913 9.8428 16.0829 9.62353C15.8096 9.42919 15.5708 9.1904 15.3765 8.91709C15.1572 8.60871 15.0162 8.24209 14.7342 7.50886L13 3Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</h3>
		<h3 class="subtitle fx" style="position: absolute;">Proudly made 100% by humans
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
				<path
					d="M4.5 22V17M4.5 7V2M2 4.5H7M2 19.5H7M13 3L11.2658 7.50886C10.9838 8.24209 10.8428 8.60871 10.6235 8.91709C10.4292 9.1904 10.1904 9.42919 9.91709 9.62353C9.60871 9.8428 9.24209 9.98381 8.50886 10.2658L4 12L8.50886 13.7342C9.24209 14.0162 9.60871 14.1572 9.91709 14.3765C10.1904 14.5708 10.4292 14.8096 10.6235 15.0829C10.8428 15.3913 10.9838 15.7579 11.2658 16.4911L13 21L14.7342 16.4911C15.0162 15.7579 15.1572 15.3913 15.3765 15.0829C15.5708 14.8096 15.8096 14.5708 16.0829 14.3765C16.3913 14.1572 16.7579 14.0162 17.4911 13.7342L22 12L17.4911 10.2658C16.7579 9.98381 16.3913 9.8428 16.0829 9.62353C15.8096 9.42919 15.5708 9.1904 15.3765 8.91709C15.1572 8.60871 15.0162 8.24209 14.7342 7.50886L13 3Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</h3>
		<h3 class="subtitle">Proudly made 100% by humans
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
				<path
					d="M4.5 22V17M4.5 7V2M2 4.5H7M2 19.5H7M13 3L11.2658 7.50886C10.9838 8.24209 10.8428 8.60871 10.6235 8.91709C10.4292 9.1904 10.1904 9.42919 9.91709 9.62353C9.60871 9.8428 9.24209 9.98381 8.50886 10.2658L4 12L8.50886 13.7342C9.24209 14.0162 9.60871 14.1572 9.91709 14.3765C10.1904 14.5708 10.4292 14.8096 10.6235 15.0829C10.8428 15.3913 10.9838 15.7579 11.2658 16.4911L13 21L14.7342 16.4911C15.0162 15.7579 15.1572 15.3913 15.3765 15.0829C15.5708 14.8096 15.8096 14.5708 16.0829 14.3765C16.3913 14.1572 16.7579 14.0162 17.4911 13.7342L22 12L17.4911 10.2658C16.7579 9.98381 16.3913 9.8428 16.0829 9.62353C15.8096 9.42919 15.5708 9.1904 15.3765 8.91709C15.1572 8.60871 15.0162 8.24209 14.7342 7.50886L13 3Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</h3>
	</div>
</section>

<style>
    .home-page-sec {
        height: 65vh;
        padding-top: 7rem;
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
            transition: 650ms linear(0, 0.002 0.3%, 0.007 0.6%, 0.029 1.3%, 0.065 2%, 0.119 2.8%, 0.237 4.2%, 0.659 8.7%, 0.778 10.2%, 0.871 11.6%, 0.95 13.1%, 1.009 14.6%, 1.033 15.4%, 1.052 16.2%, 1.066 17%, 1.078 17.9%, 1.085 18.8%, 1.088 19.7%, 1.088 20.7%, 1.085 21.7%, 1.074 23.6%, 1.032 28.7%, 1.014 31.4%, 1.006 33%, 1 34.6%, 0.993 38%, 0.992 41.9%, 0.999 51.4%, 1.001 57.6%, 1);
        }

				.title:hover {
						filter: drop-shadow(0 0 .85rem rgba(from var(--theme-text-primary) r g b / .15));
						transition: transform 350ms linear(0, 0.002 0.3%, 0.007 0.6%, 0.029 1.3%, 0.065 2%, 0.119 2.8%, 0.237 4.2%, 0.659 8.7%, 0.778 10.2%, 0.871 11.6%, 0.95 13.1%, 1.009 14.6%, 1.033 15.4%, 1.052 16.2%, 1.066 17%, 1.078 17.9%, 1.085 18.8%, 1.088 19.7%, 1.088 20.7%, 1.085 21.7%, 1.074 23.6%, 1.032 28.7%, 1.014 31.4%, 1.006 33%, 1 34.6%, 0.993 38%, 0.992 41.9%, 0.999 51.4%, 1.001 57.6%, 1);
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
            transform: translateZ(.5rem);

						svg {
								width: 1.25rem;
								height: 1.25rem;
						}
        }

				.subtitle.top {
						color: var(--theme-text-primary);
						opacity: .75;
						z-index: 10;

						svg {
								opacity: 0;
						}
				}

				.subtitle.fx {
						color: transparent;
						background-clip: text;
						background-image: radial-gradient(circle at 10% 20%, rgb(222, 168, 248) 0%, rgb(168, 222, 248) 21.8%, rgb(189, 250, 205) 35.6%, rgb(243, 250, 189) 52.9%, rgb(250, 227, 189) 66.8%, rgb(248, 172, 172) 90%, rgb(254, 211, 252) 99.7%);;
						filter: blur(3px) contrast(1.15) saturate(1.15);
						background-repeat: repeat;

						animation: subtitleAnim 6s infinite;
						animation-timing-function: cubic-bezier(0.765, 0.391, 0, 1.608);
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