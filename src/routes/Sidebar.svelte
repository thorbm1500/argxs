<script lang="ts">
	import {page} from '$app/state';

	let { version = 'x.x.x' } = $props();
</script>

<section class="sidebar-section">
	<div class="version">ver. {version}</div>

	<div class="nav-top">
		<a class={{selected: page.url.pathname === '/'}} href="/" target="_self">
			<svg class="theme-custom-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M12.9823 2.764C12.631 2.49075 12.4553 2.35412 12.2613 2.3016C12.0902 2.25526 11.9098 2.25526 11.7387 2.3016C11.5447 2.35412 11.369 2.49075 11.0177 2.764L4.23539 8.03912C3.78202 8.39175 3.55534 8.56806 3.39203 8.78886C3.24737 8.98444 3.1396 9.20478 3.07403 9.43905C3 9.70352 3 9.9907 3 10.5651V17.8C3 18.9201 3 19.4801 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.0799 21 6.2 21H8.2C8.48003 21 8.62004 21 8.727 20.9455C8.82108 20.8976 8.89757 20.8211 8.9455 20.727C9 20.62 9 20.48 9 20.2V13.6C9 13.0399 9 12.7599 9.10899 12.546C9.20487 12.3578 9.35785 12.2049 9.54601 12.109C9.75992 12 10.0399 12 10.6 12H13.4C13.9601 12 14.2401 12 14.454 12.109C14.6422 12.2049 14.7951 12.3578 14.891 12.546C15 12.7599 15 13.0399 15 13.6V20.2C15 20.48 15 20.62 15.0545 20.727C15.1024 20.8211 15.1789 20.8976 15.273 20.9455C15.38 21 15.52 21 15.8 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4801 21 18.9201 21 17.8V10.5651C21 9.9907 21 9.70352 20.926 9.43905C20.8604 9.20478 20.7526 8.98444 20.608 8.78886C20.4447 8.56806 20.218 8.39175 19.7646 8.03913L12.9823 2.764Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			Home
		</a>
		<a class={{selected: page.url.pathname === '/concept'}} href="/concept" target="_self">
			<svg class="theme-custom-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M13 2L4.09344 12.6879C3.74463 13.1064 3.57023 13.3157 3.56756 13.4925C3.56524 13.6461 3.63372 13.7923 3.75324 13.8889C3.89073 14 4.16316 14 4.70802 14H12L11 22L19.9065 11.3121C20.2553 10.8936 20.4297 10.6843 20.4324 10.5075C20.4347 10.3539 20.3663 10.2077 20.2467 10.1111C20.1092 10 19.8368 10 19.292 10H12L13 2Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			Core Concept
		</a>
	</div>

	<div class="nav-section">
		<h1 class="title {page.url.pathname.startsWith('/icons') ? 'selected' : ''}">Icons</h1>
		<a class={{selected: page.url.pathname === '/icons/flags'}} href="/icons/flags" target="_self">
			<svg class="theme-custom-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M4 15C4 15 5 14 8 14C11 14 13 16 16 16C19 16 20 15 20 15V4C20 4 19 5 16 5C13 5 11 3 8 3C5 3 4 4 4 4M4 22L4 2"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			Flags
		</a>
		<a class={{selected: page.url.pathname === '/icons/brands'}} href="/icons/brands" target="_self">
			<svg class="theme-custom-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M12.9996 10.9999L3.49964 20.4999M14.0181 3.53838C15.2361 4.34658 16.4068 5.29941 17.5008 6.3934C18.6042 7.49683 19.564 8.67831 20.3767 9.90766M9.2546 7.89605L6.37973 6.93776C6.04865 6.8274 5.68398 6.89763 5.41756 7.12306L2.56041 9.54065C1.97548 10.0356 2.14166 10.9775 2.86064 11.2424L5.56784 12.2398M11.6807 18.3524L12.6781 21.0596C12.943 21.7786 13.8849 21.9448 14.3798 21.3599L16.7974 18.5027C17.0228 18.2363 17.0931 17.8716 16.9827 17.5405L16.0244 14.6657M19.3482 2.27063L14.4418 3.08838C13.9119 3.17668 13.426 3.43709 13.0591 3.82932L6.446 10.8985C4.73185 12.7308 4.77953 15.5924 6.55378 17.3667C8.32803 19.1409 11.1896 19.1886 13.022 17.4744L20.0911 10.8614C20.4834 10.4944 20.7438 10.0085 20.8321 9.47869L21.6498 4.57222C21.8754 3.21858 20.7019 2.04503 19.3482 2.27063Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			Brands
		</a>
	</div>

	<div class="nav-section">
		<h1 class="title {page.url.pathname.startsWith('/colors') ? 'selected' : ''}">Colors</h1>
		<a class={{selected: page.url.pathname === '/colors/general'}} href="/colors/general" target="_self">
			<svg class="theme-custom-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M8.99997 11.2224L12.7778 15.0002M7.97485 20.975C6.60801 22.3419 4 22.0002 2 22.0002C3.0251 20.0002 1.65827 17.3921 3.0251 16.0253C4.39194 14.6585 6.60801 14.6585 7.97485 16.0253C9.34168 17.3921 9.34168 19.6082 7.97485 20.975ZM11.9216 15.9248L21.0587 6.05671C21.8635 5.18755 21.8375 3.83776 20.9999 3.00017C20.1624 2.16258 18.8126 2.13663 17.9434 2.94141L8.07534 12.0785C7.5654 12.5507 7.31043 12.7868 7.16173 13.0385C6.80514 13.6423 6.79079 14.3887 7.12391 15.0057C7.26283 15.2631 7.50853 15.5088 7.99995 16.0002C8.49136 16.4916 8.73707 16.7373 8.99438 16.8762C9.6114 17.2093 10.3578 17.195 10.9616 16.8384C11.2134 16.6897 11.4494 16.4347 11.9216 15.9248Z"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			General
		</a>
		<a class={{selected: page.url.pathname === '/colors/gradients'}} href="/colors/gradients" target="_self">
			<svg class="theme-custom-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
			Gradients
		</a>
	</div>

	<div class="nav-section">
		<h1 class="title {page.url.pathname.startsWith('/other') ? 'selected' : ''}">Other</h1>
		<a class={{selected: page.url.pathname === '/other/typography'}} href="/other/typography" target="_self">
			<svg class="theme-custom-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M4 7C4 6.06812 4 5.60218 4.15224 5.23463C4.35523 4.74458 4.74458 4.35523 5.23463 4.15224C5.60218 4 6.06812 4 7 4H17C17.9319 4 18.3978 4 18.7654 4.15224C19.2554 4.35523 19.6448 4.74458 19.8478 5.23463C20 5.60218 20 6.06812 20 7M9 20H15M12 4V20"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			Typography
		</a>
		<a class={{selected: page.url.pathname === '/other/external'}} href="/other/external" target="_self">
			<svg class="theme-custom-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M9.99999 13C10.4294 13.5741 10.9773 14.0491 11.6065 14.3929C12.2357 14.7367 12.9315 14.9411 13.6466 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9547 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.4791 3.53087C19.552 2.60383 18.298 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.46997L11.75 5.17997M14 11C13.5705 10.4258 13.0226 9.95078 12.3934 9.60703C11.7642 9.26327 11.0685 9.05885 10.3533 9.00763C9.63819 8.95641 8.9204 9.0596 8.24864 9.31018C7.57688 9.56077 6.96687 9.9529 6.45999 10.46L3.45999 13.46C2.5492 14.403 2.04522 15.666 2.05662 16.977C2.06801 18.288 2.59385 19.542 3.52089 20.4691C4.44793 21.3961 5.702 21.9219 7.01298 21.9333C8.32396 21.9447 9.58697 21.4408 10.53 20.53L12.24 18.82"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			External
		</a>
	</div>
