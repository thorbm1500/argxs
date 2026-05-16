<script lang="ts">
	import SvelteMarkdown from '@humanspeak/svelte-markdown';
	import hljs from 'highlight.js';
	import ContentHeaderComponent from '$lib/components/ContentHeaderComponent.svelte';
	import { getContext, onMount } from 'svelte';
	import { github, githubDark } from 'svelte-highlight/styles';
	import type { PageTheme } from '$lib/components/interfaces';
	
	const { data, params } = $props();
	
	const getTheme = getContext('theme') as Function;
	let theme: PageTheme = $derived(getTheme());
	
	onMount(() => {
		if (params.version) {
			document.getElementById(params.version)?.scrollIntoView({ block: 'nearest' });
		}
	});
</script>

<svelte:head>
	<title>{data.seo.title}</title>
	<!--Dynamic syntax highlighting-->
	{#if theme === 'light'}
		{@html github}
	{:else}
		{@html githubDark}
	{/if}
</svelte:head>

<section class="changelog-sec">
	<ContentHeaderComponent title="Changelog" custom={true} />
	
	{#each data.changelogs as changelog}
		<div id={changelog.version} class="markdown">
			<!--suppress JSUnusedGlobalSymbols -->
			<SvelteMarkdown source={changelog.log}>
				{#snippet code({ lang, text })}
					<div class="codeblock">
						{#if lang}
							<div class="lang-parent">
								<p class="language">{lang}</p>
							</div>
							<pre class="code">{@html hljs.highlight(text, { language: lang }).value}</pre>
						{:else}
							{#if hljs.highlightAuto(text).language}
								<div class="lang-parent">
									<p class="language">{hljs.highlightAuto(text).language}</p>
								</div>
							{/if}
							<pre class="code">{@html hljs.highlightAuto(text).value}</pre>
						{/if}
					</div>
				{/snippet}
				{#snippet codespan({ text })}
					<code class="codespan">{@html text}</code>
				{/snippet}
			</SvelteMarkdown>
		</div>
	{/each}
</section>

<style>
	/* Desktop & Tablet */
	@media (width >= 44rem) {
		.changelog-sec {
			padding: 4.5rem 6rem 0 6rem;
			
			.markdown :global {
				h1 {
					font-size: 2.65rem;
				}
				
				h2 {
					font-size: 1.75rem;
				}
				
				h3 {
					font-size: 1.25rem;
				}
				
				#added {
					margin-top: 2rem;
				}
			}
		}
	}
	
	/* Phone */
	@media (width < 44rem) {
		.changelog-sec {
			padding-top: 2.5rem;
			
			.markdown :global {
				line-height: 1.35;
				
				h1 {
					font-size: 2.25rem;
				}
				
				h2 {
					font-size: 1.4rem;
				}
				
				#added {
					margin-top: 1rem;
				}
				
				.codeblock .language {
					font-size: .75rem;
				}
			}
		}
	}
	
	.changelog-sec {
		display:         flex;
		flex-flow:       column nowrap;
		align-items:     center;
		justify-content: center;
		width:           100%;
		
		:global .content-header {
			align-self: start;
		}
		
		.markdown:last-child {
			margin-bottom: 0 !important;
		}
		
		.markdown :global {
			width:          100%;
			max-width:      96rem;
			
			padding-bottom: 1rem;
			margin-bottom:  4rem;
			
			border-bottom:  1px solid var(--theme-ui-line);
			
			color:          var(--theme-text-primary);
			
			h1 {
				margin-bottom: -.45rem;
			}
			
			h2 {
				margin-top: 1.5rem;
			}
			
			h3 {
				font-weight: 700;
				color:       var(--theme-text-secondary);
			}
			
			h4 {
				margin-top:     -.25rem;
				margin-bottom:  1rem;
				
				font-family:    'Funnel Sans', sans-serif;
				color:          var(--theme-text-third);
				font-weight:    600;
				font-size:      .8rem;
				letter-spacing: .1rem;
			}
			
			a {
				font-weight: bold;
				color:       light-dark(oklch(0.512 0.14 261.749), oklch(0.827 0.083 262.659));
				
				&:hover {
					text-decoration: underline;
					color:           light-dark(oklch(0.68 0.172 254.686), oklch(70.7% 0.165 254.624));
				}
			}
			
			ul {
				li {
					margin-left:     1.25rem;
					list-style-type: square;
					
					&:last-child {
						margin-bottom: .75rem;
					}
					
					ul li {
						list-style-type: disc;
						
						&:last-of-type {
							margin-bottom: .5rem;
						}
						
						ul li {
							list-style-type: circle;
							margin-bottom:   0 !important;
						}
					}
					
					p {
						width: fit-content;
					}
				}
			}
			
			.codeblock, .codespan {
				height:        fit-content;
				
				background:    var(--theme-markdown-code-bg);
				border-radius: .4rem;
				
				font-family:   'JetBrainsMono', monospace !important;
				font-weight:   550;
			}
			
			.codeblock {
				width:     100%;
				
				padding:   .5rem .75rem;
				margin:    .4rem 0;
				
				font-size: .9rem;
				
				.code {
					width:       fit-content;
					max-width:   90%;
					text-wrap:   pretty;
					user-select: text;
					
					transform:   translateY(1px);
				}
				
				.lang-parent {
					position:    relative;
					width:       100%;
					height:      100%;
					cursor:      default;
					
					user-select: none;
					
					&:hover .language {
						color:      var(--theme-text-secondary);
						
						transition: var(--theme-transition-on);
					}
				}
				
				.language {
					position:    absolute;
					top:         0;
					right:       0;
					font-weight: 650;
					color:       var(--theme-text-fourth);
					
					transition:  var(--theme-transition-off);
				}
			}
			
			.codespan {
				width:   fit-content;
				padding: .2rem .4rem .15rem .4rem;
				margin:  0;
			}
		}
	}
</style>