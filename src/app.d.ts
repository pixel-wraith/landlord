// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	export type Theme = 'primary' | 'accent1' | 'accent2' | 'accent3' | 'light' | 'neutral' | 'danger' | 'success';
}

export {};
