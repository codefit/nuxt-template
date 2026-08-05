import { and, asc, eq, isNull, like, or } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { AuthorDetail, AuthorFormInput, AuthorOption } from '#shared/types/author'
import { formatEmail, formatPhone } from '#shared/utils/format'
import { isValidEmail, isValidPhone } from '#shared/utils/validate'

function stamp(): Date {
  return new Date()
}

function toOption(row: {
  id: number
  name: string
  email: string | null
  phone: string | null
}): AuthorOption {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
  }
}

export async function listAuthors(q?: string): Promise<AuthorOption[]> {
  const where = [isNull(schema.authors.deletedAt)]

  const term = q?.trim()
  if (term) {
    const pattern = `%${term}%`
    where.push(
      or(
        like(schema.authors.name, pattern),
        like(schema.authors.email, pattern),
      )!,
    )
  }

  const rows = await db
    .select({
      id: schema.authors.id,
      name: schema.authors.name,
      email: schema.authors.email,
      phone: schema.authors.phone,
    })
    .from(schema.authors)
    .where(and(...where))
    .orderBy(asc(schema.authors.name))
    .limit(50)

  return rows.map(toOption)
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

export async function getAuthorById(id: number): Promise<AuthorDetail | null> {
  const [row] = await db
    .select()
    .from(schema.authors)
    .where(and(eq(schema.authors.id, id), isNull(schema.authors.deletedAt)))
    .limit(1)

  if (!row) {
    return null
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
