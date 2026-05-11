<script lang="ts">
	import SvelteMarkdown from '@humanspeak/svelte-markdown';
	import ContentHeaderComponent from '$lib/components/ContentHeaderComponent.svelte';
	import { onMount } from 'svelte';
	
	const { data, params } = $props();
	
	onMount(() => {
		if (params.version) {
			document.getElementById(params.version)?.scrollIntoView({block: 'nearest'});
		}
	})
</script>

<section class="changelog-sec">
	<ContentHeaderComponent title="Changelog" custom={true} />
	
	{#each data.changelogs as changelog}
		<div id={changelog.version} class="markdown">
			<SvelteMarkdown source={changelog.log} />
		</div>
	{/each}
</section>

<style>
	:global(#main-container) {
		padding: 4rem 12rem 0 12rem;
	}
	
	.changelog-sec {
		.markdown:last-child {
			margin-bottom: 0 !important;
		}
		
		.markdown :global {
			color: var(--theme-text-primary);
			padding-bottom: 1rem;
			border-bottom: 1px solid var(--theme-ui-line);
			margin-bottom: 4rem;
			
			h1 {
				font-size: 2.65rem;
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
				
				&:hover {
					text-decoration: underline;
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
						
						ul li {
							list-style-type: circle;
						}
					}
					
					p {
						width: fit-content;
					}
				}
			}
			
			code {
				font-family:   'JetBrainsMono', monospace;
				
				padding:       .325rem .5rem .25rem .5rem;
				background:    var(--theme-markdown-code-bg);
				border-radius: .4rem;
			}
		}
	}
</style>