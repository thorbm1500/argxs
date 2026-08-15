<script module lang="ts">
	const defaultPangram = 'A wizard’s job is to vex chumps quickly in fog. A waxy gent chuckled over my fab jazzy quips.';
</script>

<script lang="ts">
	let { name, font, cssImport, italic = 'none', href, activeFontSize = $bindable(), activeFontWeight = $bindable(),
		activePangram = $bindable(), isItalic = $bindable(), isLowercase = $bindable(), isUppercase = $bindable() } = $props();

	// svelte-ignore state_referenced_locally
	import(`$lib/resources/other/typography/${cssImport}/fonts.css`);

	function getCurrentText(): string {
		const text = activePangram ? activePangram : defaultPangram;
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
			<a class="link" {href} rel="external" target="_blank">Get this font</a>
		</div>
		<div class="preview">
			<div class="pangram" style="font-size:{activeFontSize}px;{isItalic && italic === 'none' ? 'font-style:italic;' : ''}font-family:'{isItalic && italic !== 'none'
					? italic
					: font}', sans-serif;font-weight: {activeFontWeight};">
				{getCurrentText()}
			</div>
		</div>
		<div class="actions"></div>
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
                    margin-left: 0.5rem;
                    margin-bottom: 0.25rem;
                    font-size: 1.4rem;
                    font-weight: 900;
                    font-family: 'Google Sans', sans-serif;
                }

                .link {
                    margin-right: 0.75rem;
                    margin-bottom: 0.15rem;
                }

                .link:hover {
                    text-decoration: underline;
                }
            }

            .preview {
                border: 1px solid var(--theme-ui-line);
                padding: 1.25rem 1.5rem;
                border-radius: 0.75rem;
                background: var(--theme-ui-container);

                .pangram {
                    font-weight: initial;
                    text-wrap: pretty;
                    text-rendering: geometricPrecision;
                }

								.pangram::selection {
										background: var(--theme-color-accent);
								}
            }
        }
    }
</style>