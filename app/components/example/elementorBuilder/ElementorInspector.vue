<script setup lang="ts">
import { createId } from './defaults'
import { pluginMeta } from './plugins'
import type { WidgetNode } from './types'
import ElementorColorSwatches from './ElementorColorSwatches.vue'
import ElementorIconPicker from './ElementorIconPicker.vue'
import ElementorSelect from './ElementorSelect.vue'
import ElementorSpacingFields from './ElementorSpacingFields.vue'
import { ICON_BOX_TONES } from './iconTones'

const widget = defineModel<WidgetNode>({ required: true })

const meta = computed(() => pluginMeta(widget.value.plugin))

const alignItems = [
  { label: 'Vlevo', value: 'left' },
  { label: 'Na střed', value: 'center' },
  { label: 'Vpravo', value: 'right' },
]

const addListItem = () => {
  if (widget.value.plugin !== 'icon-list') return
  widget.value.data.items.push({
    id: createId(),
    icon: 'i-lucide-check',
    text: 'Nová položka',
  })
}

const addSocial = () => {
  if (widget.value.plugin !== 'social') return
  widget.value.data.items.push({
    id: createId(),
    icon: 'i-lucide-globe',
    href: '#',
    label: 'Odkaz',
  })
}

const addTestimonial = () => {
  if (widget.value.plugin !== 'testimonials') return
  widget.value.data.items.push({
    id: createId(),
    quote: 'Citace…',
    author: 'Autor',
    role: 'Role',
  })
}

const addAccordion = () => {
  if (widget.value.plugin !== 'accordion') return
  widget.value.data.items.push({
    id: createId(),
    title: 'Nová sekce',
    body: 'Obsah…',
  })
}

const addToggle = () => {
  if (widget.value.plugin !== 'toggle') return
  widget.value.data.items.push({
    id: createId(),
    title: 'Nový toggle',
    body: 'Obsah…',
  })
}

const addTab = () => {
  if (widget.value.plugin !== 'tabs') return
  widget.value.data.items.push({
    id: createId(),
    title: `Tab ${widget.value.data.items.length + 1}`,
    body: 'Obsah…',
  })
}
</script>

