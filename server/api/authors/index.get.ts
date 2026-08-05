import { listAuthors } from '~~/server/services/authors/create'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = typeof query.q === 'string' ? query.q : undefined
  return listAuthors(q)
})
