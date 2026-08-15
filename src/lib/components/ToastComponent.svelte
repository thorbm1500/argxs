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
	let { theme = $bindable(), sendFunction = $bindable() } = $props();
	
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
		//eslint-disable-next-line no-global-assign
		status = req.status ?? 'info';
		
		currentToast = req;
	};
</script>

{#if currentToast}
	<section class="{theme} toast" in:fly={{ y: -65, duration: 800, easing: elasticOut }} out:fly={{ y: -75, duration: 250, easing: expoIn }} inert>
		<p class="message {type} {status}">
			{#if currentToastAmount > 1}
				{currentToastAmount}x
			{/if}
			{message}
			{#if type === 'copy'}
				{#if status === 'success'}
					<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
						<path d="M17.997 4.17a3 3 0 0 1 2.003 2.83v12a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 2.003 -2.83a4 4 0 0 0 3.997 3.83h4a4 4 0 0 0 3.98 -3.597zm-3.704 7.123l-3.293 3.292l-1.293 -1.292a1 1 0 1 0 -1.414 1.414l2 2a1 1 0 0 0 1.414 0l4 -4a1 1 0 0 0 -1.414 -1.414m-.293 -9.293a2 2 0 1 1 0 4h-4a2 2 0 1 1 0 -4z" />
					</svg>
				{:else if status === 'info'}
					<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
						<path d="M17.997 4.17a3 3 0 0 1 2.003 2.83v12a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 2.003 -2.83a4 4 0 0 0 3.997 3.83h4a4 4 0 0 0 3.98 -3.597zm-3.997 -2.17a2 2 0 1 1 0 4h-4a2 2 0 1 1 0 -4z" />
					</svg>
				{:else}
					<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
						<path d="M17.997 4.17a3 3 0 0 1 2.003 2.83v12a3 3 0 0 1 -3 3h-10a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 2.003 -2.83a4 4 0 0 0 3.997 3.83h4a4 4 0 0 0 3.98 -3.597zm-7.29 7.123a1 1 0 0 0 -1.414 0l-.083 .094a1 1 0 0 0 .083 1.32l1.292 1.293l-1.292 1.293a1 1 0 0 0 0 1.414l.094 .083a1 1 0 0 0 1.32 -.083l1.293 -1.293l1.293 1.293a1 1 0 0 0 1.414 0l.083 -.094a1 1 0 0 0 -.083 -1.32l-1.293 -1.293l1.293 -1.293a1 1 0 0 0 0 -1.414l-.094 -.083a1 1 0 0 0 -1.32 .083l-1.293 1.292zm3.293 -9.293a2 2 0 1 1 0 4h-4a2 2 0 1 1 0 -4z" />
					</svg>
				{/if}
			{:else if type === 'download'}
				{#if status === 'success'}
					<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 2l.117 .007a1 1 0 0 1 .876 .876l.007 .117v4l.005 .15a2 2 0 0 0 1.838 1.844l.157 .006h4l.117 .007a1 1 0 0 1 .876 .876l.007 .117v9a3 3 0 0 1 -2.824 2.995l-.176 .005h-10a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005zm3.707 10.293a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292a1 1 0 1 0 -1.414 1.414l2 2a1 1 0 0 0 1.414 0l4 -4a1 1 0 0 0 0 -1.414m-.707 -9.294l4 4.001h-4z" />
					</svg>
				{:else if status === 'info'}
					<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 2l.117 .007a1 1 0 0 1 .876 .876l.007 .117v4l.005 .15a2 2 0 0 0 1.838 1.844l.157 .006h4l.117 .007a1 1 0 0 1 .876 .876l.007 .117v9a3 3 0 0 1 -2.824 2.995l-.176 .005h-10a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005zm0 12h-1a1 1 0 0 0 0 2v3a1 1 0 0 0 1 1h1a1 1 0 0 0 1 -1l-.007 -.117a1 1 0 0 0 -.876 -.876l-.117 -.007v-3a1 1 0 0 0 -1 -1m.01 -3h-.01a1 1 0 0 0 -.117 1.993l.127 .007a1 1 0 0 0 0 -2" />
						<path d="M19 7h-4l-.001 -4.001z" />
					</svg>
				{:else}
					<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
						<path d="M12 2l.117 .007a1 1 0 0 1 .876 .876l.007 .117v4l.005 .15a2 2 0 0 0 1.838 1.844l.157 .006h4l.117 .007a1 1 0 0 1 .876 .876l.007 .117v9a3 3 0 0 1 -2.824 2.995l-.176 .005h-10a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-14a3 3 0 0 1 2.824 -2.995l.176 -.005h5zm-1.489 9.14a1 1 0 0 0 -1.301 1.473l.083 .094l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.403 1.403l.094 -.083l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.403 -1.403l-.083 -.094l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.403 -1.403l-.094 .083l-1.293 1.292l-1.293 -1.292l-.094 -.083l-.102 -.07z" />
						<path d="M19 7h-4l-.001 -4.001z" />
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

				&.dark .message {
            border: .1rem solid;
				}

        .message {
            position: absolute;
            top: 2rem;

            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            justify-content: center;
            gap: 0.3rem;

            padding: 0.5rem 0.85rem;

            color: var(--theme-color-white);
            border: .125rem solid;
            border-radius: .9rem;

            font-weight: 600;

            &.info {
                background: var(--theme-color-info-dark);
                border-color: var(--theme-color-info);
            }

            &.success {
                background: var(--theme-color-success-dark);
                border-color: var(--theme-color-success);
            }

            &.warn {
                background: var(--theme-color-aware-dark);
                border-color: var(--theme-color-aware);
            }

            &.error {
                background: var(--theme-color-alert-dark);
                border-color: var(--theme-color-alert);
            }

            svg {
                position: relative;
                color: inherit;

                height: 1.325rem;
                width: auto;
            }
        }
    }
</style>