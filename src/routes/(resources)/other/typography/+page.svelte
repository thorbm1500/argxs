<script lang="ts">
	import FontDisplayComponent from '$lib/components/FontDisplayComponent.svelte';
	import ContentHeaderComponent from '$lib/components/ContentHeaderComponent.svelte';

	let activePangram = $state.raw('');
	let activeFontSize = $state.raw(20);
	let activeFontWeight = $state.raw(500);
	let isItalic = $state.raw(false);
	let isLowercase = $state.raw(false);
	let isUppercase = $state.raw(false);
</script>

<ContentHeaderComponent title="Typography" type="fonts" amount={36} />

<section class="other-typography-sec">
	<div class="font-actions">
		<div class="action">
			Font Size
			<input type="range" bind:value={activeFontSize} min="12" max="42" />
		</div>
		<div class="action">
			Font Weight
			<input type="range" bind:value={activeFontWeight} min="100" max="1000" />
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
	<FontDisplayComponent name="Sora" font="Sora Variable" italic="none" href="https://github.com/sora-xor/sora-font"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Mulish" font="Mulish Variable" italic="none" href="https://github.com/googlefonts/mulish"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Lexend" font="Lexend Variable" italic="none" href="https://github.com/googlefonts/lexend"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Bricolage Grotesque" font="Bricolage Grotesque Variable" italic="none" href="https://github.com/ateliertriay/bricolage"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Syne" font="Syne Variable" italic="none" href="https://gitlab.com/bonjour-monde/fonderie/syne-typeface"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Chivo" font="Chivo Variable" italic="none" href="https://github.com/Omnibus-Type/Chivo"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Jura" font="Jura Variable" italic="none" href="https://github.com/ossobuffo/jura"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Azeret Mono" font="Azeret Mono Variable" italic="none" href="https://github.com/displaay/azeret"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Zalando Sans Expanded" font="Zalando Sans Expanded Variable" italic="none" href="https://github.com/zalando/sans"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Grandstander" font="Grandstander Variable" italic="none" href="https://github.com/Etcetera-Type-Co/Grandstander"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Unbounded" font="Unbounded Variable" italic="none" href="https://github.com/googlefonts/unbounded"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Pixelify Sans" font="Pixelify Sans Variable" italic="none" href="https://github.com/eifetx/Pixelify-Sans"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Exo" font="Exo Variable" italic="none" href="https://github.com/NDISCOVER/Exo-1.0"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Gabarito" font="Gabarito Variable" italic="none" href="https://github.com/naipefoundry/gabarito"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Darker Grotesque" font="Darker Grotesque Variable" italic="none" href="https://github.com/bettergui/DarkerGrotesque"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="MuseoModerno" font="MuseoModerno Variable" italic="none" href="https://github.com/Omnibus-Type/MuseoModerno"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Stack Sans Headline" font="Stack Sans Headline Variable" italic="none" href="https://github.com/DylanYoungKoto/Stack-Sans"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Stack Sans Text" font="Stack Sans Text Variable" italic="none" href="https://github.com/DylanYoungKoto/Stack-Sans"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Stack Sans Notch" font="Stack Sans Notch Variable" italic="none" href="https://github.com/DylanYoungKoto/Stack-Sans"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Alan Sans" font="Alan Sans Variable" italic="none" href="https://github.com/alan-eu/Alan-Sans"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Geom" font="Geom Variable" italic="none" href="https://github.com/ThanosPoulakidas/Geom"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Sometype Mono" font="Sometype Mono Variable" italic="none" href="https://github.com/googlefonts/sometype-mono"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Kode Mono" font="Kode Mono Variable" italic="none" href="https://github.com/isaozler/kode-mono"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Kalnia" font="Kalnia Variable" italic="none" href="https://github.com/fridamedrano/Kalnia-Typeface"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Tektur" font="Tektur Variable" italic="none" href="https://github.com/hyvyys/Tektur"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Lilex" font="Lilex Variable" italic="none" href="https://github.com/mishamyrt/Lilex"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Monda" font="Monda Variable" italic="none" href="https://github.com/googlefonts/mondaFont"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
	<FontDisplayComponent name="Hubot Sans" font="Hubot Sans Variable" italic="none" href="https://github.com/github/hubot-sans"
	                      bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic bind:isLowercase bind:isUppercase/>
</section>

<style>
    /* Desktop & Tablet */
    @media (width >= 44rem) {
				.other-typography-sec {
            padding-right: 16rem;

            .font-actions {
                position: fixed;
                right: 4rem;

                width: 14rem;
            }
				}
    }

    /* Phone */
    @media (width < 44rem) {
				.font-actions {
						position: relative;
						width: 100%;

						margin-bottom: 2rem;
				}
    }

    .other-typography-sec {
        width: 100%;

        .font-actions {
            display: flex;
            flex-flow: column nowrap;
            align-items: center;
            justify-content: center;
            gap: .75rem;

            height: fit-content;

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