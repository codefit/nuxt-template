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
    SHOP: {
      SHOPITEM: data.map((item) => ({
        ITEM_ID: item.id,
        PRODUCTNAME: item.title,
        DESCRIPTION: item.description,
        URL: item.url,
        IMGURL: item.image,
        PRICE_VAT: item.price,
        CURRENCY: item.currency,
        DELIVERY_DATE: item.stock > 0 ? 0 : -1,
        MANUFACTURER: item.brand,
      })),
    },
  }

  return `<?xml version="1.0" encoding="utf-8"?>\n${builder.build(body)}`
}

export const heurekaFeed: FeedGenerator = {
  file: 'heureka.xml',
  type: 'heureka',
  build,
}
