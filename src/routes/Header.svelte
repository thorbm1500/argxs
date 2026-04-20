<script lang="ts">
	import { onMount } from 'svelte';

	let { theme = $bindable() } = $props();

	onMount(async () => {
		//svelte-ignore state_referenced_locally
		const currentTheme = await window.cookieStore.get('argxs_theme');
		if (currentTheme === null) {
			//svelte-ignore state_referenced_locally
			await window.cookieStore.set('argxs_theme', theme);
		} else {
			theme = currentTheme.value === 'light' || currentTheme.value === 'dark' ? currentTheme.value : 'light';
		}

		window.cookieStore.addEventListener('change', async (e) => {
			for (const cookie of e.changed) {
				if (cookie.name === 'argxs_theme') {
					const currentTheme = await window.cookieStore.get('argxs_theme');
					if (currentTheme !== null) {
						theme = currentTheme.value === 'light' || currentTheme.value === 'dark' ? currentTheme.value : 'light';
					}
				}
			}
		});
	});

	async function updateTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		await window.cookieStore.set('argxs_theme', theme);
	}
</script>

<section class="header-section {theme}">
	<div class="content">
		<a href="/" class="argxs">argxs</a>
		<div class="actions">
			<button title="" onclick="{updateTheme}" class="theme-switch-button {theme}">
				<div class="button-switch">
					{#if theme === 'light'}
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M12 2V4M12 20V22M4 12H2M6.31412 6.31412L4.8999 4.8999M17.6859 6.31412L19.1001 4.8999M6.31412 17.69L4.8999 19.1042M17.6859 17.69L19.1001 19.1042M22 12H20M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z"
								stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					{:else}
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M21.9548 12.9564C20.5779 15.3717 17.9791 17.0001 15 17.0001C10.5817 17.0001 7 13.4184 7 9.00008C7 6.02072 8.62867 3.42175 11.0443 2.04492C5.96975 2.52607 2 6.79936 2 11.9998C2 17.5227 6.47715 21.9998 12 21.9998C17.2002 21.9998 21.4733 18.0305 21.9548 12.9564Z"
								stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					{/if}
				</div>
			</button>
			<nav>
				<a href="https://github.com/thorbm1500/argxs" target="_blank" rel="external">
					<svg class="theme-custom-icon" width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd"
						      d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
						      transform="scale(64)" fill="currentColor" />
					</svg>
					GitHub
				</a>
			</nav>
		</div>
	</div>
</section>

<style>
    .header-section {
        position: absolute;
        top: 0;
        left: 0;

        width: 100vw;
        height: 3rem;

        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: center;

        border-bottom: 1px solid var(--theme-ui-line);
        background: var(--theme-ui-header);

        user-select: none;

        z-index: 99999;

        .content {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            justify-content: space-between;

            width: 80vw;

            font-family: 'Lexend', sans-serif;

            .actions {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: flex-start;
                gap: 1rem;

                .theme-switch-button {
                    box-sizing: border-box !important;

                    width: 3rem;
                    height: 1.5rem;

                    cursor: pointer;

                    background: var(--theme-ui-container);
                    border: 1px solid var(--theme-ui-line);
                    border-radius: 1rem;

                    .button-switch {
                        position: relative;
                        top: .05rem;
                        left: .15rem;

                        backdrop-filter: blur(1px) brightness(1.15) contrast(1.15);
                        width: 1.125rem;
                        height: 1.125rem;
                        border-radius: 100%;

                        color: var(--theme-color-secondary);

                        display: flex;
                        align-items: center;
                        justify-content: center;

                        transition: 175ms cubic-bezier(0.125, 0.885, 0.420, 1.2);
                    }
                }

                .theme-switch-button:hover .button-switch {
                    color: var(--theme-color-accent);
                }

                .theme-switch-button.dark .button-switch {
                    left: 1.6rem;
                    transform: rotate(720deg);
                    transition: 175ms cubic-bezier(0.125, 0.885, 0.420, 1.2);
                }
            }

            .argxs {
                font-size: 1.5rem;
                font-weight: 500;

                color: var(--theme-text-primary);
            }

            a {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                justify-content: center;
                gap: .1rem;

                font-size: .91rem;
                font-weight: 375;
                color: var(--theme-text-secondary);
            }

            a:hover {
                color: var(--theme-text-primary);
            }
        }
    }
</style>