import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { heurekaFeed } from '~~/server/services/feed/source/heureka'

export async function generateFeeds() {
  const dir = join(process.cwd(), 'public', 'feeds')
  await mkdir(dir, { recursive: true })

  const xml = heurekaFeed.build([])
  const path = join(dir, heurekaFeed.file)
  await writeFile(path, xml, 'utf8')

  return { path, bytes: xml.length }
}
