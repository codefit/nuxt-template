import { createJiti } from 'jiti'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const jiti = createJiti(import.meta.url, {
  alias: {
    '#shared': join(root, 'shared'),
    '~~': root,
    '~': join(root, 'app'),
  },
})

const { generateFeeds } = await jiti.import(join(root, 'server/services/feed/run.ts'))
await generateFeeds()
