import { XMLBuilder } from 'fast-xml-parser'
import type { FeedGenerator, FeedItem } from '#shared/types/export/feed'

const items: FeedItem[] = [
  {
    id: '1',
    type: 'heureka',
    title: 'Bezdrátová myš Pro',
    description: 'Ergonomická myš s tichým klikáním',
    url: 'https://www.example.com/produkty/mys-pro',
    image: 'https://www.example.com/img/mys-pro.jpg',
    price: 599,
    currency: 'CZK',
    stock: 42,
    brand: 'LogiTech',
  },
  {
    id: '2',
    type: 'heureka',
    title: 'Mechanická klávesnice RGB',
    description: 'Hot-swap switch, český layout',
    url: 'https://www.example.com/produkty/klavesnice-rgb',
    image: 'https://www.example.com/img/klavesnice-rgb.jpg',
    price: 1890,
    currency: 'CZK',
    stock: 15,
    brand: 'KeyChron',
  },
  {
    id: '3',
    type: 'heureka',
    title: 'USB-C hub 7v1',
    description: 'HDMI, USB 3.0, SD čtečka, napájení 100 W',
    url: 'https://www.example.com/produkty/usb-c-hub',
    image: 'https://www.example.com/img/usb-c-hub.jpg',
    price: 1299,
    currency: 'CZK',
    stock: 8,
    brand: 'Anker',
  },
  {
    id: '4',
    type: 'heureka',
    title: 'Monitor 27" 144 Hz',
    description: 'IPS panel, FreeSync, HDMI + DP',
    url: 'https://www.example.com/produkty/monitor-27',
    image: 'https://www.example.com/img/monitor-27.jpg',
    price: 5490,
    currency: 'CZK',
    stock: 6,
    brand: 'Dell',
  },
  {
    id: '5',
    type: 'heureka',
    title: 'Notebook stand hliníkový',
    description: 'Nastavitelná výška, pasivní chlazení',
    url: 'https://www.example.com/produkty/notebook-stand',
    image: 'https://www.example.com/img/notebook-stand.jpg',
    price: 790,
    currency: 'CZK',
    stock: 30,
    brand: 'TwelveSouth',
  },
]

const builder = new XMLBuilder({
  ignoreAttributes: false,
  format: true,
})

function build(list: FeedItem[]): string {
  const data = list.length > 0 ? list : items

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
