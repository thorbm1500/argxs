<script lang="ts">

</script>

<section class="header-section">
	<div class="nav">
		<div class="argxs">argxs</div>
		<nav>
			<a href="https://github.com/thorbm1500/argxs" target="_blank" rel="external">GitHub</a>
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
              font-size: .9rem;
              font-weight: 375;
							color: var(--theme-text-secondary);
					}

					a:hover {
							color: var(--theme-text-primary);
					}
			}
	}
</style>