import { db, schema } from '@nuxthub/db'

export default defineEventHandler(async (event) => {
  const body = await readBody<MessageForm>(event)

  const name = body?.name?.trim()
  const email = body?.email?.trim()
  const message = body?.message?.trim()

  if (!name || !email || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Vyplňte jméno, e-mail i zprávu.',
    })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Zadejte platný e-mail.',
    })
  }

  const [row] = await db
    .insert(schema.messages)
    .values({
      name,
      email,
      message,
      createdAt: new Date(),
    })
    .returning()

  return row
})
