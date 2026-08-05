export type FeedType = 'google' | 'heureka' | 'zbozi'

export interface FeedItem {
    id : string,
    type : FeedType,
    title : string,
    description : string,
    url : string,
    image : string,
    price : number,
    currency : string,
    stock : number,
    brand : string,
}

export interface FeedGenerator {
    file : string,
    type : FeedType,
    build( items : FeedItem[] ) : string,
}