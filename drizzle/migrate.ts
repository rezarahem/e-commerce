import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const migrationClient = postgres(process.env.DATABASE_URL as string, {
  max: 1,
});

export const main = async () => {
  await migrate(drizzle(migrationClient), {
    migrationsFolder: './migrations',
  });

  await migrationClient.end();
};

main().catch((err) => {
  console.log(err);
  process.exit(0);
});