</section>

<style>
	.sidebar-section {
			position: absolute;

      height: calc(100vh - 3rem);
			width: 14rem;
			top: 3rem;
			padding: 1.5rem;

			border-right: 1px solid var(--theme-ui-line);

			display: flex;
			flex-flow: column nowrap;
			align-items: flex-start;
			justify-content: flex-start;
			gap: 1rem;

			.version {
					position: absolute;
					bottom: 1rem;
					align-self: center;
					width: fit-content;

					color: var(--theme-text-third);
					font-family: 'Lexend', sans-serif;
					font-size: .75rem;
					font-weight: 550;
			}

			.nav-top {
          display: flex;
          flex-flow: column nowrap;
          align-items: flex-start;
          justify-content: flex-start;
			}

			.nav-section {
          display: flex;
          flex-flow: column nowrap;
          align-items: flex-start;
          justify-content: flex-start;

					.title {
							font-size: .95rem;
              color: var(--theme-text-secondary);
							margin-bottom: .25rem;
					}

					.title.selected {
							color: var(--theme-text-primary);
					}

					a {
							height: 1.5rem;
							padding-left: .5rem;
							margin-left: .25rem;
							border-left: 2px solid var(--theme-ui-line);
					}

					a.selected,a:hover {
							border-left-color: var(--theme-ui-line-highlight);
					}
			}

			a {
					display: flex;
					flex-flow: row nowrap;
					align-items: center;
					justify-content: center;
					font-size: .9rem;
					font-weight: 375;
					color: var(--theme-text-secondary);
			}

			a.selected,a:hover {
					color: var(--theme-text-primary);
			}
	}
</style>