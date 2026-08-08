import { eq } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'
import type { ConstantDetail } from '#shared/types/dto/constant'
import { mapConstant } from '~~/server/services/constants/map'

export async function getConstantById(id: number): Promise<ConstantDetail | null> {
  const [row] = await db
    .select()
    .from(schema.constants)
    .where(eq(schema.constants.id, id))
    .limit(1)

  if (!row) {
    return null
  }

  return mapConstant(row)
}
