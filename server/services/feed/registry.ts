import type { FeedGenerator, FeedType } from '#shared/types/export/feed'
import { googleFeed } from '~~/server/services/feed/source/google'
import { heurekaFeed } from '~~/server/services/feed/source/heureka'
import { zboziFeed } from '~~/server/services/feed/source/zbozi'

export const feedLabels: Record<FeedType, string> = {
  google: 'Google',
  heureka: 'Heureka',
  zbozi: 'Zboží',
}

export const feeds: FeedGenerator[] = [
  googleFeed,
  heurekaFeed,
  zboziFeed,
]
