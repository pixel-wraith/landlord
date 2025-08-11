<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLButtonAttributes } from "svelte/elements";

    interface IButtonProps extends HTMLButtonAttributes {
        children: Snippet;
        theme?: Theme
    }

    let { children, theme = 'primary', ...props }: IButtonProps = $props();
</script>

<button {...props} class={theme}>
    {@render children()}
</button>

<style>
    button {
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        cursor: pointer;
    }

    .primary {
        background-color: var(--primary-500);
        color: var(--neutral-100);
    }
</style>