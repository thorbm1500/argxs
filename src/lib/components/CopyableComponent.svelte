<script lang='ts' module>
	import { fade } from 'svelte/transition';
	import moment from 'moment';
	import { onMount } from 'svelte';
	import { copyToClipboard } from '$lib/utilities';
	
	let highlightedIcon: string | 'undefined' = $state.raw('undefined');
	let isRegistered: boolean = false;
	
	function register(document: Document) {
		if (!isRegistered && document) {
			document.addEventListener('click', (e) => {
				if (highlightedIcon === null) return;
				
				let element: HTMLElement | null = e.target as HTMLElement;
				
				while (element !== null) {
					if (!element.className.includes || element.className.includes('highlighted-icon')) return;
					element = element.parentElement;
				}
				
				highlightedIcon = 'undefined';
			});
			isRegistered = true;
		}
	}
</script>

<script lang='ts'>
	import { getContext } from 'svelte';
	
	const { path, name = undefined, href = undefined, source = undefined, date_added = undefined, blur_content_bg = false } = $props();
	
	const sendToast: any = $derived(getContext('sendToast'));
	
	//todo: Add manual loading for connections with reduced data usage
	//todo: navigator.connection.saveData
	
	function highlightClick(e: MouseEvent) {
		highlightedIcon = highlightedIcon === path ? 'undefined' : path;
		
		const mainContainer = document.getElementById('main-container');
		if (!mainContainer) return;
		
		mainContainer.scroll({ top: mainContainer.scrollTop + ((e.target as HTMLElement).getBoundingClientRect().top - 78), behavior: 'smooth' });
	}
	
	onMount(() => register(document));
</script>

