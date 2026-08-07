/** Soft filled inputs — larger touch targets for auth forms. */
export const authInputUi = {
  base: 'h-14 min-h-14 rounded-2xl bg-[#eef0f3] px-4 text-base ring-0 placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-300 dark:bg-neutral-800',
} as const

export const authSubmitClass
  = 'mt-1 h-14 min-h-14 rounded-full bg-black text-base font-semibold text-white hover:bg-neutral-800 disabled:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200'

export function authErrorMessage(err: unknown, fallback: string): string {
  if (
    err
    && typeof err === 'object'
    && 'data' in err
    && err.data
    && typeof err.data === 'object'
    && 'message' in err.data
    && typeof err.data.message === 'string'
    && err.data.message.trim()
  ) {
    return err.data.message
  }

  return fallback
}
