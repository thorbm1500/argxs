<script lang="ts">
	let { sidebarState = $bindable() } = $props();
</script>

<button class={{active: sidebarState}} title="" onclick="{() => sidebarState = !sidebarState}">
	<!--suppress HtmlUnknownTag -->
	<div class="top"></div>
	<!--suppress HtmlUnknownTag -->
	<div class="mid first"></div>
	<!--suppress HtmlUnknownTag -->
	<div class="mid last"></div>
	<!--suppress HtmlUnknownTag -->
	<div class="bot"></div>
</button>

<style>
    button {
				display: flex;
				flex-flow: column nowrap;
				align-items: center;
				justify-content: center;

        height: 1.8rem;
        width: 1.9rem;

        cursor: pointer;

				.top,.mid,.bot {
						position: absolute;

						width: 1.75rem;
						height: .25rem;
						border-radius: .65rem;

						background: var(--theme-ui-icon);

            transition: transform 150ms cubic-bezier(0.600, 0.040, 0.980, 0.335),
            						opacity 150ms cubic-bezier(0.600, 0.040, 0.980, 0.335);
				}

				.mid:first-child {
						transform: none;
				}
				.mid:last-child {
						visibility: hidden;
				}
				.top {
						transform: translateY(-.575rem);
				}
				.bot {
            transform: translateY(.575rem);
				}
    }

		button.active {
				filter: brightness(1.25);

				.top,.mid,.bot {
            transition: transform 100ms cubic-bezier(0.075, 0.820, 0.165, 1.000),
            						opacity 100ms cubic-bezier(0.075, 0.820, 0.165, 1.000);
				}

        .top {
            opacity: 0;
        }
				.mid.first {
            transform: rotate(45deg);
				}
        .mid.last {
            transform: rotate(-45deg);
        }
        .bot {
            opacity: 0;
        }
		}
</style>