<script lang="ts">
	const { title, color } = $props();

</script>

<div class="palette">
		<div class="title">{title}</div>
		<div class="boxes">
			<div class="box {color}" style="background:color-mix(#fff 90%, var(--palette-color))"></div>
			<div class="box {color}" style="background:color-mix(#fff 80%, var(--palette-color))"></div>
			<div class="box {color}" style="background:color-mix(#fff 70%, var(--palette-color))"></div>
			<div class="box {color}" style="background:color-mix(#fff 60%, var(--palette-color))"></div>
			<div class="box {color}" style="background:color-mix(#fff 50%, var(--palette-color))"></div>
			<div class="box {color}" style="background:color-mix(#fff 40%, var(--palette-color))"></div>
			<div class="box {color}" style="background:color-mix(#fff 30%, var(--palette-color))"></div>
			<div class="box {color}" style="background:color-mix(#fff 20%, var(--palette-color))"></div>
			<div class="box {color}" style="background:color-mix(#fff 10%, var(--palette-color))"></div>
			<div class="box {color}" style="background: var(--palette-color)"></div>
		</div>
	</div>

<style>
    .palette {
        width: 100%;
        margin-bottom: 1.25rem;

        .title {
            font-size: 1.25rem;
            font-family: 'Google Sans', sans-serif;
            font-weight: 800;
            padding: .35rem;

            justify-self: end;
            color: var(--theme-text-primary);
        }

        .boxes {
            display: flex;
            flex-flow: row nowrap;
            align-items: center;
            justify-content: space-between;

            .box {
                width: 4.5rem;
                height: 4.5rem;
                border-radius: .7rem;

                background-color: #fff;

                cursor: copy;

								box-shadow: 0 0 .85rem rgba(from var(--palette-color) r g b / .1);
            }

            .box.red {
                --palette-color: oklch(64.2% 0.244 24.546);
            }
            .box.blood-orange {
                --palette-color: oklch(66.1% 0.213 37.148);
            }
            .box.orange {
                --palette-color: oklch(71.3% 0.19 44.351);
            }
            .box.yellow {
                --palette-color: oklch(89.6% 0.177 96.348);
            }
            .box.light-green {
                --palette-color: oklch(86% 0.251 146.653);
            }
            .box.mint {
                --palette-color: oklch(87.2% 0.192 159.99);
            }
            .box.cyan {
                --palette-color: oklch(85.1% 0.141 205.1);
            }
            .box.light-blue {
                --palette-color: oklch(74.4% 0.148 233.636);
            }
						.box.blue {
								--palette-color: oklch(63.3% 0.192 255.389);
						}
            .box.indigo {
                --palette-color: oklch(51.4% 0.274 273.842);
            }
            .box.purple {
                --palette-color: oklch(53.5% 0.268 282.439);
            }
            .box.pink {
                --palette-color: oklch(64.1% 0.294 316.402);
            }
            .box.rose {
                --palette-color: oklch(61.5% 0.242 15.709);
            }
        }
    }
</style>