import { generateFeeds } from '~~/server/services/feed/run'

export default defineTask({
  meta: {
    name: 'feed:generate',
    description: 'Generuje produktové feedy do public/feeds',
  },
  async run() {
    const result = await generateFeeds()
    return { result }
  },
})
