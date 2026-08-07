import { blob } from '@nuxthub/blob'

/**
 * Public blob serve route for Nuxt Image (`/images/{pathname}`).
 * @see https://hub.nuxt.com/docs/blob#nuxt-image-integration
 */
export default defineEventHandler(async (event) => {
  const pathname = getRouterParam(event, 'pathname')
  if (!pathname) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  setHeader(event, 'Content-Security-Policy', 'default-src \'none\';')
  return blob.serve(event, pathname)
})
