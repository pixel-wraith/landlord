<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import ButtonContainer from "$lib/components/ButtonContainer.svelte";
    import Input from "$lib/components/Input.svelte";
</script>
<div>
    <form
        action="/signup"
        method="post"
    >
        <Input
            type="email"
            name="email"
            placeholder="Email"
            label="Email"
            required
        />
        <Input
            type="password"
            name="password"
            placeholder="Password"
            label="Password"
            required
        />
        <ButtonContainer>
            <Button type="submit">Sign up</Button>
        </ButtonContainer>
    </form>
</div>

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        max-width: 40rem;
        margin: 0 auto;
    }
</style>