<template>
  <div class="space-y-4">
    <div class="rounded-2xl bg-neutral-50 p-3.5">
      <p class="text-xs font-semibold text-neutral-800">
        {{ meta.label }}
      </p>
      <p class="mt-1 text-xs leading-relaxed text-neutral-500">
        {{ meta.description }}
      </p>
    </div>

    <ElementorSpacingFields v-model="widget.spacing" />

    <!-- Heading -->
    <template v-if="widget.plugin === 'heading'">
      <div class="w-full space-y-1.5">
        <label class="block text-xs font-semibold text-neutral-500">Text</label>
        <UInput
          v-model="widget.data.text"
          size="md"
          class="w-full"
          variant="soft"
        />
      </div>
      <ElementorSelect
        v-model="widget.data.tag"
        label="Tag"
        :items="['h1', 'h2', 'h3', 'h4', 'h5', 'h6']"
      />
      <ElementorSelect
        v-model="widget.data.align"
        label="Zarovnání"
        :items="alignItems"
      />
      <ElementorColorSwatches v-model="widget.data.color" />
      <p class="text-xs text-neutral-500">
        Nadpis edituj přímo na plátně (klikni a piš).
      </p>
    </template>

    <template v-else-if="widget.plugin === 'text'">
      <p class="text-xs text-neutral-500">
        Text edituj přímo na plátně (klikni a piš).
      </p>
      <ElementorSelect
        v-model="widget.data.size"
        label="Velikost"
        :items="[
          { label: 'Malý', value: 'sm' },
          { label: 'Běžný', value: 'base' },
          { label: 'Velký', value: 'lg' },
        ]"
      />
      <ElementorSelect
        v-model="widget.data.align"
        label="Zarovnání"
        :items="alignItems"
      />
      <ElementorColorSwatches v-model="widget.data.color" />
    </template>

    <template v-else-if="widget.plugin === 'button'">
      <div class="w-full space-y-1.5">
        <label class="block text-xs font-semibold text-neutral-500">Popisek</label>
        <UInput
          v-model="widget.data.label"
          size="md"
          class="w-full"
          variant="soft"
        />
      </div>
      <div class="w-full space-y-1.5">
        <label class="block text-xs font-semibold text-neutral-500">Odkaz</label>
        <UInput
          v-model="widget.data.href"
          size="md"
          class="w-full"
          variant="soft"
        />
      </div>
      <ElementorSelect
        v-model="widget.data.color"
        label="Barva"
        :items="['primary', 'neutral', 'error']"
      />
      <ElementorSelect
        v-model="widget.data.variant"
        label="Variant"
        :items="['solid', 'outline', 'soft', 'ghost', 'link']"
      />
      <ElementorSelect
        v-model="widget.data.align"
        label="Zarovnání"
        :items="alignItems"
      />
      <UCheckbox
        v-model="widget.data.block"
        label="Celá šířka"
      />
    </template>

    <template v-else-if="widget.plugin === 'icon'">
      <div class="space-y-1">
        <span class="text-xs font-medium text-neutral-600">Ikona</span>
        <ElementorIconPicker v-model="widget.data.name" />
      </div>
      <label class="block space-y-1">
        <span class="text-xs font-medium text-neutral-600">Velikost ({{ widget.data.size }}px)</span>
        <input
          v-model.number="widget.data.size"
          type="range"
          min="16"
          max="96"
          step="4"
          class="w-full accent-brand-800"
        >
      </label>
      <ElementorSelect
        v-model="widget.data.align"
        label="Zarovnání"
        :items="alignItems"
      />
      <UCheckbox
        v-model="widget.data.boxed"
        label="Pastelový box (karta)"
      />
      <div
        v-if="widget.data.boxed"
        class="space-y-1.5"
      >
        <span class="text-xs font-medium text-neutral-600">Tón boxu</span>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="tone in ICON_BOX_TONES"
            :key="tone.id"
            type="button"
            class="size-7 rounded-lg ring-offset-1 transition"
            :class="[
              tone.box,
              widget.data.boxTone === tone.id ? 'ring-2 ring-brand-800' : 'ring-1 ring-black/5',
            ]"
            :title="tone.label"
            @click="widget.data.boxTone = tone.id"
          />
        </div>
      </div>
      <ElementorColorSwatches
        v-if="!widget.data.boxed"
        v-model="widget.data.color"
      />
    </template>

    <template v-else-if="widget.plugin === 'image'">
      <p class="text-xs leading-relaxed text-neutral-500">
        Soubor zůstává jen v prohlížeči (blob URL). Na server se nic neodesílá.
      </p>
      <div class="w-full space-y-1.5">
        <label class="block text-xs font-semibold text-neutral-500">Alt text</label>
        <UInput
          v-model="widget.data.alt"
          size="md"
          class="w-full"
          variant="soft"
        />
      </div>
      <label class="block space-y-1.5">
        <span class="text-xs font-semibold text-neutral-500">Výška rámečku ({{ widget.data.height }}px)</span>
        <input
          v-model.number="widget.data.height"
          type="range"
          min="80"
          max="640"
          step="8"
          class="w-full accent-neutral-900"
        >
      </label>
      <label class="block space-y-1.5">
        <span class="text-xs font-semibold text-neutral-500">Zaoblení ({{ widget.data.radius }}px)</span>
        <input
          v-model.number="widget.data.radius"
          type="range"
          min="0"
          max="30"
          step="1"
          class="w-full accent-neutral-900"
        >
      </label>
      <ElementorSelect
        v-model="widget.data.objectFit"
        label="object-fit"
        :items="[
          { label: 'cover', value: 'cover' },
          { label: 'contain', value: 'contain' },
          { label: 'fill', value: 'fill' },
          { label: 'none', value: 'none' },
          { label: 'scale-down', value: 'scale-down' },
        ]"
      />
      <ElementorSelect
        v-model="widget.data.objectPosition"
        label="object-position"
        :items="[
          { label: 'center', value: 'center' },
          { label: 'top', value: 'top' },
          { label: 'bottom', value: 'bottom' },
          { label: 'left', value: 'left' },
          { label: 'right', value: 'right' },
        ]"
      />
    </template>

    <template v-else-if="widget.plugin === 'maps'">
      <label class="block space-y-1">
        <span class="text-xs font-medium text-neutral-600">Adresa / místo</span>
        <UInput
          v-model="widget.data.query"
          size="sm"
        />
      </label>
      <label class="block space-y-1">
        <span class="text-xs font-medium text-neutral-600">Výška ({{ widget.data.height }}px)</span>
        <input
          v-model.number="widget.data.height"
          type="range"
          min="160"
          max="560"
          step="20"
          class="w-full accent-brand-800"
        >
      </label>
      <label class="block space-y-1">
        <span class="text-xs font-medium text-neutral-600">Zoom ({{ widget.data.zoom }})</span>
        <input
          v-model.number="widget.data.zoom"
          type="range"
          min="3"
          max="20"
          step="1"
          class="w-full accent-brand-800"
        >
      </label>
    </template>

    <template v-else-if="widget.plugin === 'icon-list'">
      <div
        v-for="(item, index) in widget.data.items"
        :key="item.id"
        class="space-y-2 rounded-md border border-neutral-200 p-2"
      >
        <ElementorIconPicker
          v-model="item.icon"
          size="sm"
        />
        <UInput
          v-model="item.text"
          size="sm"
        />
        <UButton
          size="xs"
          color="error"
          variant="ghost"
          icon="i-lucide-trash-2"
          label="Smazat"
          @click="widget.data.items.splice(index, 1)"
        />
      </div>
      <UButton
        block
        size="sm"
        color="neutral"
        variant="soft"
        icon="i-lucide-plus"
        label="Přidat položku"
        @click="addListItem"
      />
    </template>

    <template v-else-if="widget.plugin === 'social'">
      <label class="block space-y-1">
        <span class="text-xs font-medium text-neutral-600">Velikost ({{ widget.data.size }}px)</span>
        <input
          v-model.number="widget.data.size"
          type="range"
          min="16"
          max="48"
          step="2"
          class="w-full accent-brand-800"
        >
      </label>
      <div
        v-for="(item, index) in widget.data.items"
        :key="item.id"
        class="space-y-2 rounded-md border border-neutral-200 p-2"
      >
        <ElementorIconPicker
          v-model="item.icon"
          size="sm"
        />
        <UInput
          v-model="item.label"
          size="sm"
          placeholder="Label"
        />
        <UInput
          v-model="item.href"
          size="sm"
          placeholder="URL"
        />
        <UButton
          size="xs"
          color="error"
          variant="ghost"
          icon="i-lucide-trash-2"
          label="Smazat"
          @click="widget.data.items.splice(index, 1)"
        />
      </div>
      <UButton
        block
        size="sm"
        color="neutral"
        variant="soft"
        icon="i-lucide-plus"
        label="Přidat síť"
        @click="addSocial"
      />
    </template>

    <template v-else-if="widget.plugin === 'divider'">
      <ElementorSelect
        v-model="widget.data.style"
        label="Styl"
        :items="['solid', 'dashed', 'dotted']"
      />
      <label class="block space-y-1">
        <span class="text-xs font-medium text-neutral-600">Tloušťka ({{ widget.data.weight }}px)</span>
        <input
          v-model.number="widget.data.weight"
          type="range"
          min="1"
          max="8"
          class="w-full accent-brand-800"
        >
      </label>
      <label class="block space-y-1">
        <span class="text-xs font-medium text-neutral-600">Šířka ({{ widget.data.width }}%)</span>
        <input
          v-model.number="widget.data.width"
          type="range"
          min="10"
          max="100"
          step="5"
          class="w-full accent-brand-800"
        >
      </label>
      <label class="block space-y-1">
        <span class="text-xs font-medium text-neutral-600">Barva</span>
        <input
          v-model="widget.data.color"
          type="color"
          class="h-8 w-full cursor-pointer rounded border border-neutral-200"
        >
      </label>
    </template>

    <template v-else-if="widget.plugin === 'spacer'">
      <label class="block space-y-1">
        <span class="text-xs font-medium text-neutral-600">Výška ({{ widget.data.height }}px)</span>
        <input
          v-model.number="widget.data.height"
          type="range"
          min="8"
          max="200"
          step="4"
          class="w-full accent-brand-800"
        >
      </label>
    </template>

    <template v-else-if="widget.plugin === 'progress'">
      <label class="block space-y-1">
        <span class="text-xs font-medium text-neutral-600">Popisek</span>
        <UInput
          v-model="widget.data.label"
          size="sm"
        />
      </label>
      <label class="block space-y-1">
        <span class="text-xs font-medium text-neutral-600">Hodnota ({{ widget.data.value }}%)</span>
        <input
          v-model.number="widget.data.value"
          type="range"
          min="0"
          max="100"
          class="w-full accent-brand-800"
        >
      </label>
      <label class="block space-y-1">
        <span class="text-xs font-medium text-neutral-600">Barva</span>
        <input
          v-model="widget.data.color"
          type="color"
          class="h-8 w-full cursor-pointer rounded border border-neutral-200"
        >
      </label>
    </template>

    <template v-else-if="widget.plugin === 'testimonials'">
      <div
        v-for="(item, index) in widget.data.items"
        :key="item.id"
        class="space-y-2 rounded-md border border-neutral-200 p-2"
      >
        <UTextarea
          v-model="item.quote"
          size="sm"
          :rows="2"
        />
        <UInput
          v-model="item.author"
          size="sm"
          placeholder="Autor"
        />
        <UInput
          v-model="item.role"
          size="sm"
          placeholder="Role"
        />
        <UButton
          size="xs"
          color="error"
          variant="ghost"
          icon="i-lucide-trash-2"
          label="Smazat"
          @click="widget.data.items.splice(index, 1)"
        />
      </div>
      <UButton
        block
        size="sm"
        color="neutral"
        variant="soft"
        icon="i-lucide-plus"
        label="Přidat citaci"
        @click="addTestimonial"
      />
    </template>

    <template v-else-if="widget.plugin === 'accordion'">
      <div
        v-for="(item, index) in widget.data.items"
        :key="item.id"
        class="space-y-2 rounded-md border border-neutral-200 p-2"
      >
        <UInput
          v-model="item.title"
          size="sm"
        />
        <UTextarea
          v-model="item.body"
          size="sm"
          :rows="2"
        />
        <UButton
          size="xs"
          color="error"
          variant="ghost"
          icon="i-lucide-trash-2"
          label="Smazat"
          @click="widget.data.items.splice(index, 1)"
        />
      </div>
      <UButton
        block
        size="sm"
        color="neutral"
        variant="soft"
        icon="i-lucide-plus"
        label="Přidat sekci"
        @click="addAccordion"
      />
    </template>

    <template v-else-if="widget.plugin === 'toggle'">
      <div
        v-for="(item, index) in widget.data.items"
        :key="item.id"
        class="space-y-2 rounded-md border border-neutral-200 p-2"
      >
        <UInput
          v-model="item.title"
          size="sm"
        />
        <UTextarea
          v-model="item.body"
          size="sm"
          :rows="2"
        />
        <UButton
          size="xs"
          color="error"
          variant="ghost"
          icon="i-lucide-trash-2"
          label="Smazat"
          @click="widget.data.items.splice(index, 1)"
        />
      </div>
      <UButton
        block
        size="sm"
        color="neutral"
        variant="soft"
        icon="i-lucide-plus"
        label="Přidat toggle"
        @click="addToggle"
      />
    </template>

    <template v-else-if="widget.plugin === 'tabs'">
      <div
        v-for="(item, index) in widget.data.items"
        :key="item.id"
        class="space-y-2 rounded-md border border-neutral-200 p-2"
      >
        <UInput
          v-model="item.title"
          size="sm"
        />
        <UTextarea
          v-model="item.body"
          size="sm"
          :rows="2"
        />
        <UButton
          size="xs"
          color="error"
          variant="ghost"
          icon="i-lucide-trash-2"
          label="Smazat"
          @click="widget.data.items.splice(index, 1)"
        />
      </div>
      <UButton
        block
        size="sm"
        color="neutral"
        variant="soft"
        icon="i-lucide-plus"
        label="Přidat tab"
        @click="addTab"
      />
    </template>

    <template v-else-if="widget.plugin === 'alert'">
      <label class="block space-y-1">
        <span class="text-xs font-medium text-neutral-600">Titulek</span>
        <UInput
          v-model="widget.data.title"
          size="sm"
        />
      </label>
      <label class="block space-y-1">
        <span class="text-xs font-medium text-neutral-600">Text</span>
        <UTextarea
          v-model="widget.data.body"
          size="sm"
          :rows="3"
        />
      </label>
      <ElementorSelect
        v-model="widget.data.tone"
        label="Typ"
        :items="[
          { label: 'Info', value: 'info' },
          { label: 'Success', value: 'success' },
          { label: 'Warning', value: 'warning' },
          { label: 'Error', value: 'error' },
        ]"
      />
    </template>

    <template v-else-if="widget.plugin === 'star-rating'">
      <label class="block space-y-1">
        <span class="text-xs font-medium text-neutral-600">Popisek</span>
        <UInput
          v-model="widget.data.label"
          size="sm"
        />
      </label>
      <label class="block space-y-1">
        <span class="text-xs font-medium text-neutral-600">Hodnota ({{ widget.data.value }} / {{ widget.data.max }})</span>
        <input
          v-model.number="widget.data.value"
          type="range"
          :min="0"
          :max="widget.data.max"
          step="1"
          class="w-full accent-brand-800"
        >
      </label>
      <ElementorSelect
        v-model="widget.data.max"
        label="Maximum"
        :items="[
          { label: '3', value: 3 },
          { label: '4', value: 4 },
          { label: '5', value: 5 },
          { label: '6', value: 6 },
          { label: '10', value: 10 },
        ]"
      />
      <ElementorSelect
        v-model="widget.data.align"
        label="Zarovnání"
        :items="alignItems"
      />
    </template>
  </div>
</template>
