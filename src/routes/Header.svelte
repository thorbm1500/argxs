<script lang="ts">

import GitHubLogo from '$lib/assets/icons/GitHubLogo.svelte';
</script>

<section class="header-section">
	<div class="nav">
		<a href="/" class="argxs">argxs</a>
		<nav>
			<a href="https://github.com/thorbm1500/argxs" target="_blank" rel="external">
				<GitHubLogo />
				GitHub
			</a>
		</nav>
	</div>
</section>

<style>
	.header-section {
			position: absolute;
			top: 0;
			left: 0;

			width: 100vw;
			height: 3rem;

      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: center;

			border-bottom: 1px solid var(--theme-ui-line);
			background: #f4f6f8;

			user-select: none;

			.nav {
					display: flex;
					flex-flow: row nowrap;
					align-items: center;
					justify-content: space-between;

					width: 75vw;

          font-family: 'Lexend', sans-serif;

					.argxs {
              font-size: 1.5rem;
							font-weight: 500;

							color: var(--theme-text-primary);
					}

					a {
							display: flex;
							flex-flow: row nowrap;
							align-items: center;
							justify-content: center;
							gap: .1rem;

              font-size: .91rem;
              font-weight: 375;
							color: var(--theme-text-secondary);
					}

					a:hover {
							color: var(--theme-text-primary);
					}
			}
	}
</style>