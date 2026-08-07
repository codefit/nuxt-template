import { db, schema } from '@nuxthub/db'
import type { AuthorDetail, AuthorFormInput } from '#shared/types/dto/author'
import { formatEmail, formatPhone } from '#shared/utils/format'
import { isValidEmail, isValidPhone } from '#shared/utils/validate'

function stamp(): Date {
  return new Date()
}

export function normalizeAuthorInput(input: AuthorFormInput): AuthorFormInput {
  const name = input.name.trim()
  if (!name) {
    throw createError({ statusCode: 400, message: 'Author name is required.' })
  }

  let email = input.email?.trim() || null
  if (email) {
    email = formatEmail(email)
    if (!isValidEmail(email)) {
      throw createError({ statusCode: 400, message: 'Invalid author email.' })
    }
  }

  let phone = input.phone?.trim() || null
  if (phone) {
    phone = formatPhone(phone)
    if (!isValidPhone(phone)) {
      throw createError({ statusCode: 400, message: 'Invalid author phone.' })
    }
  }

  return { name, email, phone }
}

export async function createAuthor(input: AuthorFormInput): Promise<AuthorDetail> {
  const data = normalizeAuthorInput(input)
  const now = stamp()

  const [row] = await db
    .insert(schema.authors)
    .values({
      name: data.name,
      email: data.email ?? null,
      phone: data.phone ?? null,
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  if (!row) {
    throw createError({ statusCode: 500, message: 'Author insert failed.' })
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}
