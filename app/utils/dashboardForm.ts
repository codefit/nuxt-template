const fieldSurface
  = 'rounded-xl bg-[#eef0f3] ring-0 placeholder:text-neutral-400 hover:bg-[#e8eaee] focus-visible:bg-[#eef0f3] focus-visible:ring-2 focus-visible:ring-neutral-300 disabled:bg-[#eef0f3]/70 dark:bg-neutral-800 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800 dark:focus-visible:ring-neutral-600'

/** Soft filled admin fields — slightly taller than default lg. */
export const dashboardFieldUi = {
  base: `h-11 min-h-11 ${fieldSurface}`,
} as const

export const dashboardTextareaUi = {
  base: fieldSurface,
} as const

export const dashboardFieldProps = {
  color: 'neutral' as const,
  variant: 'soft' as const,
  size: 'lg' as const,
}

export const dashboardThemeProps = {
  input: dashboardFieldProps,
  textarea: dashboardFieldProps,
  select: dashboardFieldProps,
  selectMenu: dashboardFieldProps,
  inputMenu: dashboardFieldProps,
}

export const dashboardThemeUi = {
  input: dashboardFieldUi,
  textarea: dashboardTextareaUi,
  select: dashboardFieldUi,
  selectMenu: dashboardFieldUi,
  inputMenu: dashboardFieldUi,
  formField: {
    label: 'font-semibold text-highlighted',
  },
}
