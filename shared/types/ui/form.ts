import type { Component } from 'vue'

/** Active translation locale hint shown next to field labels. */
export interface FormLocaleHint {
  code: string
  icon?: string | null
  name?: string
}

/** Create / edit / copy — shared by every resource form slideover. */
export type FormMode = 'create' | 'edit' | 'copy'

/** Result resolved when a form slideover closes (`emit('close', result)`). */
export interface FormResult<T = unknown> {
  ok: boolean
  mode: FormMode
  data?: T
  cancelled?: boolean
}

/** Pending media file — prepared for upload; backend may ignore binary for now. */
export interface PendingMedia {
  id: string
  mime: string
  name: string
  size: number
  field: string
  previewUrl?: string
}

/** Options passed into `useFormSlideover().open()`. */
export interface FormSlideoverOptions<TInitial = unknown> {
  type: string
  mode: FormMode
  id?: number | string
  ui?: { content?: string }
  title?: string
  initial?: TInitial
  description?: string
}

/** Props every resource form component receives from FormSlideover. */
export interface FormHostProps<TInitial = unknown> {
  id?: number | string
  mode: FormMode
  initial?: TInitial
}

/** Emit contract for resource forms hosted in FormSlideover. */
export type FormHostEmits<T = unknown> = {
  submit: [payload: T]
  cancel: []
}

/** Lazy form component loader registered per resource type. */
export type FormLoader = () => Promise<{ default: Component }>
