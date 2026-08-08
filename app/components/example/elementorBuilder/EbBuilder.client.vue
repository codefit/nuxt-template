<script setup lang="ts">
/**
 * Elementor-like page builder (example). Widgets live in ./widgets.
 */
import { BLOCKS } from './blocks'
import { createId, createWidget } from './defaults'
import {
  CANVAS_MAX,
  SECTION_GRID,
  colClasses,
  colsFromSpans,
  createCols,
  gapClass,
  parseColSpans,
} from './grid'
import { pluginMeta } from './plugins'
import { createDesign, designStyle } from './design'
import { randomHeading, randomText } from './lorem'
import { createColumnSpacing, createSectionSpacing, spacingStyle } from './spacing'
import { downloadPreviewHtml } from './exportHtml'
import type {
  CanvasMaxId,
  ColumnNode,
  DragPayload,
  PluginId,
  ResponsiveCols,
  SectionNode,
  Selection,
  WidgetNode,
} from './types'
import ElementorInspectorRail from './ElementorInspectorRail.vue'
import ElementorLibraryPanel from './ElementorLibraryPanel.vue'
import ElementorWidgetHost from './ElementorWidgetHost.vue'

const createColumn = (cols: ResponsiveCols = createCols(12)): ColumnNode => ({
  id: createId(),
  cols: structuredClone(cols),
  spacing: createColumnSpacing(),
  surface: 'plain',
  design: createDesign(),
  widgets: [],
})

const createSection = (colsList: ResponsiveCols[] = [createCols(12)]): SectionNode => ({
  id: createId(),
  gap: 24,
  spacing: createSectionSpacing(),
  design: createDesign('', 16),
  columns: colsList.map((cols) => createColumn(cols)),
})

const blockStyle = (spacing: SectionNode['spacing'], design: SectionNode['design']) => ({
  ...spacingStyle(spacing),
  ...designStyle(design),
})

const sections = ref<SectionNode[]>([])
const selected = ref<Selection>(null)
const preview = ref(false)
const libraryOpen = ref(false)
const inspectorOpen = ref(false)
const libraryTab = ref<'blocks' | 'structure' | 'widgets'>('blocks')
const dragOver = ref<string | null>(null)
const dragging = ref<DragPayload | null>(null)
const canvasMax = ref<CanvasMaxId>('xl')

const canvasMaxMeta = computed(() => CANVAS_MAX.find((c) => c.id === canvasMax.value)!)
const canvasClass = computed(() => `${canvasMaxMeta.value.class} mx-auto w-full`)

const selectedSection = computed(() => {
  if (!selected.value) return null
  return sections.value.find((s) => s.id === selected.value!.sectionId) ?? null
})

const selectedColumn = computed(() => {
  if (!selectedSection.value || selected.value?.kind === 'section') return null
  return selectedSection.value.columns.find((c) => c.id === (selected.value as { columnId: string }).columnId) ?? null
})

const selectedWidget = computed(() => {
  if (!selectedColumn.value || selected.value?.kind !== 'widget') return null
  return selectedColumn.value.widgets.find((w) => w.id === selected.value!.widgetId) ?? null
})

const selectedWidgetIndex = computed(() => {
  if (!selectedColumn.value || !selectedWidget.value) return -1
  return selectedColumn.value.widgets.findIndex((w) => w.id === selectedWidget.value!.id)
})

const structureLabel = computed(() => {
  if (!selected.value) return 'Nic nevybráno'
  if (selected.value.kind === 'section') return 'Sekce'
  if (selected.value.kind === 'column') return 'Sloupec'
  return pluginMeta(selectedWidget.value?.plugin ?? 'heading').label
})

const isNarrow = () =>
  import.meta.client && window.matchMedia('(max-width: 1023px)').matches

const openLibrary = (tab: 'blocks' | 'structure' | 'widgets' = 'blocks') => {
  libraryTab.value = tab
  libraryOpen.value = true
  inspectorOpen.value = false
}

const onEmptyColumn = (sectionId: string, columnId: string) => {
  selected.value = { kind: 'column', sectionId, columnId }
  if (isNarrow()) openLibrary('widgets')
}

