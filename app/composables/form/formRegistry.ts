import type { Component } from 'vue'
import type { FormLoader } from '#shared/types/ui/form'

const loaders: Record<string, FormLoader> = {
  article: () => import('~/components/dashboard/form/articles/ArticleForm.vue'),
  author: () => import('~/components/dashboard/form/authors/AuthorForm.vue'),
  language: () => import('~/components/dashboard/form/languages/LanguageForm.vue'),
}

/** Register a resource form for `useFormSlideover({ type })`. */
export function registerForm(type: string, loader: FormLoader): void {
  loaders[type] = loader
}

export async function resolveForm(type: string): Promise<Component> {
  const loader = loaders[type]
  if (!loader) {
    throw new Error(`Form type "${type}" is not registered.`)
  }
  const mod = await loader()
  return mod.default
}

export function listFormTypes(): string[] {
  return Object.keys(loaders)
}
