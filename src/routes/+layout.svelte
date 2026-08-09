<script lang="ts">
	import '$lib/styles/layout.css';
	import Header from './Header.svelte';
	import Sidebar from './Sidebar.svelte';
	import Footer from './Footer.svelte';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { updated } from '$app/state';
	import { onMount, setContext } from 'svelte';
	import ToastComponent, { type ToastRequest } from '$lib/components/ToastComponent.svelte';
	import type { Attachment } from 'svelte/attachments';
	import { innerHeight, innerWidth } from 'svelte/reactivity/window';
	import { scale } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';
	
	const { children, data } = $props();
	
	let pageState: boolean = $state(false);
	let sidebarState: boolean = $state(false);
	let screenSizeWarning: boolean = $state(false);
	
	onMount(() => setTimeout(() => pageState = true, 1500));
	afterNavigate(() => setTimeout(() => pageState = true, 1000));
	beforeNavigate(({ willUnload, to }) => {
		pageState = false;
		sidebarState = false;
		screenSizeWarning = false;
		if (updated.current && !willUnload && to?.url) {
			location.href = to.url.href;
		} else {
			scrollTo(0);
		}
	});
	
	//svelte-ignore state_referenced_locally
	let theme: 'light' | 'dark' = $state(data.theme ?? 'dark');
	setContext('theme', () => theme);
	setContext('toggleTheme', (changedTo?: 'dark' | 'light') => {
		if (changedTo) theme = changedTo;
		else theme = theme === 'light' ? 'dark' : 'light';
		window?.cookieStore?.set('argxs_theme', theme);
	});
	
	let sendToast: any = $state.raw(undefined);
	setContext('sendToast', (req: ToastRequest) => sendToast?.(req));
	
	let scrollY: number = $state(0);
	setContext('scrollY', () => scrollY);
	
	let scrollTo: (y: number) => void = (y: number) => {};
	
	const scrollListener: Attachment = (element) => {
		scrollTo = (y: number) => {
			element.scroll({ top: y, behavior: 'smooth' });
		};
		
		element.addEventListener('scroll', () => scrollY = element.scrollTop ?? 0);
		
		setInterval(() => {
			scrollY = element.scrollTop ?? 0;
		}, 1000);
		
		return () => scrollY = 0;
	};
</script>

