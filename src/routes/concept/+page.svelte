<script lang="ts">
	const { data } = $props();
</script>

<svelte:head>
	<meta charset="utf-8">
	<title>{data.seo.title}</title>
	{#if data.seo.description}
		<meta name="description" content={data.seo.description} />
	{/if}
</svelte:head>

<section class="concept-sec">
	<div class="top">
		<h1>Core Concept</h1>
		<h3>Last Updated</h3>
	</div>
	<div class="part intro">
		<h1>The story behind argxs</h1>
		<span>
		<i>Insert story behind argxs</i>
		</span>
	</div>
	<div class="part faq">
		<h1>Frequently Asked Questions</h1>
		<span>
			Let's be completely honest. No one has asked these questions, or any questions actually.. So here are some questions and answers that I could imagine I would have.
		</span>
		<div class="question">
			<h2>
				Will argxs always be free?
			</h2>
			<h3>
				Yes. argxs will always be both <strong>free</strong> and <strong>Open Source</strong>.
			</h3>
		</div>
		<div class="question">
			<h2>
				Can I use *<i>insert resource here</i>* in my project/product?
			</h2>
			<h3>
				All assets & resources provided by argxs are provided as is, and all rights are still held by the respective owners. argxs simply collects all in one place for ease of use. This means that if you wish to use a logo from fx. GitHub, you would have to contact GitHub to ask for permission.
			</h3>
		</div>
		<div class="question">
			<h2>
				Does argxs earn any money?
			</h2>
			<h3>
				No. argxs is run and developed solely by <a href="https://github.com/thorbm1500" rel="external" style="color:var(--theme-color-accent)"><i>me</i></a>, and no money is or has been made, <i>at all</i>.
			</h3>
		</div>
		<div class="question">
			<h2>
				What pays for the servers?
			</h2>
			<h3>
				argxs is lucky enough to have our servers sponsored by <a href="https://github.com/thorbm1500" rel="external" style="color:var(--theme-color-accent)">VivaBit</a>, allowing us to continue providing free and Open Source resources!
			</h3>
		</div>
		<div class="question">
			<h2>
				Can I sponsor my <i>*Brand/Product/Logo/Etc*</i> on argxs?
			</h2>
			<h3>
				No.
			</h3>
		</div>
	</div>
</section>

<style>
    /* Desktop & Tablet */
    @media (width >= 44rem) {
        .concept-sec {
            padding-top: 4.5rem;

            .top {
                margin-bottom: 1.5rem;

                h3 {
                    font-size: .9rem;
                }
            }

            .part {
                margin-bottom: 2.25rem;

                h1 {
                    font-size: 1.8rem;
                }

                h2 {
                    font-size: 1.2rem;
                }

                &.faq .question {
                    margin-top: 1rem;
                }
            }
        }
    }

    /* Phone */
    @media (width < 44rem) {
        .concept-sec {
            padding-top: 1rem;

            .top {
                margin-bottom: 2.5rem;

                h1 {
                    margin-top: 1rem;
                    transform: translateY(.75rem);
                }

                h3 {
                    font-size: .8rem;
                    margin-top: 0;
                    transform: translateX(.7rem);
                    opacity: .75;
                }
            }

            .part {
                margin-bottom: 2.5rem;
                line-height: 1.25 !important;
                letter-spacing: normal;

                h1 {
                    text-align: start;
                    font-size: 1.75rem;
                }

                h2 {
                    text-align: start;
                    font-size: 1.2rem;
                }

                h3 {
                    text-align: start;
                    font-size: .95rem;
                }

                span {
                    font-size: .85rem;
                    font-weight: 600;
                }

                &.faq .question {
                    margin-top: 1.5rem;

										h3 {
												margin-top: .125rem;
										}
                }
            }
        }
    }

    .concept-sec {
        font-family: 'Funnel Sans', sans-serif;
        color: var(--theme-text-primary);
        font-weight: 500;

        span {
            font-family: 'Google Sans', 'Funnel Sans', sans-serif;
        }

        .top {
            h1 {
                font-size: 3.25rem;
                font-weight: 850;
                user-select: none;
            }

            h3 {
                font-weight: 800;
                color: var(--theme-text-third);
                align-self: start;
            }
        }

        .part {
            color: var(--theme-text-primary);
            text-align: justify;

            h2 {
                font-weight: 750;
                user-select: none;
            }
        }
    }
</style>