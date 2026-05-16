<script lang='ts'>
	import FontDisplayComponent from '$lib/components/FontDisplayComponent.svelte';
	import ContentHeaderComponent from '$lib/components/ContentHeaderComponent.svelte';
	
	const { data } = $props();
	
	let activePangram = $state.raw('');
	let activeFontSize = $state.raw(20);
	let activeFontWeight = $state.raw(500);
	let isItalic = $state.raw(false);
	let isLowercase = $state.raw(false);
	let isUppercase = $state.raw(false);
</script>

<svelte:head>
	<title>{data.seo.title}</title>
</svelte:head>

<ContentHeaderComponent amount={36} title='Typography' type='fonts'/>

<section class='other-typography-sec'>
	<div class='font-actions'>
		<div class='action'>
			Font Size
			<input bind:value={activeFontSize} max='42' min='12' type='range'/>
		</div>
		<div class='action'>
			Font Weight
			<input bind:value={activeFontWeight} max='1000' min='100' type='range'/>
		</div>
		<div class='action text-actions'>
			<button class={{ selected: isItalic }} onclick={() => (isItalic = !isItalic)} title=''>
				<svg fill='none' height='24' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24' width='24'>
					<path d='M0 0h24v24H0z' stroke='none'/>
					<path d='M11 5l6 0'/>
					<path d='M7 19l6 0'/>
					<path d='M14 5l-4 14'/>
				</svg>
			</button>
			<button class={{ selected: isLowercase }} onclick={() => {
					isUppercase = false;
					isLowercase = !isLowercase;
				}} title='All Lowercase'>
				<svg fill='none' height='24' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24' width='24'>
					<path d='M0 0h24v24H0z' stroke='none'/>
					<path d='M3 15.5a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0'/>
					<path d='M10 12v7'/>
					<path d='M14 15.5a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0'/>
					<path d='M21 12v7'/>
				</svg>
			</button>
			<button
				class={{ selected: isUppercase }}
				onclick={() => {
					isLowercase = false;
					isUppercase = !isUppercase;
				}} title='All Uppercase'>
				<svg fill='none' height='24' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24' width='24'>
					<path d='M0 0h24v24H0z' stroke='none'/>
					<path d='M3 19v-10.5a3.5 3.5 0 0 1 7 0v10.5'/>
					<path d='M3 13h7'/>
					<path d='M14 19v-10.5a3.5 3.5 0 0 1 7 0v10.5'/>
					<path d='M14 13h7'/>
				</svg>
			</button>
		</div>
	</div>

	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='jetbrains-mono' font='JetBrainsMono'
	                      href='https://www.jetbrains.com/lp/mono/' italic='JetBrainsMono-Italic' name='JetBrains Mono'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='funnel' font='Funnel Sans'
	                      href='https://github.com/Dicotype/Funnel' italic='Funnel Sans Italic' name='Funnel Sans'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='funnel' font='Funnel Display'
	                      href='https://github.com/Dicotype/Funnel' name='Funnel Display'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='archivo' font='Archivo'
	                      href='https://www.omnibus-type.com/fonts/archivo/' italic='Archivo Italic' name='Archivo'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='roboto' font='Roboto Variable'
	                      href='https://github.com/googlefonts/roboto-3-classic' name='Roboto'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='inter' font='Inter Variable'
	                      href='https://rsms.me/inter/' italic='Inter Variable Italic' name='Inter'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='space-grotesk' font='Space Grotesk Variable'
	                      href='https://floriankarsten.github.io/space-grotesk/' name='Space Grotesk'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='outfit' font='Outfit Variable'
	                      href='https://fonts.google.com/specimen/Outfit?preview.script=Latn' name='Outfit'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='ubuntu' font='Ubuntu'
	                      href='https://design.ubuntu.com/font' italic='Ubuntu Italic' name='Ubuntu'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='sora' font='Sora Variable'
	                      href='https://github.com/sora-xor/sora-font' name='Sora'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='mulish' font='Mulish Variable'
	                      href='https://github.com/googlefonts/mulish' name='Mulish'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='lexend' font='Lexend Variable'
	                      href='https://github.com/googlefonts/lexend' name='Lexend'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='bricolage-grotesque' font='Bricolage Grotesque Variable'
	                      href='https://github.com/ateliertriay/bricolage' name='Bricolage Grotesque'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='syne' font='Syne Variable'
	                      href='https://gitlab.com/bonjour-monde/fonderie/syne-typeface' name='Syne'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='chivo' font='Chivo Variable'
	                      href='https://github.com/Omnibus-Type/Chivo' name='Chivo'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='jura' font='Jura Variable'
	                      href='https://github.com/ossobuffo/jura' name='Jura'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='azeret-mono' font='Azeret Mono Variable'
	                      href='https://github.com/displaay/azeret' name='Azeret Mono'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='zalando-sans-expanded' font='Zalando Sans Expanded Variable'
	                      href='https://github.com/zalando/sans' name='Zalando Sans Expanded'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='grandstander' font='Grandstander Variable'
	                      href='https://github.com/Etcetera-Type-Co/Grandstander' name='Grandstander'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='unbounded' font='Unbounded Variable'
	                      href='https://github.com/googlefonts/unbounded' name='Unbounded'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='pixelify-sans' font='Pixelify Sans Variable'
	                      href='https://github.com/eifetx/Pixelify-Sans' name='Pixelify Sans'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='exo' font='Exo Variable'
	                      href='https://github.com/NDISCOVER/Exo-1.0' name='Exo'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='gabarito' font='Gabarito Variable'
	                      href='https://github.com/naipefoundry/gabarito' name='Gabarito'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='darker-grotesque' font='Darker Grotesque Variable'
	                      href='https://github.com/bettergui/DarkerGrotesque' name='Darker Grotesque'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='museomoderno' font='MuseoModerno Variable'
	                      href='https://github.com/Omnibus-Type/MuseoModerno' name='MuseoModerno'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='stack-sans' font='Stack Sans Headline Variable'
	                      href='https://github.com/DylanYoungKoto/Stack-Sans' name='Stack Sans Headline'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='stack-sans' font='Stack Sans Text Variable'
	                      href='https://github.com/DylanYoungKoto/Stack-Sans' name='Stack Sans Text'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='stack-sans' font='Stack Sans Notch Variable'
	                      href='https://github.com/DylanYoungKoto/Stack-Sans' name='Stack Sans Notch'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='alan-sans' font='Alan Sans Variable'
	                      href='https://github.com/alan-eu/Alan-Sans' name='Alan Sans'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='geom' font='Geom Variable'
	                      href='https://github.com/ThanosPoulakidas/Geom' name='Geom'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='sometype-mono' font='Sometype Mono Variable'
	                      href='https://github.com/googlefonts/sometype-mono' name='Sometype Mono'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='kode-mono' font='Kode Mono Variable'
	                      href='https://github.com/isaozler/kode-mono' name='Kode Mono'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='kalnia' font='Kalnia Variable'
	                      href='https://github.com/fridamedrano/Kalnia-Typeface' name='Kalnia'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='tektur' font='Tektur Variable'
	                      href='https://github.com/hyvyys/Tektur' name='Tektur'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='lilex' font='Lilex Variable'
	                      href='https://github.com/mishamyrt/Lilex' name='Lilex'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='monda' font='Monda Variable'
	                      href='https://github.com/googlefonts/mondaFont' name='Monda'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='hubot-sans' font='Hubot Sans Variable'
	                      href='https://github.com/github/hubot-sans' name='Hubot Sans'/>
	<FontDisplayComponent bind:activeFontSize bind:activeFontWeight bind:activePangram bind:isItalic
	                      bind:isLowercase bind:isUppercase cssImport='google-sans' font='Google Sans'
	                      href='https://github.com/github/hubot-sans' italic='Google Sans Italic' name='Google Sans'/>
