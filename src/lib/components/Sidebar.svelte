<script lang="ts">
	import { page } from '$app/state';
	import { afterNavigate, beforeNavigate } from '$app/navigation';

	let { theme = $bindable(), sidebarState = $bindable(), version = 'x.x.x', requests } = $props();

	let navState: 'active' | 'inactive' = $state.raw('inactive');

	beforeNavigate(() => navState = 'inactive');
	afterNavigate(() => navState = 'active');

	//todo: Implement rolling statistic

	// svelte-ignore state_referenced_locally
	const formattedRequests = requests.total.toLocaleString('da-DK');
	let requestChars: string[] = [];

	for (let i = 0; i < formattedRequests.length; i++) {
		requestChars.push(formattedRequests[i] ?? '');
	}
</script>

<div id="sidebar-light" class="{$state.eager(navState)}">
	<div id="sidebar-light-mask">
		<div id="light"></div>
	</div>
</div>

<section class="sidebar-section {theme} {sidebarState ? 'res-visible' : 'res-hidden'}">
	<div class="nav-top">
		<a data-sveltekit-replacestate class={{ selected: page.url.pathname === '/' }} href="/">
			<svg viewBox="0 0 24 24" fill="none">
				<path
					d="M12.9823 2.764C12.631 2.49075 12.4553 2.35412 12.2613 2.3016C12.0902 2.25526 11.9098 2.25526 11.7387 2.3016C11.5447 2.35412 11.369 2.49075 11.0177 2.764L4.23539 8.03912C3.78202 8.39175 3.55534 8.56806 3.39203 8.78886C3.24737 8.98444 3.1396 9.20478 3.07403 9.43905C3 9.70352 3 9.9907 3 10.5651V17.8C3 18.9201 3 19.4801 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.0799 21 6.2 21H8.2C8.48003 21 8.62004 21 8.727 20.9455C8.82108 20.8976 8.89757 20.8211 8.9455 20.727C9 20.62 9 20.48 9 20.2V13.6C9 13.0399 9 12.7599 9.10899 12.546C9.20487 12.3578 9.35785 12.2049 9.54601 12.109C9.75992 12 10.0399 12 10.6 12H13.4C13.9601 12 14.2401 12 14.454 12.109C14.6422 12.2049 14.7951 12.3578 14.891 12.546C15 12.7599 15 13.0399 15 13.6V20.2C15 20.48 15 20.62 15.0545 20.727C15.1024 20.8211 15.1789 20.8976 15.273 20.9455C15.38 21 15.52 21 15.8 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4801 21 18.9201 21 17.8V10.5651C21 9.9907 21 9.70352 20.926 9.43905C20.8604 9.20478 20.7526 8.98444 20.608 8.78886C20.4447 8.56806 20.218 8.39175 19.7646 8.03913L12.9823 2.764Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<p class="text" style="--bg-x: {Math.floor(Math.random() * 500) + 1000}%">Home</p>
		</a>
		<a data-sveltekit-replacestate class={{ selected: page.url.pathname === '/concept' }} href="/concept">
			<svg viewBox="0 0 24 24" fill="none">
				<path
					d="M13 2L4.09344 12.6879C3.74463 13.1064 3.57023 13.3157 3.56756 13.4925C3.56524 13.6461 3.63372 13.7923 3.75324 13.8889C3.89073 14 4.16316 14 4.70802 14H12L11 22L19.9065 11.3121C20.2553 10.8936 20.4297 10.6843 20.4324 10.5075C20.4347 10.3539 20.3663 10.2077 20.2467 10.1111C20.1092 10 19.8368 10 19.292 10H12L13 2Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<p class="text" style="--bg-x: {Math.floor(Math.random() * 500) + 1000}%">Core Concept</p>
		</a>
		<a data-sveltekit-replacestate class={{ selected: page.url.pathname === '/privacy' }} href="/privacy">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M3 11h18" />
				<path d="M5 11v-4a3 3 0 0 1 3 -3h8a3 3 0 0 1 3 3v4" />
				<path d="M4 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
				<path d="M14 17a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
				<path d="M10 17h4" />
			</svg>
			<p class="text" style="--bg-x: {Math.floor(Math.random() * 500) + 1000}%">Privacy</p>
		</a>
	</div>

	<div class="nav-section">
		<h1 class="title {page.url.pathname.startsWith('/icons') ? 'selected' : ''}">Icons</h1>
		<a data-sveltekit-replacestate class={{ selected: page.url.pathname === '/icons/flags' }} href="/icons/flags">
			<svg viewBox="0 0 24 24" fill="none">
				<path
					d="M4 15C4 15 5 14 8 14C11 14 13 16 16 16C19 16 20 15 20 15V4C20 4 19 5 16 5C13 5 11 3 8 3C5 3 4 4 4 4M4 22L4 2"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<p class="text" style="--bg-x: {Math.floor(Math.random() * 500) + 1000}%">Flags</p>
		</a>
		<a data-sveltekit-replacestate class={{ selected: page.url.pathname === '/icons/brands' }} href="/icons/brands">
			<svg viewBox="0 0 24 24" fill="none">
				<path
					d="M12.9996 10.9999L3.49964 20.4999M14.0181 3.53838C15.2361 4.34658 16.4068 5.29941 17.5008 6.3934C18.6042 7.49683 19.564 8.67831 20.3767 9.90766M9.2546 7.89605L6.37973 6.93776C6.04865 6.8274 5.68398 6.89763 5.41756 7.12306L2.56041 9.54065C1.97548 10.0356 2.14166 10.9775 2.86064 11.2424L5.56784 12.2398M11.6807 18.3524L12.6781 21.0596C12.943 21.7786 13.8849 21.9448 14.3798 21.3599L16.7974 18.5027C17.0228 18.2363 17.0931 17.8716 16.9827 17.5405L16.0244 14.6657M19.3482 2.27063L14.4418 3.08838C13.9119 3.17668 13.426 3.43709 13.0591 3.82932L6.446 10.8985C4.73185 12.7308 4.77953 15.5924 6.55378 17.3667C8.32803 19.1409 11.1896 19.1886 13.022 17.4744L20.0911 10.8614C20.4834 10.4944 20.7438 10.0085 20.8321 9.47869L21.6498 4.57222C21.8754 3.21858 20.7019 2.04503 19.3482 2.27063Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<p class="text" style="--bg-x: {Math.floor(Math.random() * 500) + 1000}%">Brands</p>
		</a>
	</div>

	<div class="nav-section">
		<h1 class="title {page.url.pathname.startsWith('/colors') ? 'selected' : ''}">Colors</h1>
		<div class={{ selected: page.url.pathname === '/colors/colors', in_progress: true }}>
			<svg viewBox="0 0 24 24" fill="none">
				<path
					d="M8.99997 11.2224L12.7778 15.0002M7.97485 20.975C6.60801 22.3419 4 22.0002 2 22.0002C3.0251 20.0002 1.65827 17.3921 3.0251 16.0253C4.39194 14.6585 6.60801 14.6585 7.97485 16.0253C9.34168 17.3921 9.34168 19.6082 7.97485 20.975ZM11.9216 15.9248L21.0587 6.05671C21.8635 5.18755 21.8375 3.83776 20.9999 3.00017C20.1624 2.16258 18.8126 2.13663 17.9434 2.94141L8.07534 12.0785C7.5654 12.5507 7.31043 12.7868 7.16173 13.0385C6.80514 13.6423 6.79079 14.3887 7.12391 15.0057C7.26283 15.2631 7.50853 15.5088 7.99995 16.0002C8.49136 16.4916 8.73707 16.7373 8.99438 16.8762C9.6114 17.2093 10.3578 17.195 10.9616 16.8384C11.2134 16.6897 11.4494 16.4347 11.9216 15.9248Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<p class="text" style="--bg-x: {Math.floor(Math.random() * 500) + 1000}%">Colors</p>
		</div>
		<div class={{ selected: page.url.pathname === '/colors/gradients', planned: true }}>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
			     class="icon icon-tabler icons-tabler-outline icon-tabler-color-swatch">
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M19 3h-4a2 2 0 0 0 -2 2v12a4 4 0 0 0 8 0v-12a2 2 0 0 0 -2 -2" />
				<path d="M13 7.35l-2 -2a2 2 0 0 0 -2.828 0l-2.828 2.828a2 2 0 0 0 0 2.828l9 9" />
				<path d="M7.3 13h-2.3a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h12" />
				<path d="M17 17l0 .01" />
			</svg>
			<p class="text" style="--bg-x: {Math.floor(Math.random() * 500) + 1000}%">Color Palettes</p>
		</div>
		<div class={{ selected: page.url.pathname === '/colors/gradients', planned: true }}>
			<svg viewBox="0 0 24 24" fill="none">
				<path
					d="M2 12C2 17.5228 6.47715 22 12 22C13.6569 22 15 20.6569 15 19V18.5C15 18.0356 15 17.8034 15.0257 17.6084C15.2029 16.2622 16.2622 15.2029 17.6084 15.0257C17.8034 15 18.0356 15 18.5 15H19C20.6569 15 22 13.6569 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M7 13C7.55228 13 8 12.5523 8 12C8 11.4477 7.55228 11 7 11C6.44772 11 6 11.4477 6 12C6 12.5523 6.44772 13 7 13Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M16 9C16.5523 9 17 8.55228 17 8C17 7.44772 16.5523 7 16 7C15.4477 7 15 7.44772 15 8C15 8.55228 15.4477 9 16 9Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M10 8C10.5523 8 11 7.55228 11 7C11 6.44772 10.5523 6 10 6C9.44772 6 9 6.44772 9 7C9 7.55228 9.44772 8 10 8Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<p class="text" style="--bg-x: {Math.floor(Math.random() * 500) + 1000}%">Gradients</p>
		</div>
	</div>

	<div class="nav-section">
		<h1 class="title {page.url.pathname.startsWith('/cheat-sheets') ? 'selected' : ''}">Cheat Sheets</h1>
		<a class={{ selected: page.url.pathname === '/cheat-sheets/transition-easing' }} href="/cheat-sheets/transition-easing">
			<svg viewBox="0 0 24 24" fill="currentColor">
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path
					d="M19 17a3 3 0 1 1 -2.829 4h-1.171a1 1 0 0 1 0 -2h1.17a3 3 0 0 1 2.83 -2m-14 -16c1.306 0 2.418 .835 2.83 2h1.17a1 1 0 1 1 0 2h-1.171a3.001 3.001 0 1 1 -2.829 -4m9 2a1 1 0 0 1 0 2h-2a1 1 0 0 1 0 -2zm-2 16a1 1 0 0 1 0 2h-2a1 1 0 0 1 0 -2z" />
				<path d="M21 3a1 1 0 0 1 0 2c-2.83 0 -4.6 1.845 -8.152 7.53c-3.947 6.315 -6.012 8.47 -9.848 8.47a1 1 0 0 1 0 -2c2.83 0 4.6 -1.845 8.152 -7.53c3.947 -6.315 6.012 -8.47 9.848 -8.47" />
			</svg>
			<p class="text" style="--bg-x: {Math.floor(Math.random() * 500) + 1000}%">Transition Easing</p>
		</a>
		<div class={{ selected: page.url.pathname === '/icons/brands', planned: true }}>
			<svg viewBox="0 0 24 24" fill="none">
				<path
					d="M12 2.50008V12.0001M12 12.0001L20.5 7.27779M12 12.0001L3.5 7.27779M12 12.0001V21.5001M20.5 16.7223L12.777 12.4318C12.4934 12.2742 12.3516 12.1954 12.2015 12.1645C12.0685 12.1372 11.9315 12.1372 11.7986 12.1645C11.6484 12.1954 11.5066 12.2742 11.223 12.4318L3.5 16.7223M21 16.0586V7.94153C21 7.59889 21 7.42757 20.9495 7.27477C20.9049 7.13959 20.8318 7.01551 20.7354 6.91082C20.6263 6.79248 20.4766 6.70928 20.177 6.54288L12.777 2.43177C12.4934 2.27421 12.3516 2.19543 12.2015 2.16454C12.0685 2.13721 11.9315 2.13721 11.7986 2.16454C11.6484 2.19543 11.5066 2.27421 11.223 2.43177L3.82297 6.54288C3.52345 6.70928 3.37369 6.79248 3.26463 6.91082C3.16816 7.01551 3.09515 7.13959 3.05048 7.27477C3 7.42757 3 7.59889 3 7.94153V16.0586C3 16.4013 3 16.5726 3.05048 16.7254C3.09515 16.8606 3.16816 16.9847 3.26463 17.0893C3.37369 17.2077 3.52345 17.2909 3.82297 17.4573L11.223 21.5684C11.5066 21.726 11.6484 21.8047 11.7986 21.8356C11.9315 21.863 12.0685 21.863 12.2015 21.8356C12.3516 21.8047 12.4934 21.726 12.777 21.5684L20.177 17.4573C20.4766 17.2909 20.6263 17.2077 20.7354 17.0893C20.8318 16.9847 20.9049 16.8606 20.9495 16.7254C21 16.5726 21 16.4013 21 16.0586Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<p class="text" style="--bg-x: {Math.floor(Math.random() * 500) + 1000}%">Flexbox Layout</p>
		</div>
		<div class={{planned: true }}>
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M19 6C19.5523 6 20 5.55228 20 5C20 4.44772 19.5523 4 19 4C18.4477 4 18 4.44772 18 5C18 5.55228 18.4477 6 19 6Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M19 20C19.5523 20 20 19.5523 20 19C20 18.4477 19.5523 18 19 18C18.4477 18 18 18.4477 18 19C18 19.5523 18.4477 20 19 20Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M5 6C5.55228 6 6 5.55228 6 5C6 4.44772 5.55228 4 5 4C4.44772 4 4 4.44772 4 5C4 5.55228 4.44772 6 5 6Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M5 20C5.55228 20 6 19.5523 6 19C6 18.4477 5.55228 18 5 18C4.44772 18 4 18.4477 4 19C4 19.5523 4.44772 20 5 20Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<p class="text" style="--bg-x: {Math.floor(Math.random() * 500) + 1000}%">Grid Layout</p>
		</div>
		<div class={{planned: true }}>
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path stroke="none" d="M0 0h24v24H0z" fill="none" />
				<path d="M14 3v4a1 1 0 0 0 1 1h4" />
				<path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4" />
				<path d="M8 16.5a1.5 1.5 0 0 0 -3 0v3a1.5 1.5 0 0 0 3 0" />
				<path d="M11 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75" />
				<path d="M17 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75" />
			</svg>
			<p class="text" style="--bg-x: {Math.floor(Math.random() * 500) + 1000}%">CSS Guide</p>
		</div>
	</div>

	<div class="nav-section">
		<h1 class="title {page.url.pathname.startsWith('/other') ? 'selected' : ''}">Other</h1>
		<a data-sveltekit-replacestate class={{ selected: page.url.pathname === '/other/typography' }} href="/other/typography">
			<svg viewBox="0 0 24 24" fill="none">
				<path
					d="M4 7C4 6.06812 4 5.60218 4.15224 5.23463C4.35523 4.74458 4.74458 4.35523 5.23463 4.15224C5.60218 4 6.06812 4 7 4H17C17.9319 4 18.3978 4 18.7654 4.15224C19.2554 4.35523 19.6448 4.74458 19.8478 5.23463C20 5.60218 20 6.06812 20 7M9 20H15M12 4V20"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<p class="text" style="--bg-x: {Math.floor(Math.random() * 500) + 1000}%">Typography</p>
		</a>
		<div class={{ selected: page.url.pathname === '/other/external', planned: true }}>
			<svg viewBox="0 0 24 24" fill="none">
				<path
					d="M9.99999 13C10.4294 13.5741 10.9773 14.0491 11.6065 14.3929C12.2357 14.7367 12.9315 14.9411 13.6466 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9547 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.4791 3.53087C19.552 2.60383 18.298 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.46997L11.75 5.17997M14 11C13.5705 10.4258 13.0226 9.95078 12.3934 9.60703C11.7642 9.26327 11.0685 9.05885 10.3533 9.00763C9.63819 8.95641 8.9204 9.0596 8.24864 9.31018C7.57688 9.56077 6.96687 9.9529 6.45999 10.46L3.45999 13.46C2.5492 14.403 2.04522 15.666 2.05662 16.977C2.06801 18.288 2.59385 19.542 3.52089 20.4691C4.44793 21.3961 5.702 21.9219 7.01298 21.9333C8.32396 21.9447 9.58697 21.4408 10.53 20.53L12.24 18.82"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<p class="text" style="--bg-x: {Math.floor(Math.random() * 500) + 1000}%">External</p>
		</div>
	</div>

	<div class="version">
		<nav class="github">
			<a href="https://github.com/thorbm1500/argxs" target="_blank" rel="external">
				<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none">
					<path
						d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
						fill-rule="evenodd"
						clip-rule="evenodd"
						transform="scale(64)"
						fill="currentColor"
					/>
				</svg>
				GitHub
			</a>
		</nav>
		<div class="metrics">
			<div class="metrics-text">
				<p class="title">Visitor Count</p>
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M6.5 13L7.28446 14.5689C7.54995 15.0999 7.68269 15.3654 7.86003 15.5954C8.01739 15.7996 8.20041 15.9826 8.40455 16.14C8.63462 16.3173 8.9001 16.4501 9.43108 16.7155L11 17.5L9.43108 18.2845C8.9001 18.5499 8.63462 18.6827 8.40455 18.86C8.20041 19.0174 8.01739 19.2004 7.86003 19.4046C7.68269 19.6346 7.54995 19.9001 7.28446 20.4311L6.5 22L5.71554 20.4311C5.45005 19.9001 5.31731 19.6346 5.13997 19.4046C4.98261 19.2004 4.79959 19.0174 4.59545 18.86C4.36538 18.6827 4.0999 18.5499 3.56892 18.2845L2 17.5L3.56892 16.7155C4.0999 16.4501 4.36538 16.3173 4.59545 16.14C4.79959 15.9826 4.98261 15.7996 5.13997 15.5954C5.31731 15.3654 5.45005 15.0999 5.71554 14.5689L6.5 13Z"
						stroke="currentColor"
						stroke-width="2.1"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path
						d="M15 2L16.1786 5.06442C16.4606 5.79765 16.6016 6.16426 16.8209 6.47264C17.0153 6.74595 17.254 6.98475 17.5274 7.17909C17.8357 7.39836 18.2024 7.53937 18.9356 7.82138L22 9L18.9356 10.1786C18.2024 10.4606 17.8357 10.6016 17.5274 10.8209C17.254 11.0153 17.0153 11.254 16.8209 11.5274C16.6016 11.8357 16.4606 12.2024 16.1786 12.9356L15 16L13.8214 12.9356C13.5394 12.2024 13.3984 11.8357 13.1791 11.5274C12.9847 11.254 12.746 11.0153 12.4726 10.8209C12.1643 10.6016 11.7976 10.4606 11.0644 10.1786L8 9L11.0644 7.82138C11.7976 7.53937 12.1643 7.39836 12.4726 7.17909C12.746 6.98475 12.9847 6.74595 13.1791 6.47264C13.3984 6.16426 13.5394 5.79765 13.8214 5.06442L15 2Z"
						stroke="currentColor"
						stroke-width="2.55"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>

			</div>
			<div class="metrics-value">
				{#each requestChars as char}
					<p class="value {char === '.' ? 'dot' : 'number'}">{char}</p>
				{/each}
			</div>
		</div>
		<p class="version-text">ver. {version}</p>
	</div>
</section>

<style>
    /* Desktop & Tablet */
    @media (width >= 44rem) {
        :root :global {
            --sidebar-width: 18.5rem;
        }

        #sidebar-light {
            position: absolute;
            top: 0;
            left: calc(18.5rem - 4px);
            pointer-events: none !important;

            overflow: visible;

            height: 0 !important;
            width: 0 !important;

            z-index: 99998;

            #sidebar-light-mask, #light {
                animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
            }

            #sidebar-light-mask {
                position: absolute;
                content: '';

                align-self: center;
                align-content: center;

                filter: saturate(1.5);
                mask-image: linear-gradient(0deg, transparent 30%, white 50%, transparent 70%);
                mask-mode: alpha;

                height: 60vh;
                transform: translateY(-12.5vh);
                opacity: 0;
                width: 8px;

                z-index: 99999;

                #light {
                    justify-self: center;
                    width: 1px !important;
                    height: 50vh;
                    filter: saturate(1.1) contrast(1.05) brightness(1);
                    background-repeat: repeat-y;
                    background-image: linear-gradient(0deg, rgb(222, 168, 248) 0%, rgb(168, 222, 248) 21.8%, rgb(189, 250, 205) 35.6%, rgb(243, 250, 189) 52.9%, rgb(250, 227, 189) 66.8%, rgb(248, 172, 172) 90%, rgb(254, 211, 252) 99.7%);
                }
            }
        }

        #sidebar-light.active #sidebar-light-mask {
            animation: sidebarNavAnim 1.65s;

            #light {
                animation: sidebarNavLightAnim 1.65s;
            }
        }

        #sidebar-light.inactive {
            #sidebar-light-mask, #sidebar-light-mask #light {
                animation: none;
            }
        }

        .sidebar-section {
            width: var(--sidebar-width);

            border-right: 1px solid var(--theme-ui-line);

            .version {
                width: var(--sidebar-width);

                .github {
                    visibility: hidden;
                    position: absolute;
                }

                .version-text {
                    font-size: 0.75rem;
                }
            }

            .nav-section, .nav-top {
                .title {
                    font-size: .85rem;
                    font-weight: 500;
                    padding-left: .25rem;
                }

                a, .planned, .in_progress {
                    padding: 1rem 0.6rem;
                    font-size: 1rem;
                    font-weight: 500;
                    text-wrap: nowrap;

                    svg {
                        height: 1.15rem;
                        width: 1.15rem;

                        margin-right: 0.15rem;
                    }
                }

                .planned::after, .in_progress::after {
                    font-size: 0.65rem;
                    font-weight: 700;
                    padding: 0.25rem 0.5rem;
                }
            }
        }

        @keyframes sidebarNavAnim {
            0% {
                height: 60vh;
                transform: translateY(-12.5vh)
            }
            50% {
                height: 90vh;
            }
            100% {
                height: 60vh;
                transform: translateY(115vh);
            }
            0%, 100% {
                opacity: 0;
            }
            3.5%, 96.5% {
                opacity: 1;
            }
        }

        @keyframes sidebarNavLightAnim {
            0% {
                height: 50vh !important;
                background-position-y: 115vh;
            }
            50% {
                height: 80vh !important;
            }
            100% {
                height: 50vh !important;
                background-position-y: -12.5vh;
            }
        }
    }

    /* Phone */
    @media (width < 44rem) {
        :root :global {
            --sidebar-width: 0;
        }

        .sidebar-section.res-hidden {
            transform: translateX(-150vw);
            transition: 200ms cubic-bezier(0.6, 0.04, 0.98, 0.335);
        }

        .sidebar-section.res-visible {
            transform: translateX(0);
            transition: 100ms cubic-bezier(0.075, 0.82, 0.165, 1);
        }

        .sidebar-section {
            width: 100vw;
            border: none;

            .title {
                font-size: .9rem;
                font-weight: 550;
            }

            .version {
                width: 100vw;

                .github {
                    visibility: visible;
                }

                .version-text {
                    font-size: 0.8rem;
                }
            }

            a, .planned, .in_progress {
                padding: 1.3rem 0.85rem;
                font-size: 1.15rem;
                font-weight: 700;

                svg {
                    height: 1.35rem;
                    width: 1.35rem;

                    margin-right: 0.25rem;
                }
            }

            .planned::after, .in_progress::after {
                font-size: 0.8rem;
                font-weight: 550;
                padding: 0.275rem 0.575rem;
            }
        }
    }

    .nav-section, .nav-top {
        a:hover, a.selected,
        .planned:hover, .in_progress:hover {
            .text {
                background-image: radial-gradient(circle at 10% 20%, rgb(174 110 204) 0%, rgb(62 175 229) 28.8%, rgb(45 208 51) 45.6%, rgb(224 196 16) 65.9%, rgb(255 143 28) 75.8%, rgb(222 70 70) 80%, rgb(255 123 249) 85.7%);
            }
        }
    }

    .dark .nav-section, .dark .nav-top {
        a:hover, a.selected,
        .planned:hover, .in_progress:hover {
            .text {
                background-image: radial-gradient(circle at 10% 20%, rgb(222, 168, 248) 0%, rgb(168, 222, 248) 21.8%, rgb(189, 250, 205) 35.6%, rgb(243, 250, 189) 52.9%, rgb(250, 227, 189) 66.8%, rgb(248, 172, 172) 90%, rgb(254, 211, 252) 99.7%);
            }
        }
    }

    .sidebar-section {
        position: absolute;
        box-sizing: border-box;

        height: calc(100vh - var(--header-height));
        bottom: 0;
        padding: 1.5rem 1.25rem 0 1.5rem;

        background: var(--theme-ui-sidebar);

        display: flex;
        flex-flow: column nowrap;
        align-items: flex-start;
        justify-content: flex-start;

        user-select: none !important;

        overflow-y: scroll;
        overflow-x: hidden;
        scrollbar-width: none;

        z-index: 89999;

        .version {
            margin-top: 1.5rem;

            height: fit-content;
            width: 100%;

            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            justify-content: center;

            .github {
                svg {
                    width: 1.25rem;
                    height: 1.25rem;
                }
            }

            .metrics {
                margin-bottom: .5rem;
                width: fit-content;
                height: fit-content;

                .metrics-text {
                    display: flex;
                    align-items: center;
                    gap: .12rem;

                    text-rendering: geometricPrecision;
                    font-family: 'Funnel Display', 'Funnel Sans', sans-serif;
                    font-size: .85rem;
                    font-weight: 750;
                    color: transparent;
                    background-clip: text;
                    background-image: linear-gradient(-8.5deg, color-mix(var(--theme-text-third), #262a38 5%) 0%, color-mix(var(--theme-text-third), var(--theme-text-secondary) 25%) 100%);
                    margin-bottom: .145rem;

                    svg {
                        color: var(--theme-text-third);
                        height: 1rem;
                        width: 1rem;
                        margin-bottom: .175rem;
                        transform: rotate(-10.5deg);
                    }
                }

                .metrics-value {
                    display: flex;
                    flex-flow: row nowrap;
                    align-items: end;
                    justify-content: center;

                    font-family: "Bricolage Grotesque", sans-serif;
                    font-size: 1.25rem;
                    font-weight: 1000;

                    color: var(--theme-text-secondary);

                    .value {
                        display: flex;
                        flex-flow: row nowrap;
                        justify-content: center;
                        margin: 0 .125rem;
                        width: fit-content;

                        background: linear-gradient(to top, rgba(from var(--theme-text-third) r g b / .4) 0%, rgba(from var(--theme-text-third) r g b / .6) 100%);
                        border: 1px solid var(--theme-text-third);
                        border-radius: .25rem;
                    }

                    .number {
                        display: flex;
                        align-items: center;
                        height: 2rem;
                        width: 1.15rem;
                    }

                    .dot {
                        color: transparent;
                        align-items: anchor-center;
                        height: .75rem;
                        width: .75rem;
                    }

                    .dot::after {
                        position: relative;
                        content: ".";
                        color: var(--theme-text-secondary);
                        right: 2px;
                        top: -5px;
                    }
                }
            }

            .version-text {
                color: var(--theme-text-third);
                font-weight: 550;
            }
        }

        .nav-top {
            display: flex;
            flex-flow: column nowrap;
            align-items: flex-start;
            justify-content: flex-start;
            width: 100%;
        }

        .nav-top::after, .nav-section:not(:last-child)::after {
            content: '';

            position: relative;
            align-self: center;

            width: 80%;
            height: 3px;
            margin-top: .325rem;
            margin-bottom: .325rem;

            background: linear-gradient(to top, rgba(from var(--theme-text-third) r g b / .25) 0%, var(--theme-text-third) 50%, rgba(from var(--theme-text-third) r g b / .25) 100%);
            opacity: .1875;
            border-radius: 4px;
        }

        .nav-section {
            display: flex;
            flex-flow: column nowrap;
            align-items: flex-start;
            justify-content: flex-start;
            width: 100%;
            margin-top: 1rem;

            .title {
                color: var(--theme-text-secondary);
                margin-bottom: 0.25rem;
                font-family: 'Funnel Sans', sans-serif;
            }

            .title.selected {
                color: var(--theme-text-primary);
            }
        }

        .planned, .in_progress {
            cursor: no-drop;
        }

        a, .planned, .in_progress {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            justify-content: flex-start;
            gap: 0.25rem;

            height: 1.5rem;
            width: 100%;

            border-radius: 0.8rem;
            margin-bottom: 0.25rem;

            color: var(--theme-text-secondary);

            font-family: 'Funnel Sans', sans-serif;
            transition: var(--theme-transition-off);
        }

        a.selected,
        a:hover,
        .planned:hover,
        .in_progress:hover {
            background: linear-gradient(to left, var(--theme-ui-sidebar-highlight) 15%, color-mix(var(--theme-ui-sidebar-highlight), var(--theme-color-primary) 5%) 100%);
            transition: var(--theme-transition-on);

            .text {
                color: transparent;
                background-clip: text;
                background-repeat: repeat;
                background-size: 1500% 1500%;

                transition: var(--theme-transition-on);
                animation: backgroundScroll 40s linear infinite;
            }
        }

        .planned:hover::after, .in_progress:hover::after {
            background: var(--theme-ui-container);
            transition: var(--theme-transition-on);
        }

        .planned::after {
            content: 'Planned';
            color: var(--theme-text-secondary);
            transition: var(--theme-transition-off);
        }

        .in_progress::after {
            content: 'In Progress';
            color: var(--theme-ui-white);
            background: var(--theme-color-aware);

            transition: var(--theme-transition-off);
        }

        .planned::after, .in_progress::after {
            backdrop-filter: brightness(1.25) !important;
            border-radius: 0.625rem;
            transform: translateX(0.25rem);

            align-self: center;
            margin-left: auto;

            transition: var(--theme-transition-off);
        }

        a.planned.selected::after, a.in_progress.selected::after {
            color: var(--theme-color-accent);
            background: var(--theme-ui-container);
            transition: var(--theme-transition-off);
        }
    }

    @keyframes backgroundScroll {
        0% {
            background-position-x: var(--bg-x);
        }
        100% {
            background-position-x: calc(var(--bg-x) * -1);
        }
    }
</style>