const sectionClass = (section: SectionNode) => `${SECTION_GRID} ${gapClass(section.gap)}`

const columnSurfaceClass = (surface: ColumnNode['surface']) =>
  surface === 'card'
    ? 'h-full rounded-2xl bg-white shadow-[0_10px_40px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 transition hover:shadow-[0_16px_50px_rgba(15,23,42,0.1)]'
    : 'h-full'

const insertBlock = (blockId: string) => {
  const def = BLOCKS.find((b) => b.id === blockId)
  if (!def) return
  const built = def.build()
  sections.value.push(...built)
  const first = built[0]
  if (first) selected.value = { kind: 'section', sectionId: first.id }
}

const applyCustomLayout = (raw: string) => {
  const spans = parseColSpans(raw)
  if (!spans?.length) return
  addSection(colsFromSpans(spans))
}

const setDrag = (event: DragEvent, payload: DragPayload) => {
  dragging.value = payload
  event.dataTransfer!.effectAllowed = payload.type === 'section' || payload.type === 'column' ? 'move' : 'copy'
  event.dataTransfer!.setData('application/x-elementor', JSON.stringify(payload))
}

const readDrag = (event: DragEvent): DragPayload | null => {
  const raw = event.dataTransfer?.getData('application/x-elementor')
  if (raw) {
    try {
      return JSON.parse(raw) as DragPayload
    }
    catch {
      /* fall through */
    }
  }
  return dragging.value
}

const clearDrag = () => {
  dragging.value = null
  dragOver.value = null
}

const addSection = (colsList: ResponsiveCols[] = [createCols(12)], afterId?: string) => {
  const section = createSection(colsList)
  if (!afterId) sections.value.push(section)
  else {
    const index = sections.value.findIndex((s) => s.id === afterId)
    sections.value.splice(index + 1, 0, section)
  }
  selected.value = { kind: 'section', sectionId: section.id }
}

const removeSection = (sectionId: string) => {
  sections.value = sections.value.filter((s) => s.id !== sectionId)
  if (selected.value?.sectionId === sectionId) selected.value = null
}

const duplicateSection = (sectionId: string) => {
  const source = sections.value.find((s) => s.id === sectionId)
  if (!source) return
  const clone: SectionNode = {
    ...structuredClone(toRaw(source)),
    id: createId(),
    columns: source.columns.map((col) => ({
      ...structuredClone(toRaw(col)),
      id: createId(),
      widgets: col.widgets.map((w) => ({
        ...structuredClone(toRaw(w)),
        id: createId(),
      })),
    })),
  }
  const index = sections.value.findIndex((s) => s.id === sectionId)
  sections.value.splice(index + 1, 0, clone)
  selected.value = { kind: 'section', sectionId: clone.id }
}

const addColumn = (sectionId: string) => {
  const section = sections.value.find((s) => s.id === sectionId)
  if (!section) return
  const column = createColumn(createCols(12, { md: 6 }))
  section.columns.push(column)
  selected.value = { kind: 'column', sectionId, columnId: column.id }
}

const removeColumn = (sectionId: string, columnId: string) => {
  const section = sections.value.find((s) => s.id === sectionId)
  if (!section) return
  section.columns = section.columns.filter((c) => c.id !== columnId)
  if (selected.value && 'columnId' in selected.value && selected.value.columnId === columnId) {
    selected.value = section.columns.length
      ? { kind: 'section', sectionId }
      : null
  }
  if (!section.columns.length) removeSection(sectionId)
}

const insertWidget = (sectionId: string, columnId: string, plugin: PluginId) => {
  const section = sections.value.find((s) => s.id === sectionId)
  const column = section?.columns.find((c) => c.id === columnId)
  if (!column) return
  const widget = createWidget(plugin) as WidgetNode
  column.widgets.push(widget)
  selected.value = { kind: 'widget', sectionId, columnId, widgetId: widget.id }
}

const removeWidget = (sectionId: string, columnId: string, widgetId: string) => {
  const section = sections.value.find((s) => s.id === sectionId)
  const column = section?.columns.find((c) => c.id === columnId)
  if (!column) return
  column.widgets = column.widgets.filter((w) => w.id !== widgetId)
  selected.value = { kind: 'column', sectionId, columnId }
}