</section>

<style>
    /* Desktop & Tablet */
    @media (width >= 44rem) {
	    .other-typography-sec {
		    padding-right: 16rem;
		    
		    .font-actions {
			    position: fixed;
			    right:    4rem;
			    
			    width:    14rem;
		    }
	    }
    }
    
    /* Phone */
    @media (width < 44rem) {
	    .font-actions {
		    position:      relative;
		    width:         100%;
		    
		    margin-bottom: 2rem;
	    }
    }
    
    .other-typography-sec {
	    width: 100%;
	    
	    .font-actions {
		    display:         flex;
		    flex-flow:       column nowrap;
		    align-items:     center;
		    justify-content: center;
		    gap:             0.75rem;
		    
		    height:          fit-content;
		    
		    background:      var(--theme-ui-container);
		    border:          1px solid var(--theme-ui-line);
		    border-radius:   0.75rem;
		    
		    padding:         1rem;
		    
		    .action {
			    display:         flex;
			    flex-flow:       column nowrap;
			    align-items:     flex-start;
			    justify-content: center;
			    width:           100%;
			    padding:         0.15rem 0.75rem;
			    
			    accent-color:    var(--theme-color-accent);
			    
			    color:           var(--theme-text-primary);
			    
			    input {
				    width: 100%;
			    }
			    
			    button {
				    cursor:        pointer;
				    
				    border:        1px solid var(--theme-ui-line);
				    border-radius: 0.75rem;
				    
				    padding:       0.25rem;
			    }
			    
			    button.selected {
				    backdrop-filter: brightness(1.25);
				    border-color:    var(--theme-ui-line-highlight);
				    color:           var(--theme-color-accent);
			    }
		    }
		    
		    .action.text-actions {
			    display:         flex;
			    flex-flow:       row wrap;
			    align-items:     center;
			    justify-content: flex-start;
			    gap:             0.25rem;
		    }
	    }
    }
</style>