{#if !screenSizeWarning }
	<div class="screen-size-warning {theme}">
		<div class="message">
			<div class="title">
				<h1>Sorry!</h1>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">
					<path d="M9 10l.01 0" />
					<path d="M15 10l.01 0" />
					<path d="M9.5 15.25a3.5 3.5 0 0 1 5 0" />
					<path fill="var(--theme-color-accent)" stroke="var(--theme-color-accent)" stroke-width="1.75" d="M17.566 17.606a2 2 0 1 0 2.897 .03l-1.463 -1.636l-1.434 1.606" />
					<path d="M20.865 13.517a8.937 8.937 0 0 0 .135 -1.517a9 9 0 1 0 -9 9c.69 0 1.36 -.076 2 -.222" />
				</svg>
			</div>
			<div class="subtitle">
				<h3>This page is not optimized for mobile use.</h3>
				<button class="continue transition-default" title="" onclick={() => screenSizeWarning = true}>
					<h4 class="transition-default">Continue anyway</h4>
					<svg class="transition-default" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M5 12l14 0" />
						<path d="M15 16l4 -4" />
						<path d="M15 8l4 4" />
					</svg>
				</button>
			</div>
		</div>
	</div>
{/if}

<ToastComponent bind:theme={theme} bind:sendFunction={sendToast} />

{#if (innerWidth.current ?? 1920) > 700 && scrollY > 750}
	<div class="{theme} btt-parent {scrollY > ((innerHeight.current ?? 1080) * .25) ? 'active' : 'inactive'}">
		<div in:scale|global={{duration: prefersReducedMotion.current ? 0 : 75, easing: cubicOut, start:0}}
				 out:scale|global={{duration: prefersReducedMotion.current ? 0 : 200, easing: cubicIn, start:0}} inert>
			<div class="btt effect-a"></div>
			<div class="btt effect-b"></div>
			<div class="btt effect-c">
				<div class="effect-d"></div>
			</div>
			<div class="btt effect-e"></div>
			<div class="btt effect-f">
				<div class="effect-g"></div>
			</div>
			{#if !prefersReducedMotion.current}
				<div class="btt effect-h" style="mask-image:linear-gradient({(scrollY - 180) / 16}deg, transparent 0%, transparent 65%, black 100%);">
					<div class="effect-i" style="filter:hue-rotate({scrollY / 2}deg);"></div>
				</div>
			{/if}
		</div>
		<button in:scale|global={{duration: prefersReducedMotion.current ? 0 : 75, easing: cubicOut, start:0}}
						out:scale|global={{duration: prefersReducedMotion.current ? 0 : 200, easing: cubicIn,start:0}}
		        onclick="{() => scrollTo(0)}" class="btt back-to-top" tabindex="0">
			<svg fill="none" width="24" height="24" viewBox="0 0 24 24">
				<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m17 14l-5-5m0 0l-5 5"/>
			</svg>
			<!--suppress HtmlUnknownTag -->
			<p>Back to Top</p>
		</button>
	</div>
{/if}

<section id="main-container" class="main-container {theme}" {@attach scrollListener}>
	{#if children}
		{@render children()}
		<Footer />
	{:else}
		<p>Loading...</p>
	{/if}
</section>

<Header bind:theme bind:pageState bind:sidebarState />
<Sidebar bind:theme bind:pageState bind:sidebarState version={data.version} requests={data.requests} />

<style>
    /* Desktop & Tablet */
    @media (width >= 44rem) {
        .btt-parent {
            visibility: visible;
        }

        .main-container {
            padding: 5rem 6rem 0 6rem;
        }
    }

    /* Phone */
    @media (width < 44rem) {
        .btt-parent {
            visibility: force-hidden !important;
        }

        .back-to-top {
            display: none !important;
        }

        .main-container {
            padding: 3rem 2rem 0 2rem;
        }
    }

		@media (width > 700px) {
				.screen-size-warning {
						display: none !important;
				}
		}

    .screen-size-warning {
				overflow: hidden;
				background: var(--theme-ui-background);

        z-index: 999999;

				.message {
						width: 100%;
						height: 100%;

            flex-flow: column nowrap;
						align-items: center;
						justify-content: center;

						padding-top: 2rem;

						&, .title, .subtitle {
                display: flex;
						}

						.title {
                flex-flow: row nowrap;
                align-items: center;
                justify-content: center;
								gap: .25rem;

								font-size: 2rem;

								svg {
										height: 2.5rem;
								}
						}
						.subtitle {
                flex-flow: column nowrap;

								.continue {
										display: flex;
										flex-flow: row nowrap;
										justify-content: center;

										margin-top: 2rem;

										h4 {
                        font-size: .925rem;
										}

										h4, svg {
                        color: var(--theme-text-fourth);
										}

										&:hover {
												h4, svg {
                            color: var(--theme-text-secondary);
												}
										}
								}
						}
				}
		}

    .btt-parent .btt {
        &.back-to-top, &.effect-a, &.effect-b, &.effect-c, &.effect-e, &.effect-f, &.effect-h {
            position: fixed !important;
            bottom: 2.75rem;
            right: 5.5rem;

            width: 9rem;
            height: 2.75rem;
            padding: .5rem .75rem;

            border-radius: .9rem;
        }
    }

    .back-to-top {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: .25rem;

        border: 1px solid rgba(from var(--theme-ui-line-highlight) r g b / .25);
        background: rgba(from var(--theme-ui-container) r g b / .5);
        backdrop-filter: brightness(.9) grayscale(.2);

        padding-right: 1rem !important;

        font-weight: 900;
        text-wrap: nowrap;
        color: var(--theme-color-primary);

        svg {
            position: relative;
            width: 2rem;
            height: fit-content;
            color: var(--theme-color-primary);
        }

        svg, p {
            filter: drop-shadow(0 0 .3rem #FFFFFF44);
        }

        &:hover {
            filter: brightness(1.1);
        }

        z-index: 99999 !important;
    }

    .btt.effect-a {
        mask-image: linear-gradient(to top, transparent 80%, black 96%), linear-gradient(to bottom, transparent 80%, black 96%),
        linear-gradient(to left, transparent 92.5%, black 100%), linear-gradient(to right, transparent 92.5%, black 100%),
        radial-gradient(ellipse 8.35rem 3.35rem at 1.5rem, transparent 82.5%, black 92.5%, black 100%),
        radial-gradient(ellipse 8.35rem 3.35rem at 7.5rem, transparent 82.5%, black 92.5%, black 100%);
        mask-type: luminance;
        backdrop-filter: url('#btt-glass-distortion') url('#btt-morph-filter') saturate(1.5) brightness(1.2) blur(1px) url('#btt-glass-distortion');

        z-index: 99997 !important;
    }

    .btt.effect-b {
        backdrop-filter: url('#btt-glass-distortion') brightness(1.1) saturate(1.35) contrast(1.0025) url('#btt-blur-filter');
        z-index: 99990 !important;
    }

    .dark {
        .btt.effect-c {
            mask-image: linear-gradient(0deg, black 0%, transparent 35%, transparent 65%, black 100%), linear-gradient(15deg, black 0%, transparent 35%, transparent 100%);
            mix-blend-mode: lighten;

            .effect-d {
                border: .15rem solid #FFFFFFAA;
            }
        }
    }

    .btt.effect-c {
        overflow: hidden;
        mask-type: luminance;

        mask-image: linear-gradient(0deg, black 0%, transparent 35%, transparent 65%, black 100%), linear-gradient(15deg, black 0%, transparent 35%, transparent 100%);
        mix-blend-mode: darken;

        z-index: 100000 !important;

        .effect-d {
            position: fixed;
            width: inherit;
            height: inherit;
            bottom: inherit;
            right: inherit;
            border-radius: inherit;

            border: .15rem solid #00000033;
            filter: blur(2px);

            z-index: 100000 !important;
        }
    }

    .btt.effect-e {
        overflow: hidden;
        mask-type: luminance;

        background-color: #FFFFFF99;
        mask-image: linear-gradient(30deg, transparent 0%, black 100%), linear-gradient(to top, transparent 0%, rgb(0 0 0 / 0.5) 100%);
        mix-blend-mode: overlay;

        z-index: 100001 !important;
    }

    .btt.effect-f {
        overflow: hidden;
        mask-type: luminance;

        mask-image: linear-gradient(-20deg, black 0%, transparent 35%, transparent 65%, black 100%);
        mix-blend-mode: darken;

        z-index: 100000 !important;

        .effect-g {
            position: fixed;
            width: inherit;
            height: inherit;
            bottom: inherit;
            right: inherit;
            border-radius: inherit;

            border: .15rem solid #000000AA;
            filter: blur(2px);

            z-index: 100000 !important;
        }
    }

    .btt.effect-h {
        overflow: visible !important;
        mask-type: luminance;

        mix-blend-mode: soft-light;

        z-index: 100001 !important;

        .effect-i {
            overflow: visible !important;
            position: fixed;
            width: inherit;
            height: inherit;
            bottom: inherit;
            right: inherit;
            border-radius: inherit;

            mask-image: linear-gradient(to top, transparent 80%, black 96%), linear-gradient(to bottom, transparent 80%, black 96%),
            linear-gradient(to left, transparent 92.5%, black 100%), linear-gradient(to right, transparent 92.5%, black 100%),
            radial-gradient(ellipse 8.35rem 3.35rem at 1.5rem, transparent 82.5%, black 92.5%, black 100%),
            radial-gradient(ellipse 8.35rem 3.35rem at 7.5rem, transparent 82.5%, black 92.5%, black 100%);

            filter: blur(2px);
            background-color: #ECF0F3;

            z-index: 100001 !important;
        }
    }

		.main-container, .screen-size-warning {
        position: fixed;
        bottom: 0;
        left: 0;

        padding-top: calc(var(--header-height) + 1px) !important;

        height: 100vh;
        width: 100vw;
        box-sizing: border-box;
		}

    .main-container {
        /*noinspection CssOverwrittenProperties*/
        overflow-y: scroll;
        /*noinspection CssOverwrittenProperties*/
        overflow-x: hidden !important;
        /*noinspection CssOverwrittenProperties*/
        overflow: auto;

        scrollbar-gutter: stable;

        background: var(--theme-ui-background);

        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: var(--header-height);
            background-image: linear-gradient(to bottom, var(--theme-ui-header) 0%, rgba(from var(--theme-ui-header) r g b / .75) 50%, transparent 100%);
            z-index: 99999;
        }
    }
</style>