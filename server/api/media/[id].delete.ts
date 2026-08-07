import { deleteMedia } from '~~/server/services/media/remove'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isFinite(id) || id <= 0) {
    throw createError({ statusCode: 400, message: 'Invalid media id.' })
  }

  await deleteMedia(id)
  return { ok: true }
})
