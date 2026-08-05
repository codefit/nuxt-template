import { ConfirmDialog } from '#components'

export interface ConfirmDialogOptions {
  title: string
  description?: string
  cancelLabel?: string
  confirmLabel?: string
  confirmColor?: 'error' | 'primary' | 'neutral' | 'success' | 'warning' | 'info' | 'secondary'
}

export function useConfirmDialog() {
  const overlay = useOverlay()

  return (options: ConfirmDialogOptions): Promise<boolean> => {
    const modal = overlay.create(ConfirmDialog, {
      destroyOnClose: true,
      props: options,
    })

    return modal.open()
  }
}
