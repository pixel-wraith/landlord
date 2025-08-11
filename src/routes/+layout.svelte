<script lang="ts">
	import '../styles.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>💩 Landlord</title>
</svelte:head>

<div class="layout">
	<header>
		<nav>
			<div>
				Landlord
			</div>

			<nav>
				<a href="/">Home</a>
				<a href="/signup">Sign up</a>
			</nav>
		</nav>
	</header>
	
	<main>
		{@render children?.()}
	</main>
</div>

<style>
	.layout {
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
	}
	header {
		border-bottom: 1px solid var(--primary-200);
		padding: 1rem;
	}

	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	main {
		flex: 1;
		padding: 1rem;
	}
</style>
