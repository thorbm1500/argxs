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
		<h3 style="color:var(--theme-text-fourth)"><i>Always Free. Always Open Source.</i></h3>
	</div>
	<div class="part intro">
		<h1>The story behind argxs</h1>
		<span>
			For years I have been annoyed by specifically one issue; Forgetting to collect resources in one place, making me constantly have to go look for them when I need them.<br>
			Hey. My name is <a href="https://github.com/thorbm1500" rel="external" style="color:var(--theme-color-accent)"><strong>Thor</strong></a>, and I'm the creator and developer behind argxs.<br><br>
			For more than a decade, I have been designing, and in the more recent years developing websites, and one problem has persisted throughout this entire time; Never having a proper system, and constantly having to look for the same resources, over and over again.
			Sure, I could've just saved that one logo somewhere I would remember before continuing with my design, but did I do that? No.. Cause things have to be fast and efficient, and spending time on keeping a proper structure is not fast.<br>
			<strong>So I made argxs. A free and Open Source all-in-one toolkit</strong>.<br><br>
			The point of argxs is to be the <i>only</i> site needed, regardless of what type of resource is needed.
			During the beginning of argxs, the focus has been primarily on icons, as that has been the biggest issue for me; Having to look for the same SVGs, over and over again.
			argxs now offers a generous <i>and optimized</i> collection of icons, and focus will now start being put elsewhere, to get argxs to where it should be.
		</span>
	</div>
	<div class="part faq">
		<h1>Frequently Asked Questions</h1>
		<span>
			Let's be completely honest. No one has asked these questions, or any questions actually.. So here are some questions and answers that I could imagine I would have.
		</span>
		<div class="question">
			<h2>
				Q. Will argxs always be free?
			</h2>
			<h3>
				<strong>A.</strong> Yes. The core functionality of argxs will always be free. No feature will ever be locked behind a paywall.
			</h3>
		</div>
		<div class="question">
			<h2>
				Q. Can I use *<i>insert resource here</i>* in my project/product?
			</h2>
			<h3>
				<strong>A.</strong> All assets & resources provided by argxs are provided as is, and all rights are still held by the respective owners. argxs simply collects all in one place for ease of use.
			</h3>
		</div>
		<div class="question">
			<h2>
				Q. Does argxs earn any money?
			</h2>
			<h3>
				<strong>A.</strong> No. No money is, or has ever been, made by argxs.
			</h3>
		</div>
		<div class="question">
			<h2>
				Q. What pays for the servers?
			</h2>
			<h3>
				<strong>A.</strong> argxs is lucky enough to have our servers sponsored by <a href="https://github.com/thorbm1500" rel="external" style="color:var(--theme-color-accent)">VivaBit</a>, allowing us to continue providing free and Open Source resources!
			</h3>
		</div>
		<div class="question">
			<h2>
				Q. Can I sponsor my <i>*Brand/Product/Logo/Etc*</i> on argxs?
			</h2>
			<h3>
				<strong>A.</strong> No. argxs does not push or promote any one brand over another.
			</h3>
		</div>
		<div class="question">
			<h2>
				Q. Does argxs offer an API?
			</h2>
			<h3>
				<strong>A.</strong> argxs does not currently offer an API. An API might be made available one day, though this is not certain yet.<br><i>Note: The API would only exist as a convenience tool and wouldn't actually offer any new features in itself, thereby keeping argxs true to its tagline "Always Free. Always Open Source", despite the API likely being behind a paywall.</i>
			</h3>
		</div>
		<div class="question">
			<h2>
				Q. How is argxs pronounced?
			</h2>
			<h3>
				<strong>A.</strong> argxs should be pronounced like "args". The name itself is inspired by the abbreviation of arguments; args.
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
                    margin-top: -.5rem;
                    margin-left: .25rem;
                }
            }

            .part {
                margin-bottom: 2.25rem;

                h1 {
                    font-size: 2rem;
                }

                h2 {
                    font-size: 1.2rem;
                }

                &.faq .question {
                    margin-top: 1.5rem;
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
                    margin-top: .25rem;
										margin-left: .25rem;
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
                    margin-top: 2.5rem;

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