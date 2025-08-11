import type { Actions } from './$types';

export const actions = {
	default: async (event) => {
        const data = await event.request.formData();
        const email = data.get('email');
        const password = data.get('password');

		console.log('Creating new user...', email, password);
		console.log('Creating new database for user...');

        return {
            success: true,
            message: 'User created successfully'
        };
	},
} satisfies Actions;