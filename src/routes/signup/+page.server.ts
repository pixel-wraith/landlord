import { UserService } from '$lib/services/user';
import type { Actions } from './$types';

export const actions = {
	default: async (event) => {
        try {
            const data = await event.request.formData();
            const email = data.get('email');
            const password = data.get('password');

            const userService = new UserService();
            const newUser = await userService.createUser(email as string, password as string);
            
            console.log('Creating new database for user...');
            
            // Create a new database for the user
            const userWithDatabase = await userService.createUserDatabase(newUser[0].id);
            
            console.log('Database created successfully:', userWithDatabase.databaseName);

            return {
                user: userWithDatabase.user,
                success: true,
                message: 'User created successfully with dedicated database'
            };
        } catch (error) {
            console.error('Error during signup:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'An error occurred during signup'
            };
        }
	},
} satisfies Actions;