import { Hash } from '@adonisjs/hash'
import { Scrypt } from '@adonisjs/hash/drivers/scrypt'

/** Same defaults as nuxt-auth-utils — usable outside Nitro (seed scripts). */
const hash = new Hash(new Scrypt({}))

export async function hashPlain(password: string): Promise<string> {
  return await hash.make(password)
}

export async function verifyPlain(
  hashedPassword: string,
  plainPassword: string,
): Promise<boolean> {
  return await hash.verify(hashedPassword, plainPassword)
}
