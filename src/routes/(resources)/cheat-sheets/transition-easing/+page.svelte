<script lang="ts">
	import ContentHeaderComponent from '$lib/components/ContentHeaderComponent.svelte';
	import EasingFunctionComponent from './EasingFunctionComponent.svelte';

	let duration: number = $state.raw(.1);
	let delay: number = $state.raw(0);
</script>

<section class="easing-functions-sec">
	<ContentHeaderComponent title="Easing Functions" type="functions" amount={29} />

	<EasingFunctionComponent title="Linear" easingFunction="linear" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease" easingFunction="ease" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease In" easingFunction="ease-in" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease Out" easingFunction="ease-out" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease In Out" easingFunction="ease-in-out" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease In Quad" easingFunction="cubic-bezier(0.550, 0.085, 0.680, 0.530)" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease Out Quad" easingFunction="cubic-bezier(0.250, 0.460, 0.450, 0.940)" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease In Out Quad" easingFunction="cubic-bezier(0.455, 0.030, 0.515, 0.955)" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease In Cubic" easingFunction="cubic-bezier(0.550, 0.055, 0.675, 0.190)" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease Out Cubic" easingFunction="cubic-bezier(0.215, 0.610, 0.355, 1.000)" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease In Out Cubic" easingFunction="cubic-bezier(0.645, 0.045, 0.355, 1.000)" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease In Quart" easingFunction="cubic-bezier(0.895, 0.030, 0.685, 0.220)" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease Out Quart" easingFunction="cubic-bezier(0.165, 0.840, 0.440, 1.000)" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease In Out Quart" easingFunction="cubic-bezier(0.770, 0.000, 0.175, 1.000)" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease In Quint" easingFunction="cubic-bezier(0.755, 0.050, 0.855, 0.060)" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease Out Quint" easingFunction="cubic-bezier(0.230, 1.000, 0.320, 1.000)" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease In Out Quint" easingFunction="cubic-bezier(0.860, 0.000, 0.070, 1.000)" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease In Sine" easingFunction="cubic-bezier(0.470, 0.000, 0.745, 0.715)" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease Out Sine" easingFunction="cubic-bezier(0.390, 0.575, 0.565, 1.000)" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease In Out Sine" easingFunction="cubic-bezier(0.445, 0.050, 0.550, 0.950)" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease In Expo" easingFunction="cubic-bezier(0.950, 0.050, 0.795, 0.035)" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease Out Expo" easingFunction="cubic-bezier(0.190, 1.000, 0.220, 1.000)" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease In Out Expo" easingFunction="cubic-bezier(1.000, 0.000, 0.000, 1.000)" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease In Circ" easingFunction="cubic-bezier(0.600, 0.040, 0.980, 0.335)" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease Out Circ" easingFunction="cubic-bezier(0.075, 0.820, 0.165, 1.000)" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease In Out Circ" easingFunction="cubic-bezier(0.785, 0.135, 0.150, 0.860)" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease In Over" easingFunction="cubic-bezier(0.600, -0.280, 0.735, 0.045)" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease Out Over" easingFunction="cubic-bezier(0.175, 0.885, 0.320, 1.275)" duration={duration} delay={delay} />
	<EasingFunctionComponent title="Ease In Out Over" easingFunction="cubic-bezier(0.680, -0.550, 0.265, 1.550)" duration={duration} delay={delay} />
	<h3 class="footer">Still not satisfied? Check out <a href="https://easingwizard.com" rel="external" target="_blank">Easing Wizard</a></h3>
</section>

<style>
	.footer {
			font-size: 1.15rem;
			margin-top: 4.5rem;
			text-align: center;

			font-weight: 550;
			color: var(--theme-text-primary);
			font-family: 'Google Sans', sans-serif;

			a {
					font-weight: 900;
					transition: 75ms ease;
			}

			a:hover {
					color: var(--theme-color-accent);
					filter: brightness(1.1);
					transition: 50ms ease;
			}
	}
</style>