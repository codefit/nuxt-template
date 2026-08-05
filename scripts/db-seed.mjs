import { PGlite } from '@electric-sql/pglite'
import { drizzle as drizzlePglite } from 'drizzle-orm/pglite'
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js'
import { createJiti } from 'jiti'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import postgres from 'postgres'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const databaseUrl =
  process.env.DATABASE_URL
  || process.env.POSTGRES_URL
  || process.env.POSTGRESQL_URL
  || ''

const jiti = createJiti(import.meta.url, {
  alias: {
    '#shared': join(root, 'shared'),
    '~~': root,
    '~': join(root, 'app'),
  },
})

const messages = await jiti.import(join(root, 'server/db/schema.ts'))
const i18n = await jiti.import(join(root, 'server/db/schema/i18n.ts'))
const entities = await jiti.import(join(root, 'server/db/schema/entities.ts'))
const authors = await jiti.import(join(root, 'server/db/schema/authors.ts'))
const articles = await jiti.import(join(root, 'server/db/schema/articles.ts'))
const metas = await jiti.import(join(root, 'server/db/schema/metas.ts'))

const schema = {
  ...messages,
  ...i18n,
  ...entities,
  ...authors,
  ...articles,
  ...metas,
}

const { seedDatabase } = await jiti.import(join(root, 'server/services/seed/run.ts'))

if (databaseUrl) {
  const client = postgres(databaseUrl)
  const db = drizzlePostgres(client, { schema })
  const result = await seedDatabase({ db, schema })
  console.log('Seed complete:', result)
  await client.end()
}
else {
  const dbPath = join(root, '.data', 'db', 'pglite')
  const client = new PGlite(dbPath)
  const db = drizzlePglite(client, { schema })
  const result = await seedDatabase({ db, schema })
  console.log('Seed complete (PGlite):', result)
  await client.close()
}
