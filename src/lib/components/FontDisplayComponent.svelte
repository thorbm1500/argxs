<script module lang="ts">
	import '$lib/resources/other/typography/jetbrains-mono/fonts.css';
	import '$lib/resources/other/typography/funnel/fonts.css';
	import '$lib/resources/other/typography/archivo/fonts.css';
	import '$lib/resources/other/typography/roboto/fonts.css';
	import '$lib/resources/other/typography/inter/fonts.css';
	import '$lib/resources/other/typography/space-grotesk/fonts.css';
	import '$lib/resources/other/typography/outfit/fonts.css';
	import '$lib/resources/other/typography/ubuntu/fonts.css';

	const defaultPangram = 'A wizard’s job is to vex chumps quickly in fog. A waxy gent chuckled over my fab jazzy quips.';
</script>

<script lang="ts">
	const { name, font, italic, href,
		activeFontSize = $bindable(),
		activeFontWeight = $bindable(),
		activePangram = $bindable(),
		isItalic = $bindable(),
		isLowercase = $bindable(),
		isUppercase = $bindable() } = $props();

	function getCurrentText(): string {
		const text = !!activePangram ? activePangram : defaultPangram;
		if (isLowercase) {
			return String(text).toLowerCase();
		} else if (isUppercase) {
			return String(text).toUpperCase();
		} else return text;
	}
</script>

<section class="font-display">
	<div class="typography">
		<div class="header">
			<h1 class="title">{name}</h1>
			<a class="link" href={href} rel="external" target="_blank">Get this font</a>
		</div>
		<div class="preview">
			<div class="pangram" style="font-size:{activeFontSize}px;{isItalic && italic === 'none'?'font-style:italic;':''}font-family:'{isItalic && italic !== 'none' ? italic : font}', sans-serif;font-weight: {activeFontWeight};">
				{getCurrentText()}
			</div>
		</div>
		<div class="actions">
		</div>
	</div>
</section>

<style>
    .font-display {
				padding-bottom: 2rem;

        .typography {
            color: var(--theme-text-primary);

            .header {
                display: flex;
                flex-flow: row nowrap;
                align-items: flex-end;
                justify-content: space-between;

                .title {
                    font-size: 1.75rem;
                    font-weight: 900;
                    font-family: 'Google Sans', sans-serif;
                }

                .link {
                    margin-right: .75rem;
                    margin-bottom: .15rem;
                }

                .link:hover {
                    text-decoration: underline;
                }
            }

            .preview {
                border: 1px solid var(--theme-ui-line);
                padding: 1.25rem 1.5rem;
                border-radius: .75rem;
                backdrop-filter: contrast(1.05);

                .pangram {
                    font-weight: initial;
                    text-wrap: pretty;
                    text-rendering: geometricPrecision;
                }

            }
        }
    }
</style>