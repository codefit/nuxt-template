import { FormSlideover } from '#components'
import type { FormResult, FormSlideoverOptions } from '#shared/types/form'

/**
 * Programmatic layered form slideover.
 * Uses Nuxt UI `useOverlay` + `destroyOnClose` so closed panels are removed from DOM.
 *
 * Nesting (unlimited depth) — call `open()` again from inside a form:
 * ```ts
 * const nested = await open({ type: 'author', mode: 'create' })
 * if (nested?.ok) {
 *   // refresh autocomplete + select nested.data
 * }
 * ```
 * Register new resource forms via `registerForm('author', () => import('…'))`.
 */
/** Nesting depth — only the root panel renders a dim overlay. */
let stack = 0

export function useFormSlideover() {
  const overlay = useOverlay()

  async function open<T = unknown>(
    options: FormSlideoverOptions,
  ): Promise<FormResult<T> | undefined> {
    const depth = stack
    stack += 1

    try {
      const panel = overlay.create(FormSlideover, {
        destroyOnClose: true,
        props: {
          type: options.type,
          mode: options.mode,
          title: options.title,
          description: options.description,
          id: options.id,
          initial: options.initial,
          depth,
          ui: options.ui,
        },
      })

      return await panel.open() as Promise<FormResult<T> | undefined>
    }
    finally {
      stack = Math.max(0, stack - 1)
    }
  }

  return { open }
}
