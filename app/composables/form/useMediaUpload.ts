import type { EntityKey } from '#shared/types/dto/entity'
import type { MediaCollection } from '#shared/types/media/collection'
import type { MediaItemDto, PendingMediaFile } from '#shared/types/media/dto'
import { mediaUrl } from '#shared/utils/mediaUrl'

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function pendingFromMedia(item: MediaItemDto): PendingMediaFile {
  return {
    id: `media-${item.id}`,
    mediaId: item.id,
    collection: item.collection,
    name: item.name,
    mime: item.mime,
    size: item.size,
    rank: item.rank,
    pathname: item.pathname,
    url: mediaUrl(item),
    previewUrl: mediaUrl(item) ?? undefined,
  }
}

export function pendingFromFile(
  file: File,
  collection: MediaCollection,
  rank = 0,
): PendingMediaFile {
  return {
    id: uid(),
    collection,
    name: file.name,
    mime: file.type,
    size: file.size,
    rank,
    file,
    previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
  }
}

export async function uploadPending(input: {
  entity: EntityKey
  modelId: number
  collection: MediaCollection
  items: PendingMediaFile[]
}): Promise<MediaItemDto[]> {
  const fresh = input.items.filter(item => item.file && !item.remove && !item.mediaId)
  if (fresh.length === 0) {
    return []
  }

  const form = new FormData()
  form.set('entity', input.entity)
  form.set('modelId', String(input.modelId))
  form.set('collection', input.collection)

  for (const item of fresh) {
    form.append('files', item.file!)
  }

  const result = await $fetch<MediaItemDto | MediaItemDto[]>('/api/media/upload', {
    method: 'POST',
    body: form,
  })

  return Array.isArray(result) ? result : [result]
}

export async function removePending(items: PendingMediaFile[]): Promise<void> {
  const ids = items
    .filter(item => item.remove && item.mediaId)
    .map(item => item.mediaId!)

  await Promise.all(
    ids.map(id => $fetch(`/api/media/${id}`, { method: 'DELETE' })),
  )
}

export async function saveGalleryOrder(input: {
  entity: EntityKey
  modelId: number
  collection: MediaCollection
  orderedIds: number[]
}): Promise<void> {
  await $fetch('/api/media/reorder', {
    method: 'PATCH',
    body: input,
  })
}
