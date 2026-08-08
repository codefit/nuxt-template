/**
 * Protect admin API routes. Public endpoints stay open (articles list/slug,
 * contact POST, language options, slugs, auth + session).
 */
function isPublicApi(method: string, path: string): boolean {
  if (path.startsWith('/api/_auth/')) {
    return true
  }

  if (path.startsWith('/api/auth/')) {
    return true
  }

  if (method === 'GET' && path === '/api/articles') {
    return true
  }

  if (method === 'GET' && /^\/api\/articles\/[^/]+$/.test(path)) {
    return true
  }

  if (method === 'POST' && path === '/api/messages') {
    return true
  }

  if (method === 'GET' && path === '/api/languages/options') {
    return true
  }

  if (method === 'GET' && path === '/api/constants/public') {
    return true
  }

  if (method === 'GET' && path.startsWith('/api/slugs/')) {
    return true
  }

  return false
}

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname
  if (!path.startsWith('/api/')) {
    return
  }

  const method = event.method.toUpperCase()
  if (isPublicApi(method, path)) {
    return
  }

  await requireUserSession(event)
})
