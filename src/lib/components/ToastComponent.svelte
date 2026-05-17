<script module lang="ts">
	import { fly } from 'svelte/transition';
	import { elasticOut, expoIn } from 'svelte/easing';
	import { flushSync } from 'svelte';
	
	export interface ToastRequest {
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
	<section in:fly={{ y: -65, duration: 800, easing: elasticOut }} out:fly={{ y: -75, duration: 250, easing: expoIn }} class="toast" inert>
		<p class="message">
			{#if currentToastAmount > 1}
				{currentToastAmount}x
			{/if}
			{message}
			{#if status === 'success'}
				{#if type === 'copy'}
					<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M17.997 4.17a3 3 0 0 1 2.003 2.83v12a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 2.003 -2.83a4 4 0 0 0 3.997 3.83h4a4 4 0 0 0 3.98 -3.597zm-3.704 7.123l-3.293 3.292l-1.293 -1.292a1 1 0 1 0 -1.414 1.414l2 2a1 1 0 0 0 1.414 0l4 -4a1 1 0 0 0 -1.414 -1.414m-.293 -9.293a2 2 0 1 1 0 4h-4a2 2 0 1 1 0 -4z" />
					</svg>
				{/if}
				{#if type === 'download'}
					<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M12 2l.117 .007a1 1 0 0 1 .876 .876l.007 .117v4l.005 .15a2 2 0 0 0 1.838 1.844l.157 .006h4l.117 .007a1 1 0 0 1 .876 .876l.007 .117v9a3 3 0 0 1 -2.824 2.995l-.176 .005h-10a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005zm3.707 10.293a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292a1 1 0 1 0 -1.414 1.414l2 2a1 1 0 0 0 1.414 0l4 -4a1 1 0 0 0 0 -1.414m-.707 -9.294l4 4.001h-4z" />
					</svg>
				{/if}
			{/if}
		</p>
	</section>
{/if}

<style>
	.toast {
		position:        fixed;
		bottom:          0;
		left:            0;
		
		overflow:        hidden;
		
		display:         flex;
		flex-flow:       row nowrap;
		align-items:     center;
		justify-content: center;
		
		width:           100vw;
		height:          calc(100vh - 3rem);
		
		pointer-events:  none !important;
		
		z-index:         500;
		
		.message {
			position:        absolute;
			top:             2rem;
			
			display:         flex;
			flex-flow:       row nowrap;
			align-items:     center;
			justify-content: center;
			gap:             0.3rem;
			
			padding:         0.5rem 0.85rem;
			
			color:           var(--theme-ui-white);
			background:      color-mix(var(--theme-color-success), #0d0d0d 25%);
			border:          1px solid var(--theme-color-success-light);
			border-radius:   0.9rem;
			
			font-weight:     600;
			
			svg {
				position: relative;
				color:    inherit;
				
				height:   1.325rem;
				width:    auto;
			}
		}
	}
</style>