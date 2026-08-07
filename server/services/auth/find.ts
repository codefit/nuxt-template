import { eq } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'

export async function findUserByEmail(email: string) {
  const normalized = email.trim().toLowerCase()
  const [row] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, normalized))
    .limit(1)

  return row ?? null
}

export async function findUserByResetToken(token: string) {
  const [row] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.resetToken, token))
    .limit(1)

  return row ?? null
}
