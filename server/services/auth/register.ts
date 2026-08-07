import { eq } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { RegisterParsed } from '~~/server/services/auth/schema'
import { findUserByEmail } from '~~/server/services/auth/find'
import { toSessionUser } from '~~/server/services/auth/map'
import { hashPlain } from '~~/server/services/auth/password'

export async function registerUser(input: RegisterParsed) {
  const email = input.email.trim().toLowerCase()
  const existing = await findUserByEmail(email)

  if (existing) {
    return { ok: false as const, reason: 'exists' as const }
  }

  const now = new Date()
  const passwordHash = await hashPlain(input.password)
  const name = `${input.firstName.trim()} ${input.lastName.trim()}`.trim()

  const [row] = await db
    .insert(schema.users)
    .values({
      email,
      passwordHash,
      name,
      role: 'admin',
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  return { ok: true as const, user: toSessionUser(row) }
}

export async function updatePassword(userId: number, password: string) {
  const now = new Date()
  const passwordHash = await hashPlain(password)

  await db
    .update(schema.users)
    .set({
      passwordHash,
      resetToken: null,
      resetExpiresAt: null,
      updatedAt: now,
    })
    .where(eq(schema.users.id, userId))
}
