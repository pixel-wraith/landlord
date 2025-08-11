<script lang="ts">
    import type { Snippet } from "svelte";

    interface IButtonContainerProps {
        children: Snippet;
    }

    let { children }: IButtonContainerProps = $props();
</script>

<div class="button-container">
    {@render children()}
</div>

<style>
    .button-container {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 0.5rem;
    }
</style>