{#if highlightedIcon !== 'undefined' && highlightedIcon === path}
	<div class='highlighted-icon' transition:fade>
		<button title='' class='close' onclick={() => (highlightedIcon = 'undefined')}>
			<svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
				<path d='M18 6L6 18M6 6L18 18' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/>
			</svg>
		</button>
		<div class='icon blurred'>
			<img src={path} alt={name} loading='eager'/>
		</div>
		<div class='icon'>
			<img src={path} alt={name} loading='eager'/>
		</div>
		<div class='actions-info'>
			<div class='actions'>
				<button class='copy' onclick={async () => {
					if (copyToClipboard(await (await fetch(path)).text())) sendToast?.({ message: 'Copied', duration: 1250, type: 'copy', status: 'success' });
				}}> Copy SVG
				</button>
				<a class='download' href={path} download> Download SVG</a>
			</div>
			<div class='info'>
				{#if source !== undefined}
					<div class='source'>
						<a href={source.href} rel='external' target='_blank'>Sourced from <strong>{source.name}</strong></a>
					</div>
				{/if}
				{#if date_added !== undefined}
					<div class='date'>
						<p>Added {moment(Date.parse(date_added)).calendar()}</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<div class='copyable-container'>
	<div class='actions'>
		{#if date_added && Date.parse(date_added) > (Date.now() - 432000000)}
			<p in:fade|global class='new-icon'>
				<svg width='24' height='24' viewBox='0 0 24 24' fill='currentColor'>
					<path
						d='M13 2l.018 .001l.016 .001l.083 .005l.011 .002h.011l.038 .009l.052 .008l.016 .006l.011 .001l.029 .011l.052 .014l.019 .009l.015 .004l.028 .014l.04 .017l.021 .012l.022 .01l.023 .015l.031 .017l.034 .024l.018 .011l.013 .012l.024 .017l.038 .034l.022 .017l.008 .01l.014 .012l.036 .041l.026 .027l.006 .009c.12 .147 .196 .322 .218 .513l.001 .012l.002 .041l.004 .064v6h5a1 1 0 0 1 .868 1.497l-.06 .091l-8 11c-.568 .783 -1.808 .38 -1.808 -.588v-6h-5a1 1 0 0 1 -.868 -1.497l.06 -.091l8 -11l.01 -.013l.018 -.024l.033 -.038l.018 -.022l.009 -.008l.013 -.014l.04 -.036l.028 -.026l.008 -.006a1 1 0 0 1 .402 -.199l.011 -.001l.027 -.005l.074 -.013l.011 -.001l.041 -.002z'/>
				</svg>
				NEW
			</p>
		{/if}
		{#if href}
			<!--svelte-ignore a11y_consider_explicit_label-->
			<a class='href' href={href} target='_blank' rel='external'>
				<svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
					<path
						d='M7.5 7H7C4.23858 7 2 9.23858 2 12C2 14.7614 4.23858 17 7 17H9C11.7614 17 14 14.7614 14 12M16.5 17H17C19.7614 17 22 14.7614 22 12C22 9.23858 19.7614 7 17 7H15C12.2386 7 10 9.23858 10 12'
						stroke='currentColor' stroke-width='2.15' stroke-linecap='round' stroke-linejoin='round'/>
				</svg>
			</a>
		{/if}
		<button class='info-button' onclick={highlightClick} title=''>
			<svg fill='none' height='24' viewBox='0 0 24 24' width='24'>
				<path
					d='M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6713 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13M12 17H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z'
					stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.15'/>
			</svg>
		</button>
		<button class='copy' onclick={async () => {
					if (copyToClipboard(await (await fetch(path)).text())) sendToast?.({ message: 'Copied', duration: 1250, type: 'copy', status: 'success' });
				}}> Copy SVG
		</button>
		<a class='download' download href={path}> Download SVG</a>
	</div>
	<div class='inner-content' in:fade>
		{#if blur_content_bg}
			<div in:fade|global class='blurred'>
				<div class='content'>
					<img src={path} alt={name} loading='lazy'/>
				</div>
			</div>
		{/if}
		<img alt={name} loading='lazy' src={path}/>
	</div>
	<h1 class='name'>{name}</h1>
</div>

<style>
    /* Desktop & Tablet */
    @media (width >= 44rem) {
	    .highlighted-icon {
		    height: 20rem;
		    width:  calc(100vw - var(--sidebar-width));
		    
		    .icon {
			    img {
				    height:     8rem;
				    max-height: 6rem;
			    }
		    }
	    }
	    
	    .copyable-container {
		    --box-size: 10rem;
		    padding:    1rem;
	    }
    }
    
    /* Phone */
    @media (width < 44rem) {
	    .highlighted-icon {
		    height: 20rem;
		    width:  100vw;
		    
		    .icon img {
			    height: 3.5rem;
		    }
	    }
	    
	    .copyable-container {
		    --box-size: 10rem;
		    padding:    1rem;
	    }
    }
    
    /* Phone */
    @media (width < 24rem) {
	    .copyable-container {
		    --box-size: 8.5rem;
	    }
    }
    
    .highlighted-icon {
	    position:        fixed;
	    
	    bottom:          0;
	    right:           0;
	    
	    backdrop-filter: blur(0.25rem) grayscale(0.15) brightness(0.85);
	    border-top:      1px solid var(--theme-ui-line);
	    
	    background:      linear-gradient(to top, rgba(from var(--theme-color-primary-reverse) r g b / 0.3) 0%, transparent 100%);
	    
	    z-index:         300;
	    
	    display:         flex;
	    flex-flow:       column nowrap;
	    align-items:     center;
	    justify-content: center;
	    
	    .close {
		    position: absolute;
		    top:      2rem;
		    right:    2rem;
		    
		    cursor:   pointer;
		    
		    svg {
			    height: 1.75rem;
			    width:  1.75rem;
		    }
		    
		    color:    var(--theme-color-primary);
	    }
	    
	    .close:hover {
		    color: var(--theme-color-alert);
	    }
	    
	    .icon {
		    display:     flex;
		    align-items: center !important;
		    height:      8rem;
		    width:       auto;
		    
		    margin:      1rem;
		    
		    img {
			    position:  relative;
			    
			    width:     100%;
			    max-width: 60vw;
		    }
	    }
	    
	    .icon.blurred {
		    position:       absolute;
		    height:         10rem;
		    width:          auto;
		    
		    filter:         blur(8rem) brightness(1);
		    
		    opacity:        0.5;
		    
		    z-index:        10;
		    
		    pointer-events: none !important;
	    }
	    
	    .actions {
		    display:         flex;
		    flex-flow:       row nowrap;
		    align-items:     center;
		    justify-content: center;
		    gap:             0.3rem;
		    
		    margin:          1rem 0 0.5rem 0;
		    
		    z-index:         300;
		    
		    .copy,
		    .download {
			    padding:         0.25rem 0.5rem;
			    border:          1px solid #4B66BB99;
			    border-radius:   0.7rem;
			    
			    cursor:          pointer;
			    
			    backdrop-filter: blur(6px) saturate(1.05) brightness(.75);
			    background:      light-dark(rgb(29 48 137 / .3), rgb(29 48 107 / .25));
			    color:           var(--theme-ui-white);
			    
			    font-weight:     600;
			    
			    z-index:         300;
			    
			    transition:      175ms ease-in;
		    }
		    
		    .copy:hover,
		    .download:hover {
			    backdrop-filter: blur(3px) saturate(1.1) brightness(1.05);
			    background:      rgb(29 48 107 / .25);
			    border-color:    #91ADFF;
			    background:      #2F51B255;
			    filter:          brightness(1.05);
			    transition:      35ms ease-out;
		    }
		    
		    .copy:active,
		    .download:active {
			    background: var(--theme-color-accent);
			    filter:     drop-shadow(0 0 0.75rem rgb(81 129 241 / 0.45));
			    transform:  scale(0.95);
			    transition: 50ms ease-out;
		    }
	    }
	    
	    .info {
		    display:         flex;
		    flex-flow:       row nowrap;
		    align-items:     center;
		    justify-content: center;
		    gap:             1.5rem;
		    height:          fit-content;
		    
		    margin-top: .75rem;
		    
		    color:           var(--theme-text-primary);
		    
		    z-index:         300;
	    }
    }
    
    
    .copyable-container {
	    display:         flex;
	    flex-flow:       row nowrap;
	    align-items:     center;
	    justify-content: center;
	    
	    height:          var(--box-size);
	    width:           var(--box-size);
	    
	    perspective:     250px;
	    border-radius:   0.45rem;
	    
	    box-sizing:      border-box;
	    
	    margin-bottom:   1.75rem;
	    
	    .name {
		    position:      absolute;
		    top:           calc(var(--box-size) + .25rem);
		    padding:       0 .5rem;
		    left:          0;
		    
		    width:         10rem !important;
		    max-height:    3rem !important;
		    overflow:      hidden;
		    
		    color:         var(--theme-text-third);
		    font-family:   'Google Sans', sans-serif;
		    font-weight:   700;
		    text-wrap:     pretty;
		    text-overflow: ellipsis;
		    line-clamp:    2 !important;
		    
		    align-items:   end;
	    }
	    
	    .actions {
		    position:        absolute;
		    
		    height:          var(--box-size);
		    width:           var(--box-size);
		    
		    display:         flex;
		    flex-flow:       column nowrap;
		    align-items:     center;
		    justify-content: center;
		    gap:             0.25rem;
		    
		    border:          1px solid var(--theme-ui-line);
		    border-radius:   0.45rem;
		    
		    z-index:         200;
		    
		    .new-icon {
			    position:          absolute;
			    top:               0.5rem;
			    left:              0.5rem;
			    
			    display:           flex;
			    align-items:       center;
			    justify-content:   flex-start;
			    gap:               .1rem;
			    
			    font-family:       'Funnel Display', sans-serif;
			    font-weight:       900;
			    font-size:         .75rem;
			    
			    color:             var(--theme-text-new);
			    background-repeat: repeat;
			    background-clip:   text;
			    padding:           .15rem .35rem;
			    
			    height:            fit-content;
			    
			    transition:        200ms ease-in;
			    
			    svg {
				    width:  .75rem;
				    height: .75rem;
			    }
		    }
		    
		    .href, .info-button {
			    position:   absolute;
			    top:        0.75rem;
			    
			    cursor:     pointer;
			    
			    color:      var(--theme-color-secondary);
			    filter:     blur(1px);
			    opacity:    0;
			    
			    transform:  scale(.9);
			    
			    transition: 250ms ease-in,
			                color 750ms ease-in;
		    }
		    
		    .info-button {
			    right: 0.75rem;
			    
			    svg {
				    width:  1.235rem;
				    height: 1.235rem;
			    }
		    }
		    
		    .href {
			    right: 2.15rem;
			    
			    svg {
				    width:     1.25rem;
				    height:    1.25rem;
				    
				    transform: rotate(-45deg);
			    }
		    }
		    
		    .href:hover, .info-button:hover {
			    filter:     none;
			    opacity:    1;
			    color:      var(--theme-color-primary);
			    transition: color 75ms ease-out;
		    }
		    
		    .href:active, .info-button:active {
			    color:      var(--theme-color-accent);
			    transition: color 0ms linear;
		    }
		    
		    .copy,
		    .download {
			    opacity:         0;
			    display:         flex;
			    align-items:     center;
			    justify-content: center;
			    align-content:   center;
			    gap:             0.2rem;
			    
			    width:           fit-content;
			    height:          fit-content;
			    padding:         0.185rem 0.45rem;
			    
			    color:           #F7F9FC;
			    font-family:     'Lexend', sans-serif;
			    text-rendering:  geometricPrecision;
			    font-weight:     550;
			    font-size:       0.8rem;
			    
			    border-radius:   0.75rem;
			    cursor:          pointer;
			    
			    background:      var(--theme-color-accent);
			    border:          1px solid transparent;
			    
			    filter:          blur(1px);
			    transform:       scale(0.9);
			    transition:      250ms ease-in;
		    }
		    
		    .copy:hover,
		    .download:hover {
			    border-color: #6091FA;
			    
			    transition:   50ms ease-out;
		    }
		    
		    transition:      200ms ease-in;
	    }
	    
	    .actions:hover .new-icon {
		    opacity:    .15;
		    filter: blur(2px);
		    transform: scale(.75rem);
		    transition: 35ms ease-out;
	    }
	    
	    .actions:hover,
	    .actions:active,
	    .actions:focus {
		    backdrop-filter: blur(0.115rem) grayscale(0.15) saturate(0.5);
		    
		    .copy,
		    .download,
		    .href,
		    .info-button {
			    opacity:    1;
			    filter:     none;
			    
			    transition: 75ms ease-out;
		    }
		    
		    .copy,
		    .download,
		    .href,
		    .info-button {
			    transform: scale(1);
		    }
		    
		    transition:      35ms ease-out;
	    }
	    
	    .inner-content {
		    position:   relative;
		    
		    img {
			    position: relative;
			    
			    height:   100%;
			    width:    100%;
		    }
		    
		    height:     100%;
		    min-height: 2.5rem;
		    max-height: 2.62rem;
		    width:      auto;
		    
		    max-width:  8rem;
		    
		    box-sizing: content-box;
		    
		    z-index:    100 !important;
		    
		    .blurred {
			    position:       absolute;
			    pointer-events: none !important;
			    z-index:        50;
			    
			    svg :global {
				    height: 100%;
				    width:  100%;
			    }
			    
			    perspective:    250px;
			    
			    .content {
				    filter:    blur(0.75rem) contrast(1.5) brightness(1.25);
				    opacity:   0.125;
				    
				    transform: rotate3d(1, 0, 0, 28deg) scale(1.35);
				    
				    z-index:   initial;
			    }
		    }
	    }
    }
    
    .dark .copyable-container {
	    background:   linear-gradient(to bottom, transparent 0%, #0F0F15 100%);
	    border-color: var(--theme-ui-line);
    }
</style>