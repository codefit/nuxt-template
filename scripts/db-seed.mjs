import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { createJiti } from 'jiti'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dbPath = join(root, '.data', 'db', 'sqlite.db')

const jiti = createJiti(import.meta.url, {
  alias: {
    '#shared': join(root, 'shared'),
    '~~': root,
    '~': join(root, 'app'),
  },
})

const client = createClient({ url: pathToFileURL(dbPath).href })

const messages = await jiti.import(join(root, 'server/db/schema.ts'))
const i18n = await jiti.import(join(root, 'server/db/schema/i18n.ts'))
const entities = await jiti.import(join(root, 'server/db/schema/entities.ts'))
const articles = await jiti.import(join(root, 'server/db/schema/articles.ts'))
const metas = await jiti.import(join(root, 'server/db/schema/metas.ts'))

const schema = {
  ...messages,
  ...i18n,
  ...entities,
  ...articles,
  ...metas,
}

const db = drizzle(client, { schema })

const { seedDatabase } = await jiti.import(join(root, 'server/services/seed/run.ts'))
const result = await seedDatabase({ db, schema })

console.log('Seed complete:', result)
client.close()
