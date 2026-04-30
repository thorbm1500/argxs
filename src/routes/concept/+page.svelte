<script>
</script>

<section class='concept-sec'>
	<div class='title'>
		<h1>Core Concept</h1>
		<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round'>
			<path d='M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11'/>
		</svg>
	</div>
</section>

<style>
	.concept-sec {
		.title {
			display: flex;
			flex-flow: row nowrap;
			align-items: center;
			justify-content: flex-start;
			gap: .2rem;
			
			h1 {
				font-size: 2.5rem;
			}
			
			svg {
				position: relative;
				width: 3.5rem;
				height: 3.5rem;
				stroke-width: 2;
				justify-self: flex-end;
				
				color: var(--theme-color-aware);
				filter: drop-shadow(0 0 .25rem rgba(from var(--theme-color-aware) r g b / .25));
				
				transform: rotate(3deg);
			}
		}
	}
</style>