const fillRandomText = (widget: WidgetNode) => {
  if (widget.plugin === 'heading') {
    widget.data.text = randomHeading()
    return
  }
  if (widget.plugin === 'text') {
    widget.data.text = randomText()
  }
}

const applyPreset = (sectionId: string, colsList: ResponsiveCols[]) => {
  const section = sections.value.find((s) => s.id === sectionId)
  if (!section) return
  const kept = section.columns
  section.columns = colsList.map((cols, index) => {
    const existing = kept[index]
    if (existing) return { ...existing, cols: structuredClone(cols) }
    return createColumn(cols)
  })
  selected.value = { kind: 'section', sectionId }
}

const moveSection = (fromId: string, toId: string) => {
  if (fromId === toId) return
  const from = sections.value.findIndex((s) => s.id === fromId)
  const to = sections.value.findIndex((s) => s.id === toId)
  if (from < 0 || to < 0) return
  const [item] = sections.value.splice(from, 1)
  if (!item) return
  sections.value.splice(to, 0, item)
}

const shiftSection = (index: number, delta: -1 | 1) => {
  const target = index + delta
  if (target < 0 || target >= sections.value.length) return
  const list = sections.value
  const a = list[index]
  const b = list[target]
  if (!a || !b) return
  list[index] = b
  list[target] = a
}

const moveColumn = (sectionId: string, fromId: string, toId: string) => {
  if (fromId === toId) return
  const section = sections.value.find((s) => s.id === sectionId)
  if (!section) return
  const from = section.columns.findIndex((c) => c.id === fromId)
  const to = section.columns.findIndex((c) => c.id === toId)
  if (from < 0 || to < 0) return
  const [item] = section.columns.splice(from, 1)
  if (!item) return
  section.columns.splice(to, 0, item)
}

const onCanvasDrop = (event: DragEvent) => {
  event.preventDefault()
  const payload = readDrag(event)
  clearDrag()
  if (payload?.type === 'preset') addSection(payload.cols)
}

const onSectionDrop = (event: DragEvent, sectionId: string) => {
  event.preventDefault()
  event.stopPropagation()
  const payload = readDrag(event)
  clearDrag()
  if (!payload) return
  if (payload.type === 'preset') addSection(payload.cols, sectionId)
  if (payload.type === 'section') moveSection(payload.sectionId, sectionId)
}

const onColumnDrop = (event: DragEvent, sectionId: string, columnId: string) => {
  event.preventDefault()
  event.stopPropagation()
  const payload = readDrag(event)
  clearDrag()
  if (!payload) return
  if (payload.type === 'plugin') insertWidget(sectionId, columnId, payload.plugin)
  if (payload.type === 'column' && payload.sectionId === sectionId) {
    moveColumn(sectionId, payload.columnId, columnId)
  }
}

const toast = useToast()
const confirm = useConfirmDialog()
const exporting = ref(false)

const onExport = async () => {
  await navigator.clipboard.writeText(JSON.stringify(sections.value, null, 2))
  toast.add({ title: 'JSON zkopírován', color: 'success' })
}

const onDownloadHtml = async () => {
  if (exporting.value) return
  exporting.value = true
  try {
    await downloadPreviewHtml(sections.value, {
      maxWidth: canvasMaxMeta.value.width,
      title: 'PageBuilder preview',
    })
    toast.add({ title: 'HTML náhled stažen', color: 'success' })
  } catch {
    toast.add({ title: 'Export selhal', color: 'error' })
  } finally {
    exporting.value = false
  }
}

const onReset = async () => {
  if (!sections.value.length) return
  const ok = await confirm({
    title: 'Vymazat celý dokument?',
    description: 'Všechny sekce a widgety se zahodí. Tuto akci nelze vrátit zpět.',
    confirmLabel: 'Vymazat',
    confirmColor: 'error',
  })
  if (!ok) return
  sections.value = []
  selected.value = null
  preview.value = false
  canvasMax.value = 'xl'
}

