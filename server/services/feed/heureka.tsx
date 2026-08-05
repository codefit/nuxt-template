import { XMLBuilder } from 'fast-xml-parser';
import { FeedItem } from '~/shared/types/export/feed';

const items : FeedItem[] = [
    {
        id: '1',
        type: 'product',
        title: 'Product 1',
        description: 'Description 1',
        url: 'https://www.example.com/product-1',
    },
];

const builder = new XMLBuilder({
    format: true,
    ignoreAttributes: false,
});

const xml = builder.build({
    feed: {
        $: {
            version: '2.0',
            'xmlns:g': 'http://base.google.com/ns/1.0',
        },
        item: items.map(item => ({
            id: item.id,
            type: item.type,
            title: item.title,
            description: item.description,
            url: item.url,
            image: item.image,
            price: item.price,
            currency: item.currency,
            stock: item.stock,
            brand: item.brand,
        })),
    },
});