import { eq } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { ConstantDetail } from '#shared/types/dto/constant'
import { clearConstantCache } from '~~/server/services/cache/constants'
import { mapConstant } from '~~/server/services/constants/map'
import type { ConstantFormParsed } from '~~/server/services/constants/schema'

function stamp(): Date {
  return new Date()
}

export async function createConstant(input: ConstantFormParsed): Promise<ConstantDetail> {
  const key = input.key.trim()
  const now = stamp()

  const [existing] = await db
    .select({ id: schema.constants.id })
    .from(schema.constants)
    .where(eq(schema.constants.key, key))
    .limit(1)

  if (existing) {
    throw createError({ statusCode: 409, message: `Constant key "${key}" already exists.` })
  }

  const [row] = await db
    .insert(schema.constants)
    .values({
      group: input.group,
      key,
      type: input.type,
      value: input.value,
      label: input.label.trim(),
      description: input.description?.trim() || null,
      isActive: input.isActive ? 1 : 0,
      isPrivate: input.isPrivate ? 1 : 0,
      createdAt: now,
      updatedAt: now,
    })
    .returning()

  if (!row) {
    throw createError({ statusCode: 500, message: 'Constant insert failed.' })
  }

  clearConstantCache()
  return mapConstant(row)
}
