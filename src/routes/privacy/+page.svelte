<script lang="ts">
	const { data } = $props();

	const lastUpdated: string = '25.04.2026';

	// svelte-ignore state_referenced_locally
	let optedOut: boolean = $state(!!data.optedOut);

	function optOut() {
		if (optedOut) {
			window?.cookieStore.delete('argxs_do_not_track');
			optedOut = false;
		} else {
			window?.cookieStore.set('argxs_do_not_track', "true");
			optedOut = window?.cookieStore.get('argxs_do_not_track') !== undefined
		}
	}
</script>

<section class="privacy-sec">
	<div class="top">
		<svg class="privacy-icon" width="24" height="24" viewBox="0 0 24 24">
			<defs>
				<linearGradient id="gradient">
					<stop class="stop1" offset="0%" />
					<stop class="stop2" offset="100%" />
				</linearGradient>
			</defs>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<path fill="url(#gradient)"
			      d="M11.998 2l.118 .007l.059 .008l.061 .013l.111 .034a.993 .993 0 0 1 .217 .112l.104 .082l.255 .218a11 11 0 0 0 7.189 2.537l.342 -.01a1 1 0 0 1 1.005 .717a13 13 0 0 1 -9.208 16.25a1 1 0 0 1 -.502 0a13 13 0 0 1 -9.209 -16.25a1 1 0 0 1 1.005 -.717a11 11 0 0 0 7.531 -2.527l.263 -.225l.096 -.075a.993 .993 0 0 1 .217 -.112l.112 -.034a.97 .97 0 0 1 .119 -.021l.115 -.007zm.002 7a2 2 0 0 0 -1.995 1.85l-.005 .15l.005 .15a2 2 0 0 0 .995 1.581v1.769l.007 .117a1 1 0 0 0 1.993 -.117l.001 -1.768a2 2 0 0 0 -1.001 -3.732z" />
		</svg>
		<h1>Privacy</h1>
		<h3>Last Updated {lastUpdated}</h3>
	</div>
	<div class="part intro">
		<h2>1. Introduction</h2>
		<span>
		We are committed to protecting your privacy and ensuring transparency regarding the processing of your personal data. As this project is <a
			href="https://github.com/thorbm1500/argxs">Open Source</a>, you're always able to manually inspect the code, and see exactly how the data processing is carried out. This statement outlines how we handle your information when you visit our website. The date above ("{lastUpdated}
			") always shows when the privacy statement was last updated.
		</span>
	</div>
	<div class="part data-collection">
		<h2>2. Data Collection & Purpose</h2>
		<span>
			To accurately monitor website traffic and maintain a reliable count of visitors, we process your IP address. The sole purpose of collecting this data is to perform basic analytics regarding site usage volume. This helps us understand the scale of our audience and ensure the stability of our services. Be aware that, an IP address is considered personal data under the General Data Protection Regulation (GDPR) as it can identify a specific device and, indirectly, a user.
		</span>
	</div>
	<div class="part legal-basis">
		<h2>3. Legal Basis for Processing</h2>
		<span>
			Under <a href="https://gdpr-info.eu/art-6-gdpr/" rel="external" target="_blank">Article 6 §1(f)</a> of the GDPR, we process your IP address based on our legitimate interest in analyzing website traffic to improve our service and ensure operational efficiency. This interest is not overridden by your fundamental rights and freedoms because:
		</span>
		<ol>
			<li>The data collection is minimal and strictly limited to what is necessary.</li>
			<li>The data is not used for profiling, marketing, or identifying individuals beyond the scope of anonymous traffic counting.</li>
			<li>The retention period is extremely short, minimizing any risk to your privacy.</li>
		</ol>
	</div>
	<div class="part data-retention">
		<h2>4. Data Retention and Minimization</h2>
		<span>
			We adhere to the principle of data minimization and strict retention limits:
		</span>
		<ol>
			<li>Your IP address is cached in our system for a maximum of 1 hour.</li>
			<li>Your IP address is only stored in memory, and is at no point during its one-hour lifetime written to the disk.</li>
			<li>Once this one-hour window expires, the data is automatically purged from our cache. No historical records of individual IP addresses are retained beyond this period.</li>
			<li>After deletion, the data cannot be reconstructed or linked back to you.</li>
		</ol>
	</div>
	<div class="part data-sharing">
		<h2>5. Data Sharing and Security</h2>
		<span>We do not sell, rent, or share your IP address, or any other data with any third-party analytics providers, advertisers, or data brokers. All data processing occurs entirely server-side and is never directly accessible to any users.</span>
	</div>
	<div class="part changes">
		<h2>
			6. Changes to This Policy
		</h2>
		<span>
			We reserve the right to update this privacy statement to reflect changes in our practices or legal requirements. Any material changes will be posted on this page with an updated effective date.
		</span>
	</div>
	<div class="part opt-out">
		<h2>Do you still wish to opt out of site analytics?</h2>
		<span><strong style="color:var(--theme-color-accent);font-weight:900;">argxs</strong> believes in owning your own data. Clicking the button below ensures that we wont process any data related to your person in the future. This is done by simple providing you with a cookie "argxs_do_not_track". The server checks for the cookie when a request is received, and skips processing analytics, if the cookie is present.</span>
		<br>
		<button class="opt-out-button {$state.eager(optedOut) ? 'out' : 'in'}" title="Opt ouf of cookies" onclick="{() => optOut()}">
			{#if $state.eager(optedOut)}
				Opt Back In
			{:else}
				Opt Out
			{/if}
		</button>
		{#if $state.eager(optedOut)}
			<span class="opted-out">You're already opted out.</span>
		{/if}
	</div>
</section>

<style>
    /* Desktop & Tablet */
    @media (width >= 44rem) {
        .privacy-sec {
            .top {
                margin-bottom: 1.5rem;
            }
            .part {
								margin-bottom: 2.25rem;

								h2 {
                    font-size: 1.5rem;
								}

                ol {
                    margin-top: 1rem;
                    margin-left: 4rem;
                }
            }
						.part.opt-out {
								h2 {
										font-size: 1.25rem;
								}
						}
        }
    }

    /* Phone */
    @media (width < 44rem) {
        .privacy-sec {
            .top {
                margin-bottom: 2.5rem;
            }

            .part {
                margin-bottom: 3.75rem;

								h2 {
										text-align: start;
										font-size: 1.25rem;
								}

								span,a {
										font-size: .95rem;
								}

                ol {
                    margin-top: 1.4rem;
                    margin-left: 2.25rem;

										max-width: 80%;

										li {
												margin-bottom: 1rem;
										}
                }
            }
            .part.opt-out {
                h2 {
                    font-size: 1.15rem;
                }
            }
        }
    }

    .privacy-sec {
        font-family: 'Funnel Sans', sans-serif;
        color: var(--theme-text-primary);
        font-weight: 500;

        span, ol {
            font-family: 'Google Sans', 'Funnel Sans', sans-serif;
        }

        .top {
            h1 {
                font-size: 3.25rem;
                font-weight: 850;
                user-select: none;
            }

            h3 {
                font-size: .9rem;
                font-weight: 800;
                color: var(--theme-text-secondary);
            }
        }

        .part {
            color: var(--theme-text-primary);
            text-align: justify;

            h2 {
                font-weight: 750;
                user-select: none;
            }

            li {
                margin-bottom: .25rem;
                list-style-type: lower-roman;
            }

            a {
                color: color-mix(var(--theme-text-primary), var(--theme-color-accent) 50%);
                transition: color 125ms ease-in;
            }

            a:hover {
                color: var(--theme-color-accent);
                text-decoration: underline;

                transition: color 75ms ease-out;
            }
        }

				.part.opt-out {
						margin-top: 3rem;

            .opt-out-button {
                margin-top: 1.5rem;
                margin-left: 1rem;

                font-size: 1.05rem;

                color: var(--theme-color-accent);

                background: var(--theme-ui-container);
                border: 1px solid var(--theme-ui-line);
                border-radius: .65rem;
                padding: .5rem .725rem;

                cursor: pointer;
            }

            .opt-out-button:hover {
                background: var(--theme-ui-container-hover);
            }

            .opt-out-button.out {
                color: var(--theme-color-third);
            }

            .opted-out {
                margin-left: .5rem;
                font-size: .9rem;
                font-style: italic;
                font-weight: 700;

                color: var(--theme-text-third);
            }
				}

        .privacy-icon {
            position: absolute;
            width: 10rem;
            height: 10rem;
            opacity: .3;

            .stop1 {
                stop-color: var(--theme-text-primary);
            }

            .stop2 {
                stop-color: rgba(from var(--theme-text-primary) r g b / .7);
            }

            transform: translateY(-2.75rem) translateX(-2rem) rotate(-22.5deg);
        }
    }
</style>