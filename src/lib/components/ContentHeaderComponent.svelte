<script lang="ts">
	let { title = 'Loading...', amount = 0, type = 'loading...', custom = false, content = '' } = $props();
</script>

<section class="content-header">
	<div class="text">
		<h1 class="title">
			{title}
		</h1>
		<div class="subtitle">
			{#if custom}
				{@html content}
			{:else}
				<p>argxs currently showcases <strong style="color: color-mix(var(--theme-color-accent) 80%, var(--theme-ui-white) 20%);">{amount}</strong> different {type}</p>
			{/if}
		</div>
	</div>
</section>

<style>
	/* Desktop & Tablet */
	@media (width >= 44rem) {
		.content-header {
			.text {
				.title {
					font-size: 3rem;
				}
				
				.subtitle {
					font-size: 0.95rem;
				}
			}
		}
	}
	
	/* Phone */
	@media (width < 44rem) {
		.content-header {
			.text {
				.title {
					font-size: 2rem;
				}
				
				.subtitle {
					font-size: 0.8rem;
				}
			}
		}
	}
	
	.content-header {
		display:         flex;
		flex-flow:       row nowrap;
		align-items:     flex-end;
		justify-content: space-between;
		
		padding-bottom:  2rem;
		user-select:     none;
		
		z-index: 500;
		
		.text {
			z-index: 500;
			
			.title {
				background-image: var(--theme-text-gradient);
				background-clip:  text;
				color:            transparent;
				
				max-height:       6.75rem;
			}
			
			.subtitle {
				font-weight: 500;
				
				color:       var(--theme-text-third);
			}
		}
		
		&::before {
			content: '';
			position: absolute;
			mix-blend-mode: soft-light;
			
			top: -7.5vh;
			right: -10vw;
			width: 120vw;
			height: 40vh;
			
			background-image: linear-gradient(to bottom, var(--theme-color-primary) 0%, transparent 100%);
			transform: rotate(3deg);
			filter: blur(6rem);
			
			z-index: 1;
		}
	}
</style>