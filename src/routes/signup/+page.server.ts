import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema/user';
import type { Actions } from './$types';

export const actions = {
	default: async (event) => {
        const data = await event.request.formData();
        const email = data.get('email');
        const password = data.get('password');

        if (!email || !password) {
            return {
                success: false,
                message: 'Email and password are required'
            };
        }

        const newUser = await db.insert(user)
            .values({
                email: String(email),
                password: String(password)
            })
            .returning();

        if (!newUser) {
            return {
                success: false,
                message: 'Failed to create user'
            };
        }

        console.log('New user created:', newUser);
		
		console.log('Creating new database for user...');

        return {
            success: true,
            message: 'User created successfully'
        };
	},
} satisfies Actions;