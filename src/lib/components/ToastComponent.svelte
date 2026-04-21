<script module lang="ts">
	import { fly } from 'svelte/transition';
	import { elasticOut, expoIn } from 'svelte/easing';
	import { flushSync } from 'svelte';

	//todo: Check matchMedia('prefers-reduced-motion').matches on Windows

	declare interface ToastRequest {
		message: string;
		duration?: number;
		type?: 'info' | 'copy' | 'download';
		status?: 'success' | 'error' | 'warn' | 'info';
	}

	let currentToast: ToastRequest | null = $state(null);
	let isActive: boolean = $derived(!!currentToast);

	let currentToastAmount: number = $state.raw(1);

	let message: string = $state('');
	let expiration: number = $state(0);
	let type: 'info' | 'copy' | 'download' = $state('info');
	let status: 'success' | 'error' | 'warn' | 'info' = $state('info');

	function reset() {
		currentToast = null;
		currentToastAmount = 1;
		expiration = 0;
		type = 'info';
		status = 'info';

		flushSync();
	}

	setInterval(() => {
		if (!isActive) return;

		if (expiration > 0) expiration -= 250;
		else reset();
	}, 250);
</script>

<script lang="ts">
	let { sendFunction = $bindable() } = $props();

	sendFunction = (req: ToastRequest) => {
		// Check if a toast is currently being displayed, and clear it if so, to avoid duplicates.
		if (currentToast !== null) {
			// Check if the new toast is a duplicate of the existing toast
			if (JSON.stringify(currentToast) === JSON.stringify(req)) {
				expiration = req.duration ?? 1500;
				currentToastAmount++;
			} else reset();
		}

		message = req.message;
		expiration = req.duration ?? 1500;
		type = req.type ?? 'info';
		status = req.status ?? 'info';

		currentToast = req;
	};
</script>

{#if currentToast}
	<section in:fly={{ y: -65, duration: 800, easing: elasticOut }} out:fly={{ y: -75, duration: 250, easing: expoIn }} class="toast">
		<p class="message">
			{#if currentToastAmount > 1}
				{currentToastAmount}x
			{/if}
			{message}
			{#if status === 'success'}
				{#if type === 'copy'}
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M16 4C16.93 4 17.395 4 17.7765 4.10222C18.8117 4.37962 19.6204 5.18827 19.8978 6.22354C20 6.60504 20 7.07003 20 8V17.2C20 18.8802 20 19.7202 19.673 20.362C19.3854 20.9265 18.9265 21.3854 18.362 21.673C17.7202 22 16.8802 22 15.2 22H8.8C7.11984 22 6.27976 22 5.63803 21.673C5.07354 21.3854 4.6146 20.9265 4.32698 20.362C4 19.7202 4 18.8802 4 17.2V8C4 7.07003 4 6.60504 4.10222 6.22354C4.37962 5.18827 5.18827 4.37962 6.22354 4.10222C6.60504 4 7.07003 4 8 4M9 15L11 17L15.5 12.5M9.6 6H14.4C14.9601 6 15.2401 6 15.454 5.89101C15.6422 5.79513 15.7951 5.64215 15.891 5.45399C16 5.24008 16 4.96005 16 4.4V3.6C16 3.03995 16 2.75992 15.891 2.54601C15.7951 2.35785 15.6422 2.20487 15.454 2.10899C15.2401 2 14.9601 2 14.4 2H9.6C9.03995 2 8.75992 2 8.54601 2.10899C8.35785 2.20487 8.20487 2.35785 8.10899 2.54601C8 2.75992 8 3.03995 8 3.6V4.4C8 4.96005 8 5.24008 8.10899 5.45399C8.20487 5.64215 8.35785 5.79513 8.54601 5.89101C8.75992 6 9.03995 6 9.6 6Z"
							stroke="currentColor"
							stroke-width="2.25"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				{/if}
				{#if type === 'download'}
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M12 11V17M12 17L9 14M12 17L15 14M16 4C16.93 4 17.395 4 17.7765 4.10222C18.8117 4.37962 19.6204 5.18827 19.8978 6.22354C20 6.60504 20 7.07003 20 8V17.2C20 18.8802 20 19.7202 19.673 20.362C19.3854 20.9265 18.9265 21.3854 18.362 21.673C17.7202 22 16.8802 22 15.2 22H8.8C7.11984 22 6.27976 22 5.63803 21.673C5.07354 21.3854 4.6146 20.9265 4.32698 20.362C4 19.7202 4 18.8802 4 17.2V8C4 7.07003 4 6.60504 4.10222 6.22354C4.37962 5.18827 5.18827 4.37962 6.22354 4.10222C6.60504 4 7.07003 4 8 4M9.6 6H14.4C14.9601 6 15.2401 6 15.454 5.89101C15.6422 5.79513 15.7951 5.64215 15.891 5.45399C16 5.24008 16 4.96005 16 4.4V3.6C16 3.03995 16 2.75992 15.891 2.54601C15.7951 2.35785 15.6422 2.20487 15.454 2.10899C15.2401 2 14.9601 2 14.4 2H9.6C9.03995 2 8.75992 2 8.54601 2.10899C8.35785 2.20487 8.20487 2.35785 8.10899 2.54601C8 2.75992 8 3.03995 8 3.6V4.4C8 4.96005 8 5.24008 8.10899 5.45399C8.20487 5.64215 8.35785 5.79513 8.54601 5.89101C8.75992 6 9.03995 6 9.6 6Z"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				{/if}
			{/if}
		</p>
	</section>
{/if}

<style>
	.toast {
		position: fixed;
		bottom: 0;
		left: 0;

		overflow: hidden;

		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: center;

		width: 100vw;
		height: calc(100vh - 3rem);

		pointer-events: none !important;

		z-index: 500;

		.message {
			position: absolute;
			top: 2rem;

			display: flex;
			flex-flow: row nowrap;
			align-items: center;
			justify-content: center;
			gap: 0.3rem;

			padding: 0.5rem 0.85rem;

			color: var(--theme-ui-white);
			background: color-mix(var(--theme-color-success), #0d0d0d 25%);
			border: 1px solid var(--theme-color-success-light);
			border-radius: 0.9rem;

			font-weight: 600;

			svg {
				position: relative;

				height: 1.325rem;
				width: auto;
			}
		}
	}
</style>