const togglePreview = () => {
  preview.value = !preview.value
  if (preview.value) {
    selected.value = null
    libraryOpen.value = false
    inspectorOpen.value = false
  }
}

watch(selected, (next) => {
  if (preview.value || !next) return
  // Na mobilu otevři inspector jen u widgetu (nastavení vloženého obsahu),
  // ne po přidání sekce/sloupce.
  if (isNarrow() && next.kind === 'widget') inspectorOpen.value = true
})

watch(preview, (on) => {
  if (!on) return
  libraryOpen.value = false
  inspectorOpen.value = false
})
</script>

<template>
  <div class="el-builder flex h-dvh flex-col bg-[#eef0f3] text-neutral-800">
    <header class="mx-3 mt-3 flex h-14 shrink-0 items-center gap-3 rounded-2xl bg-white px-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div class="flex items-center gap-2.5">
        <span class="flex size-8 items-center justify-center rounded-xl bg-neutral-900 text-white">
          <UIcon
            name="i-lucide-layout-template"
            class="size-4"
          />
        </span>
        <div class="leading-tight">
          <span class="block text-sm font-semibold tracking-tight text-neutral-900">PageBuilder</span>
          <span class="hidden text-[10px] text-neutral-400 sm:block">Obsah produktu & článků</span>
        </div>
      </div>

      <div class="mx-auto hidden max-w-xs flex-1 items-center justify-center md:flex">
        <span class="truncate rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500">
          Untitled draft · {{ canvasMaxMeta.label }}
        </span>
      </div>

      <div class="ml-auto flex items-center gap-1.5">
        <UButton
          v-show="!preview"
          size="sm"
          color="neutral"
          variant="soft"
          icon="i-lucide-panel-left"
          square
          class="lg:hidden"
          :ui="libraryOpen ? { base: 'bg-neutral-900 text-white hover:bg-neutral-800' } : undefined"
          title="Knihovna"
          @click="libraryOpen = !libraryOpen"
        />
        <UButton
          v-show="!preview"
          size="sm"
          color="neutral"
          variant="soft"
          icon="i-lucide-panel-right"
          square
          class="lg:hidden"
          :ui="inspectorOpen ? { base: 'bg-neutral-900 text-white hover:bg-neutral-800' } : undefined"
          title="Inspector"
          @click="inspectorOpen = !inspectorOpen"
        />
        <div class="mr-1 hidden items-center gap-1.5 lg:flex">
          <USelect
            v-model="canvasMax"
            :items="CANVAS_MAX.map((opt) => ({ label: opt.label, value: opt.id }))"
            value-key="value"
            size="sm"
            color="neutral"
            variant="soft"
            class="w-36"
            :ui="{ base: 'rounded-full justify-between' }"
          />
        </div>
        <UButton
          size="sm"
          color="neutral"
          variant="ghost"
          icon="i-lucide-rotate-ccw"
          square
          @click="onReset"
        />
        <UButton
          size="sm"
          color="neutral"
          variant="soft"
          icon="i-lucide-clipboard-copy"
          class="hidden sm:inline-flex"
          label="JSON"
          @click="onExport"
        />
        <UButton
          size="sm"
          color="neutral"
          variant="soft"
          icon="i-lucide-download"
          class="hidden sm:inline-flex"
          label="HTML"
          :loading="exporting"
          @click="onDownloadHtml"
        />
        <UButton
          size="sm"
          :color="preview ? 'neutral' : undefined"
          :variant="preview ? 'soft' : 'solid'"
          :ui="preview ? undefined : { base: 'bg-neutral-900 text-white hover:bg-neutral-800' }"
          :icon="preview ? 'i-lucide-pencil' : 'i-lucide-eye'"
          :label="preview ? 'Edit' : 'Preview'"
          @click="togglePreview"
        />
      </div>
    </header>

    <div class="flex min-h-0 flex-1 gap-3 p-3">
      <aside
        v-show="!preview"
        class="hidden w-[272px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)] lg:flex"
      >
        <ElementorLibraryPanel
          v-model:tab="libraryTab"
          @insert-block="insertBlock"
          @add-section="addSection"
          @apply-custom="applyCustomLayout"
          @drag-start="setDrag"
          @drag-end="clearDrag"
        />
      </aside>

      <USlideover
        v-model:open="libraryOpen"
        side="left"
        title="Knihovna"
        :overlay="false"
        :ui="{
          content: 'max-w-none w-[min(100vw,18rem)] sm:w-80 lg:hidden',
          body: 'flex min-h-0 flex-1 flex-col overflow-hidden p-0',
        }"
      >
        <template #body>
          <ElementorLibraryPanel
            v-model:tab="libraryTab"
            @insert-block="insertBlock"
            @add-section="addSection"
            @apply-custom="applyCustomLayout"
            @drag-start="setDrag"
            @drag-end="clearDrag"
          />
        </template>
      </USlideover>

      <main class="relative min-w-0 flex-1 overflow-hidden rounded-2xl bg-[#f7f8fa] shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div
          v-if="preview"
          class="absolute inset-0 overflow-y-auto px-5 py-8"
        >
          <div :class="canvasClass">
            <section
              v-for="section in sections"
              :key="`preview-${section.id}`"
              :class="sectionClass(section)"
              :style="blockStyle(section.spacing, section.design)"
            >
              <div
                v-for="column in section.columns"
                :key="`preview-${column.id}`"
                :class="[
                  'min-w-0 h-full space-y-3',
                  colClasses(column.cols),
                  columnSurfaceClass(column.surface),
                ]"
                :style="blockStyle(column.spacing, column.design)"
              >
                <div
                  v-for="(widget, wi) in column.widgets"
                  :key="`preview-${widget.id}`"
                  :style="spacingStyle(widget.spacing)"
                >
                  <ElementorWidgetHost
                    v-model="column.widgets[wi]"
                    preview
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        <div
          v-show="!preview"
          class="absolute inset-0 overflow-y-auto px-5 py-8"
          @dragover.prevent
          @drop="onCanvasDrop"
        >
          <div :class="canvasClass">
            <div
              v-for="(section, sectionIndex) in sections"
              :key="section.id"
              class="group/section relative"
              :class="[
                selected?.kind === 'section' && selected.sectionId === section.id ? 'ring-2 ring-neutral-900/15 ring-offset-4 ring-offset-[#f7f8fa]' : '',
                dragOver === `section:${section.id}` ? 'ring-2 ring-dashed ring-neutral-400' : '',
              ]"
              @dragover.prevent="dragOver = `section:${section.id}`"
              @dragleave="dragOver === `section:${section.id}` && (dragOver = null)"
              @drop="onSectionDrop($event, section.id)"
              @click.stop="selected = { kind: 'section', sectionId: section.id }"
            >
              <div
                class="absolute -top-3 left-3 z-10 flex items-center gap-1 opacity-0 transition group-hover/section:opacity-100"
                :class="selected?.sectionId === section.id ? 'opacity-100' : ''"
              >
                <button
                  type="button"
                  class="flex cursor-grab items-center gap-1 rounded-full bg-neutral-900 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white shadow-sm active:cursor-grabbing"
                  draggable="true"
                  @dragstart.stop="setDrag($event, { type: 'section', sectionId: section.id })"
                  @dragend="clearDrag"
                  @click.stop
                >
                  <UIcon
                    name="i-lucide-grip-vertical"
                    class="size-3"
                  />
                  Sekce
                </button>
                <button
                  type="button"
                  class="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 shadow-sm hover:bg-neutral-300 disabled:pointer-events-none disabled:opacity-35"
                  :disabled="sectionIndex === 0"
                  title="Posunout nahoru"
                  @click.stop="shiftSection(sectionIndex, -1)"
                >
                  <UIcon
                    name="i-lucide-chevron-up"
                    class="size-3.5"
                  />
                </button>
                <button
                  type="button"
                  class="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-600 shadow-sm hover:bg-neutral-300 disabled:pointer-events-none disabled:opacity-35"
                  :disabled="sectionIndex >= sections.length - 1"
                  title="Posunout dolů"
                  @click.stop="shiftSection(sectionIndex, 1)"
                >
                  <UIcon
                    name="i-lucide-chevron-down"
                    class="size-3.5"
                  />
                </button>
                <button
                  type="button"
                  class="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm hover:bg-orange-600"
                  title="Duplikovat"
                  @click.stop="duplicateSection(section.id)"
                >
                  <UIcon
                    name="i-lucide-copy"
                    class="size-3.5"
                  />
                </button>
                <button
                  type="button"
                  class="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600"
                  title="Smazat"
                  @click.stop="removeSection(section.id)"
                >
                  <UIcon
                    name="i-lucide-trash-2"
                    class="size-3.5"
                  />
                </button>
              </div>

              <div
                class="min-h-16 shadow-[0_1px_3px_rgba(15,23,42,0.05)] ring-1 ring-black/4"
                :class="[
                  sectionClass(section),
                  section.design.background ? '' : 'bg-white',
                ]"
                :style="blockStyle(section.spacing, section.design)"
              >
                <div
                  v-for="column in section.columns"
                  :key="column.id"
                  class="group/column relative min-w-0 h-full"
                  :class="[
                    colClasses(column.cols),
                    columnSurfaceClass(column.surface),
                    selected?.kind !== 'section' && selected && 'columnId' in selected && selected.columnId === column.id
                      ? 'rounded-xl ring-2 ring-sky-400/50'
                      : column.surface === 'plain' ? 'rounded-xl ring-1 ring-inset ring-transparent hover:ring-neutral-200' : '',
                    dragOver === `column:${column.id}` ? 'rounded-xl ring-2 ring-dashed ring-neutral-400 bg-neutral-50/80' : '',
                  ]"
                  :style="blockStyle(column.spacing, column.design)"
                  @dragover.prevent.stop="dragOver = `column:${column.id}`"
                  @dragleave="dragOver === `column:${column.id}` && (dragOver = null)"
                  @drop="onColumnDrop($event, section.id, column.id)"
                  @click.stop="selected = { kind: 'column', sectionId: section.id, columnId: column.id }"
                >
                  <div class="absolute top-2 right-2 z-10 flex gap-1 opacity-0 transition group-hover/column:opacity-100">
                    <button
                      type="button"
                      class="inline-flex size-7 shrink-0 cursor-grab items-center justify-center rounded-full bg-neutral-900 text-white shadow-sm active:cursor-grabbing"
                      draggable="true"
                      @dragstart.stop="setDrag($event, { type: 'column', sectionId: section.id, columnId: column.id })"
                      @dragend="clearDrag"
                      @click.stop
                    >
                      <UIcon
                        name="i-lucide-grip-vertical"
                        class="size-3.5"
                      />
                    </button>
                    <button
                      type="button"
                      class="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600"
                      @click.stop="removeColumn(section.id, column.id)"
                    >
                      <UIcon
                        name="i-lucide-x"
                        class="size-3.5"
                      />
                    </button>
                  </div>

                  <div
                    v-if="column.widgets.length"
                    class="flex h-full flex-col items-start gap-3"
                  >
                    <div
                      v-for="(widget, wi) in column.widgets"
                      :key="widget.id"
                      class="relative w-full"
                      :class="selected?.kind === 'widget' && selected.widgetId === widget.id ? 'rounded-xl ring-2 ring-sky-400/60 ring-offset-2' : ''"
                      @click.stop="selected = { kind: 'widget', sectionId: section.id, columnId: column.id, widgetId: widget.id }"
                    >
                      <div class="mb-1.5 flex items-center justify-between gap-2">
                        <div class="flex min-w-0 items-center gap-1">
                          <span class="flex items-center gap-1.5 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold text-neutral-500">
                            <UIcon
                              :name="pluginMeta(widget.plugin).icon"
                              class="size-3"
                            />
                            {{ pluginMeta(widget.plugin).label }}
                          </span>
                          <button
                            v-if="widget.plugin === 'text' || widget.plugin === 'heading'"
                            type="button"
                            class="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-neutral-400 transition hover:bg-sky-50 hover:text-sky-600"
                            title="Vygenerovat text"
                            @click.stop="fillRandomText(widget)"
                          >
                            <UIcon
                              name="i-lucide-sparkles"
                              class="size-3"
                            />
                          </button>
                        </div>
                        <button
                          type="button"
                          class="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600"
                          @click.stop="removeWidget(section.id, column.id, widget.id)"
                        >
                          <UIcon
                            name="i-lucide-trash-2"
                            class="size-3"
                          />
                        </button>
                      </div>
                      <div
                        class="w-full"
                        :style="spacingStyle(widget.spacing)"
                      >
                        <ElementorWidgetHost v-model="column.widgets[wi]" />
                      </div>
                    </div>
                  </div>

                  <button
                    v-else
                    type="button"
                    class="flex min-h-28 w-full flex-col items-center justify-center gap-2.5 rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50 p-5 text-center transition hover:border-neutral-300 hover:bg-neutral-50"
                    @click.stop="onEmptyColumn(section.id, column.id)"
                  >
                    <UIcon
                      name="i-lucide-circle-plus"
                      class="size-6 text-neutral-300"
                    />
                    <p class="text-xs text-neutral-400">
                      <span class="lg:hidden">Přidat widget</span>
                      <span class="hidden lg:inline">Přetáhni widget sem</span>
                    </p>
                    <UButton
                      size="xs"
                      color="neutral"
                      variant="soft"
                      icon="i-lucide-heading"
                      label="Nadpis"
                      class="pointer-events-auto"
                      @click.stop="insertWidget(section.id, column.id, 'heading')"
                    />
                  </button>
                </div>
              </div>
            </div>

            <div
              v-if="!sections.length"
              class="mb-4 rounded-2xl bg-white px-6 py-20 text-center shadow-[0_1px_3px_rgba(15,23,42,0.05)] ring-1 ring-black/4"
            >
              <span class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-neutral-100">
                <UIcon
                  name="i-lucide-layout-template"
                  class="size-7 text-neutral-400"
                />
              </span>
              <p class="mb-1 text-sm font-semibold text-neutral-800">
                Prázdný editor
              </p>
              <p class="mb-5 text-xs text-neutral-400">
                Přidej sekci, grid layout nebo hotový block z knihovny.
              </p>
              <UButton
                size="sm"
                color="neutral"
                :ui="{ base: 'bg-neutral-900 text-white hover:bg-neutral-800' }"
                icon="i-lucide-plus"
                label="Přidat sekci"
                @click="addSection()"
              />
            </div>

            <button
              v-else
              type="button"
              class="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-neutral-300 bg-white/70 py-5 text-sm font-medium text-neutral-500 transition hover:border-neutral-400 hover:bg-white hover:text-neutral-800"
              @click="addSection()"
            >
              <UIcon
                name="i-lucide-plus"
                class="size-4"
              />
              Přidat sekci
            </button>
          </div>
        </div>
      </main>

      <aside
        v-show="!preview"
        class="hidden w-[300px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)] lg:flex"
      >
        <div class="px-4 py-3.5">
          <p class="text-[11px] font-semibold text-neutral-400">
            Inspector
          </p>
          <p class="text-sm font-semibold text-neutral-900">
            {{ structureLabel }}
          </p>
        </div>
        <ElementorInspectorRail
          :selected="selected"
          :section="selectedSection"
          :column="selectedColumn"
          :widget-index="selectedWidgetIndex"
          v-model:canvas-max="canvasMax"
          @apply-preset="applyPreset"
          @add-column="addColumn"
        />
      </aside>

      <USlideover
        v-model:open="inspectorOpen"
        side="right"
        :title="structureLabel"
        :overlay="false"
        :ui="{
          content: 'max-w-none w-[min(100vw,20rem)] sm:w-[22rem] lg:hidden',
          body: 'flex min-h-0 flex-1 flex-col overflow-hidden p-0',
        }"
      >
        <template #body>
          <ElementorInspectorRail
            :selected="selected"
            :section="selectedSection"
            :column="selectedColumn"
            :widget-index="selectedWidgetIndex"
            show-canvas-select
            v-model:canvas-max="canvasMax"
            @apply-preset="applyPreset"
            @add-column="addColumn"
          />
        </template>
      </USlideover>
    </div>
  </div>
</template>
