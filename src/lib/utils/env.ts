import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import path from 'node:path';
import { z } from 'zod';

expand(config({
    path: path.resolve(
        process.cwd(),
        process.env.NODE_ENV === 'test' ? '.env' : '.env',
    ),
}));

const EnvSchema = z.object({
    NODE_ENV: z.enum(['test', 'development', 'production']).default('development'),
    DATABASE_URL: z.string(),
});

export type env = z.infer<typeof EnvSchema>;

let env: env;

try {
    env = EnvSchema.parse(process.env);
}
catch (e) {
    console.error('\n🥺 Invalid env:');
    console.error(z.flattenError(e as z.ZodError).fieldErrors);
    console.error('\n');
    process.exit(1);
}

export { env };
