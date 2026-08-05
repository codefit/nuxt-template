import type { Component } from 'vue'

/** Active translation locale hint shown next to field labels. */
export interface FormLocaleHint {
  code: string
  name?: string
  icon?: string | null
}

/** Create / edit / copy — shared by every resource form slideover. */
export type FormMode = 'create' | 'edit' | 'copy'

/** Result resolved when a form slideover closes (`emit('close', result)`). */
export interface FormResult<T = unknown> {
  ok: boolean
  mode: FormMode
  /** Saved / created entity payload (for nesting callbacks). */
  data?: T
  /** True when user dismissed without saving. */
  cancelled?: boolean
}

/** Pending media file — prepared for upload; backend may ignore binary for now. */
export interface PendingMedia {
  id: string
  field: string
  name: string
  mime: string
  size: number
  /** Object URL for local preview only. */
  previewUrl?: string
}

/** Options passed into `useFormSlideover().open()`. */
export interface FormSlideoverOptions<TInitial = unknown> {
  /** Registry key, e.g. `article`. */
  type: string
  mode: FormMode
  title?: string
  description?: string
  /** Existing id for edit / copy source. */
  id?: number | string
  /** Prefill (copy) or partial overrides. */
  initial?: TInitial
  /** Slideover width class override. */
  ui?: { content?: string }
}

/** Props every resource form component receives from FormSlideover. */
export interface FormHostProps<TInitial = unknown> {
  mode: FormMode
  id?: number | string
  initial?: TInitial
}

/** Emit contract for resource forms hosted in FormSlideover. */
export type FormHostEmits<T = unknown> = {
  submit: [payload: T]
  cancel: []
}

/** Lazy form component loader registered per resource type. */
export type FormLoader = () => Promise<{ default: Component }>
