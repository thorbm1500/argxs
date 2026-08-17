<script>
	import ContentHeaderComponent from '$lib/components/ContentHeaderComponent.svelte';
	import LogoipsumBanner from '$lib/assets/logoipsum-banner.png';
	import BrandfetchBanner from '$lib/assets/brandfetch-banner.png';

	const { data } = $props();
</script>

<svelte:head>
	<meta charset="utf-8">
	<title>{data.seo.title}</title>
	{#if data.seo.description}
		<meta name="description" content={data.seo.description} />
	{/if}
</svelte:head>

<section class="external-content">
	<ContentHeaderComponent title="External" custom={true} />

	<h1 class="group-title">
		Assets
	</h1>
	<section class="external-sec">
		<a class="banner logoipsum" href="https://logoipsum.com" rel="external">
			<img src="{LogoipsumBanner}" alt="Logoipsum" class="transition-default">
		</a>
		<a class="banner brandfetch" href="https://brandfetch.com" rel="external">
			<img src="{BrandfetchBanner}" alt="Brandfetch" class="transition-default">
		</a>
	</section>
</section>

<!-- Assets - https://brandfetch.com -->
<!-- Tools - https://regex101.com -->

<style>
    .external-content {
        padding: 2rem;

				.group-title {
						font-size: 2rem;
				}

        .external-sec {
            display: flex;
            flex-flow: row wrap;
            align-items: center;
            justify-content: space-between;

            box-sizing: border-box;

            width: 100%;
            height: fit-content;

            .banner {
                width: fit-content;
								cursor: pointer;

								z-index: 500;

                img {
                    width: auto;
                    height: 13vw;
                    min-height: 50px;
                    max-height: 200px;
                    border-radius: .9rem;

										z-index: 100;
                }
            }
        }
    }
</style>