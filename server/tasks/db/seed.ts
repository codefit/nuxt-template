import { clearEntityCache } from '~~/server/services/cache/entities'
import { clearLanguageCache } from '~~/server/services/cache/languages'
import { seedDatabase } from '~~/server/services/seed/run'

export default defineTask({
  meta: {
    name: 'db:seed',
    description: 'Seed languages, entities and demo articles',
  },
  async run() {
    const result = await seedDatabase()
    clearEntityCache()
    clearLanguageCache()
    return { result }
  },
})
