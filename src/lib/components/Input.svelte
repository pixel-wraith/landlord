<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";

    interface IInputProps extends HTMLInputAttributes {
        label: string;
    }

    let { label, ...props }: IInputProps = $props();
</script>

<fieldset>
    <legend>{label}</legend>
    <input {...props} />
</fieldset>

<style>
    fieldset {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        border: none;
    }

    legend {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--neutral-900);
    }

    input {
        border: 1px solid var(--primary-200);
        border-radius: 0.25rem;
        padding: 0.5rem;
        font-size: 1rem;
        color: var(--neutral-100);
    }
</style>