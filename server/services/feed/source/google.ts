import { XMLBuilder } from 'fast-xml-parser'
import type { FeedGenerator, FeedItem } from '#shared/types/export/feed'
import { mockItems } from '~~/server/services/feed/mock'

const builder = new XMLBuilder({
  ignoreAttributes: false,
  format: true,
})

function build(list: FeedItem[]): string {
  const data = list.length > 0 ? list : mockItems

  const body = {
    rss: {
      '@_version': '2.0',
      '@_xmlns:g': 'http://base.google.com/ns/1.0',
      channel: {
        title: 'Example shop',
        link: 'https://www.example.com',
        description: 'Produktový feed Google Merchant',
        item: data.map((item) => ({
          'g:id': item.id,
          'g:title': item.title,
          'g:description': item.description,
          'g:link': item.url,
          'g:image_link': item.image,
          'g:price': `${item.price} ${item.currency}`,
          'g:availability': item.stock > 0 ? 'in_stock' : 'out_of_stock',
          'g:brand': item.brand,
          'g:condition': 'new',
        })),
      },
    },
  }

  return `<?xml version="1.0" encoding="utf-8"?>\n${builder.build(body)}`
}

export const googleFeed: FeedGenerator = {
  file: 'google.xml',
  type: 'google',
  build,
}
