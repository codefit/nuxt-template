import { ResultDialog } from '#components'
import type { BulkResult } from '#shared/types/ui/data-table'

export function useResultDialog() {
  const overlay = useOverlay()

  return (result: BulkResult): Promise<boolean> => {
    const modal = overlay.create(ResultDialog, {
      destroyOnClose: true,
      props: result,
    })

    return modal.open()
  }
}
