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
					{#if hljs.highlightAuto(text ?? '').language}
						<div class="lang-parent">
							<p class="language">{hljs.highlightAuto(text ?? '').language}</p>
						</div>
					{/if}
					<div class="code">{@html hljs.highlightAuto(text ?? 'Error').value}</div>
				{/snippet}
			</SvelteMarkdown>
		</div>
	{/each}
</section>

<style>
	:global(#main-container) {
		padding: 4rem 0;
	}
	
	.changelog-sec {
		display:     flex;
		flex-flow:   column nowrap;
		align-items: center;
		box-sizing:  border-box;
		
		width:       100vw;
		padding:     0 12rem;
		
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
				font-size:     2.65rem;
				margin-bottom: -.45rem;
			}
			
			h2 {
				margin-top: 1.5rem;
				font-size:  1.75rem;
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
			
			#added {
				margin-top: 2rem;
			}
			
			ul {
				li {
					margin-left:     1.25rem;
					list-style-type: square;
					
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
			
			.codeblock {
				height:        fit-content;
				width:         100%;
				
				padding:       .5rem .75rem;
				margin:        .4rem 0;
				
				background:    var(--theme-markdown-code-bg);
				border-radius: .4rem;
				
				font-family:   'JetBrainsMono', monospace;
				font-size:     .9rem;
				
				.code {
					width:     fit-content;
					max-width: 90%;
					text-wrap: pretty;
					user-select: text;
					
					transform: translateY(1px);
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
		}
	}
</style>