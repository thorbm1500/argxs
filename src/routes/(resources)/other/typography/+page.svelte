<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import FontDisplayComponent from '$lib/components/FontDisplayComponent.svelte';

	let theme: 'light' | 'dark' = $state(getContext('theme'));

	let activePangram = $state.raw('');
	let activeFontSize = $state.raw(22);
	let activeFontWeight = $state.raw(500);
	let isItalic = $state.raw(false);
	let isLowercase = $state.raw(false);
	let isUppercase = $state.raw(false);

	onMount(async () => {
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
</script>


<section class="content-header {theme}">
	<div class="text">
		<h1 class="title">
			Typography
		</h1>
		<div class="subtitle">
			<!--todo: Write subtitle-->
			<p>argxs currently showcases <strong style="color:color-mix(var(--theme-text-third) 25%, var(--theme-color-accent) 75%);">9</strong> different fonts</p>
		</div>
	</div>
</section>

<section class="other-typography-sec">
	<div class="font-actions">
		<div class="action">
			Font Size
			<input type="range" bind:value={activeFontSize} min="12" max="42" />
		</div>
		<div class="action">
			Font Weight
			<input type="range" bind:value={activeFontWeight} min="300" max="900" />
		</div>
		<div class="action text-actions">
			<button class={{selected: isItalic}} onclick="{() => isItalic = !isItalic}" title="">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M11 5l6 0" />
					<path d="M7 19l6 0" />
					<path d="M14 5l-4 14" />
				</svg>
			</button>
			<button class={{selected: isLowercase}} onclick="{() => {
				isUppercase = false;
				isLowercase = !isLowercase;
			}}" title="">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M3 15.5a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0" />
					<path d="M10 12v7" />
					<path d="M14 15.5a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0" />
					<path d="M21 12v7" />
				</svg>
			</button>
			<button class={{selected: isUppercase}} onclick="{() => {
				isLowercase = false;
				isUppercase = !isUppercase;
			}}" title="">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<path d="M3 19v-10.5a3.5 3.5 0 0 1 7 0v10.5" />
					<path d="M3 13h7" />
					<path d="M14 19v-10.5a3.5 3.5 0 0 1 7 0v10.5" />
					<path d="M14 13h7" />
				</svg>
			</button>
		</div>
	</div>
	<FontDisplayComponent name="JetBrains Mono" font="JetBrainsMono" italic="JetBrainsMono-Italic" href="https://www.jetbrains.com/lp/mono/"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Funnel Sans" font="Funnel Sans" italic="Funnel Sans Italic" href="https://github.com/Dicotype/Funnel"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase />
	<FontDisplayComponent name="Funnel Display" font="Funnel Display" italic="none" href="https://github.com/Dicotype/Funnel"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Archivo" font="Archivo" italic="Archivo Italic" href="https://www.omnibus-type.com/fonts/archivo/"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Roboto" font="Roboto Variable" italic="none" href="https://github.com/googlefonts/roboto-3-classic"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Inter" font="Inter Variable" italic="Inter Variable Italic" href="https://rsms.me/inter/"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Space Grotesk" font="Space Grotesk Variable" italic="none" href="https://floriankarsten.github.io/space-grotesk/"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Outfit" font="Outfit Variable" italic="none" href="https://fonts.google.com/specimen/Outfit?preview.script=Latn"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Ubuntu" font="Ubuntu" italic="Ubuntu Italic" href="https://design.ubuntu.com/font"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
</section>

<style>
    .other-typography-sec {
        padding-right: 16rem;
        width: 100%;

        .font-actions {
            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            justify-content: center;
            gap: .75rem;

            position: fixed;
            right: 4rem;

            height: fit-content;
            width: 14rem;

            backdrop-filter: contrast(1.025);
            border: 1px solid var(--theme-ui-line);
            border-radius: .75rem;

            padding: 1rem;

            .action {
                display: flex;
                flex-flow: column nowrap;
                align-items: flex-start;
                justify-content: center;
                width: 100%;
                padding: .15rem .75rem;

                accent-color: var(--theme-color-accent);

								color: var(--theme-text-primary);

								input {
										width: 100%;
								}

                button {
                    cursor: pointer;

                    border: 1px solid var(--theme-ui-line);
                    border-radius: .75rem;

                    padding: .25rem;
                }
								button.selected {
										backdrop-filter: brightness(1.25);
										border-color: var(--theme-ui-line-highlight);
										color: var(--theme-color-accent);
								}
            }

            .action.text-actions {
                display: flex;
                flex-flow: row wrap;
                align-items: center;
                justify-content: flex-start;
                gap: .25rem;
            }
        }
    }
</style>