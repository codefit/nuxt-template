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
        PRODUCTNAME: item.title,
        DESCRIPTION: item.description,
        URL: item.url,
        IMGURL: item.image,
        PRICE_VAT: item.price,
        ITEM_ID: item.id,
        MANUFACTURER: item.brand,
        CATEGORYTEXT: 'Elektronika',
        DELIVERY_DATE: item.stock > 0 ? 0 : -1,
      })),
    },
  }

  return `<?xml version="1.0" encoding="utf-8"?>\n${builder.build(body)}`
}

export const zboziFeed: FeedGenerator = {
  file: 'zbozi.xml',
  type: 'zbozi',
  build,
}
