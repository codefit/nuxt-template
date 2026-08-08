import { eq } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { ConstantDetail } from '#shared/types/dto/constant'
import { clearConstantCache } from '~~/server/services/cache/constants'
import { getConstantById } from '~~/server/services/constants/getById'
import type { ConstantUpdateParsed } from '~~/server/services/constants/schema'

export async function updateConstant(
  id: number,
  input: ConstantUpdateParsed,
): Promise<ConstantDetail> {
  const [row] = await db
    .select({ id: schema.constants.id })
    .from(schema.constants)
    .where(eq(schema.constants.id, id))
    .limit(1)

  if (!row) {
    throw createError({ statusCode: 404, message: 'Constant not found.' })
  }

  await db
    .update(schema.constants)
    .set({
      group: input.group,
      type: input.type,
      value: input.value,
      label: input.label.trim(),
      description: input.description?.trim() || null,
      isActive: input.isActive ? 1 : 0,
      isPrivate: input.isPrivate ? 1 : 0,
      updatedAt: new Date(),
    })
    .where(eq(schema.constants.id, id))

  clearConstantCache()

  const detail = await getConstantById(id)
  if (!detail) {
    throw createError({
      statusCode: 500,
      message: 'Constant was updated but could not be loaded.',
    })
  }

  return detail
}
