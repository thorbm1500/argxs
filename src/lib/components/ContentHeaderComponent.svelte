<script lang="ts">
	let { title = 'Loading...', amount = 0, type = 'loading...' } = $props();
</script>

<section class="content-header">
	<div class="text">
		<h1 class="title">
			{title}
		</h1>
		<div class="subtitle">
			<!--todo: Write subtitle-->
			<p>
				argxs currently showcases <strong style="color: var(--theme-color-accent);">{amount}</strong>
				different {type}
			</p>
		</div>
	</div>
</section>

<style>
	/* Desktop & Tablet */
	@media (width >= 44rem) {
		.content-header {
			.text {
				.title {
					font-size: 2.25rem;
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
					font-size: 1.65rem;
				}
				.subtitle {
					font-size: 0.775rem;
				}
			}
		}
	}

	.content-header {
		display: flex;
		flex-flow: row nowrap;
		align-items: flex-end;
		justify-content: space-between;

		padding-bottom: 2rem;
		user-select: none;

		.text {
			.title {
				font-family: 'Outfit', sans-serif;
				font-weight: 700;

				background-image: var(--theme-text-gradient);
				background-clip: text;
				color: transparent;

				max-height: 6.75rem;
			}

			.subtitle {
				font-family: 'Google Sans', sans-serif;
				font-weight: 500;

				color: var(--theme-text-secondary);
			}
		}

		.actions {
		}
	}
</style>