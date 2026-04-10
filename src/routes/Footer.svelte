<script>
	import VivaBitLogo from '$lib/assets/icons/VivaBitLogo.svelte';
</script>

<section class="footer-section">
	<a class="sponsor" href="https://vivabit.io">Powered by
		<VivaBitLogo />
	</a>
	<p class="subtitle">All Rights Reserved.</p>
	<p class="disclaimer"><strong>argxs</strong> is not affiliated, associated, authorized, endorsed by, or in any way officially connected with any brands showcased on this website, or any of their
		affiliates.</p>
</section>

<style>
    .footer-section {
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: flex-start;

        height: fit-content;
        width: 100%;

        padding-top: 2.5rem;
				padding-bottom: 1.5rem;

        font-family: 'Lexend', sans-serif;

        user-select: none;

        .sponsor {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            justify-content: center;
            gap: .15rem;

            font-size: .85rem;
            color: var(--theme-text-secondary);
        }

        .sponsor:hover {
            color: var(--theme-text-primary);
        }

        .subtitle, .disclaimer {
            font-size: .6rem;
            color: var(--theme-text-third);
        }

        .disclaimer {
            font-size: .55rem;
            padding-top: .65rem;
            max-width: 24rem;
            text-align: center;

            opacity: .75;
        }
    }
</style>