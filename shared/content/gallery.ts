/** Demo gallery images — replace with project assets or CMS. */
export interface GalleryItem {
  id: string
  src: string
  thumb: string
}

export const galleryItems: GalleryItem[] = [
  {
    id: 'atelier',
    src: 'https://picsum.photos/id/1015/1600/1067',
    thumb: 'https://picsum.photos/id/1015/600/400',
  },
  {
    id: 'detail',
    src: 'https://picsum.photos/id/1018/1600/1067',
    thumb: 'https://picsum.photos/id/1018/600/400',
  },
  {
    id: 'space',
    src: 'https://picsum.photos/id/1025/1600/1067',
    thumb: 'https://picsum.photos/id/1025/600/400',
  },
  {
    id: 'material',
    src: 'https://picsum.photos/id/1036/1600/1067',
    thumb: 'https://picsum.photos/id/1036/600/400',
  },
  {
    id: 'light',
    src: 'https://picsum.photos/id/1043/1600/1067',
    thumb: 'https://picsum.photos/id/1043/600/400',
  },
  {
    id: 'process',
    src: 'https://picsum.photos/id/1060/1600/1067',
    thumb: 'https://picsum.photos/id/1060/600/400',
  },
]
