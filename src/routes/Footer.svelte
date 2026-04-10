<script>
import VivaBitLogo from '$lib/assets/icons/VivaBitLogo.svelte';
</script>

<section class="footer-section">
	<a href="https://vivabit.io">Powered by <VivaBitLogo/></a>
</section>

<style>
	.footer-section {
			display: flex;
			flex-flow: row nowrap;
			align-items: center;
			justify-content: center;

      width: 100%;

			padding-top: 1rem;

			font-family: 'Lexend', sans-serif;
			font-size: .85rem;

			user-select: none;

			a {
          display: flex;
          flex-flow: row nowrap;
          align-items: center;
          justify-content: center;
					gap: .15rem;

					color: var(--theme-text-secondary);
			}

			a:hover {
					color: var(--theme-text-primary);
			}
	}
</style>