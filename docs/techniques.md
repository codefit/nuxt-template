# Techniky ve Vue 3 / Nuxt 4 v tomto projektu

Učební přehled vzorů, které se v kódu opravdu používají. U každé techniky je stručné **co dělá**, **příklad z repa** a **zda ji používat**.

> Cíl: aby šlo dohledat „co to sakra je“ u věcí jako `shallowRef`, `withDefaults(defineProps<…>())`, `defineModel`, `MaybeRefOrGetter` nebo generický `DataTable`.

---

## Obsah

1. [Základy skriptu](#1-základy-script-setup)
2. [Reaktivita](#2-reaktivita)
3. [Props, emits, model](#3-props-emits-model)
4. [Složité zanoření zápisů](#4-složité-zanoření-zápisů)
5. [Composables](#5-composables)
6. [Nuxt data fetching](#6-nuxt-data-fetching)
7. [Nuxt UI a overlaye](#7-nuxt-ui-a-overlaye)
8. [TypeScript vzory](#8-typescript-vzory)
9. [Server (Nitro)](#9-server-nitro)
10. [Co v projektu (zatím) nepoužíváme](#10-co-v-projektu-zatím-nepoužíváme)

---

## 1. Základy `<script setup>`

### `<script setup lang="ts">`

Jediný styl komponent v projektu. Setup běží při vytvoření komponenty; proměnné a funkce jsou automaticky dostupné v šabloně.

```vue
<script setup lang="ts">
const count = ref(0)
</script>
```

**Hodnocení:** ✅ Standard Vue 3. Options API nepoužívat.

### Top-level `await`

V Nuxt stránkách/composables můžeš `await` přímo v setupu (Nuxt obalí Suspense):

```ts
const { data } = await useFetch('/api/…')
```

**Hodnocení:** ✅ Běžné u stránek s daty. Na klientských child komponentách pozor — blokuje render rodiče.

### Auto-importy

Nuxt automaticky importuje Vue API (`ref`, `computed`…), composables a komponenty. Nested složky composables musí být v `nuxt.config.ts` → `imports.dirs`.

Komponenty mají `pathPrefix: false` → soubor `DataTable.vue` se jmenuje `DataTable`, ne `DashboardTableDataTable`.

**Hodnocení:** ✅ Držet se Nuxt konvencí; nested `imports.dirs` je nutné, jinak composables „zmizí“.

---

## 2. Reaktivita

### `ref`

Obalí hodnotu do `.value`. Pro primitivy i objekty (objekt uvnitř je hluboce reaktivní).

```ts
const search = ref('')
const pagination = ref<TablePagination>({ pageIndex: 0, pageSize: 20 })
search.value = 'ahoj'
```

V šabloně se `.value` nepíše: `{{ search }}`.

**Hodnocení:** ✅ Výchozí volba pro většinu stavu.

### `shallowRef`

Stejné jako `ref`, ale **bez hluboké reaktivity** uvnitř hodnoty. Reaguje jen na výměnu celého `.value`.

```ts
// FormSlideover.vue — drží lazy-načtenou Vue komponentu
const formComponent = shallowRef<Component | null>(null)
formComponent.value = await resolveForm(props.type)
```

Proč ne `ref`? Konstruktor / SFC objekt komponenty nemá smysl deep-proxovat — je to zbytečná práce a může dělat divné věci.

**Hodnocení:** ✅ Používej pro velké objekty, které neměníš „uvnitř“ (komponenty, mapy, library instance). Pro formulářová data spíš `ref`/`reactive`.

### `reactive`

Deep-reaktivní objekt **bez** `.value`.

```ts
const form = reactive({
  isPublished: false,
  translations: {},
  media: [],
})
form.isPublished = true // OK
```

**Pozor:** Není možné přepsat celý objekt přiřazením (`form = {…}` ztratí reaktivitu). Pro „vyměň celý model“ je lepší `ref`.

**Hodnocení:** ✅ Vhodné pro formuláře s mnoha vnořenými poli (viz `ArticleForm`). Pro jednu hodnotu nebo „celý stav vyměním“ → `ref`.

### `computed` (read-only)

Odvozená hodnota; cache, dokud se nezmění závislosti.

```ts
const heading = computed(() => props.title || t('dashboard.form.createTitle'))
```

**Hodnocení:** ✅ Preferuj před `watch`, když jen odvozuješ hodnotu.

### `computed` s get/set (writable)

Adapter mezi UI tvarem a interním modelem:

```ts
// ArticleForm — date input chce YYYY-MM-DD, API má ISO string
const publishedAtDate = computed({
  get: () => toDateInput(form.publishedAt),
  set: (value: string) => {
    form.publishedAt = fromDateInput(value)
  },
})
```

```ts
// DataTableFooter — UI pager je 1-based, TanStack pageIndex je 0-based
const page = computed({
  get: () => pagination.value.pageIndex + 1,
  set: (value: number) => {
    pagination.value = {
      ...pagination.value,
      pageIndex: Math.max(0, value - 1),
    }
  },
})
```

**Hodnocení:** ✅ Velmi vhodné jako „překladač“ mezi UI a doménou. Nepoužívej jako náhradu za eventy u složité business logiky.

### `watch`

Reaguje na změnu zdroje a spouští side-effect (URL, fetch, reset stránky…).

```ts
// useTableState — flush: 'sync' = reset page proběhne dřív, než jiné watche uvidí starou page
watch(search, resetPage, { flush: 'sync' })
watch(filters, resetPage, { deep: true, flush: 'sync' })
```

| Volba | Význam |
|--------|--------|
| `deep: true` | sleduj vnořené změny objektu/pole |
| `immediate: true` | spusť hned při vytvoření |
| `flush: 'sync'` | spusť synchronně ve stejném ticku (ne až po DOM update) |

**Hodnocení:** ✅ Pro side-effecty (sync URL, clear selection). Pro odvozená data → `computed`. `flush: 'sync'` jen když opravdu řešíš race (jako u table state).

### `toValue` + `MaybeRefOrGetter`

Composable přijme buď `Ref`, plain hodnotu, nebo getter `() => …`:

```ts
interface Options<T> {
  data: MaybeRefOrGetter<T[]>
  total: MaybeRefOrGetter<number>
}

const filtered = computed(() => toValue(options.data))
```

V `DataTable` se předává getter z props:

```ts
useDataTable<T>({
  data: () => props.data, // props zůstanou reaktivní
  total: () => props.total,
})
```

**Hodnocení:** ✅ **Doporučený pattern** pro reusable composables. Lepší než nutit volajícího vždy předávat `ref`. Alternativa `toRefs(props)` je starší a často méně pohodlná.

### `isRef`

Kontrola, jestli je hodnota `Ref`:

```ts
// useValidation — model může být Ref i plain reactive objekt
const source = isRef(model) ? model.value : model
```

**Hodnocení:** ✅ OK uvnitř generických utilit. V běžné komponentě spíš sjednoť typ vstupu.

### `useTemplateRef`

Typovaný odkaz na element/komponentu podle `ref="…"` v šabloně (Vue 3.5+ / Nuxt):

```ts
const table = useTemplateRef<TableExpose<T>>('table')
// šablona: <UTable ref="table" …>
```

**Hodnocení:** ✅ Preferuj před starým `const el = ref(null)` + `ref="el"`, když potřebuješ typovaný expose.

---

## 3. Props, emits, model

### `defineProps<Props>()`

TypeScript-only props (bez runtime validace — v Nuxt/TS to stačí):

```ts
interface Props {
  mode: FormMode
  id?: number | string
  pending?: boolean
}

const props = defineProps<Props>()
```

**Hodnocení:** ✅ Standard projektu. Runtime `PropType` / options props nepoužíváme.

### `withDefaults(defineProps<…>(), { … })`

Props + výchozí hodnoty. **Tohle je to „zanoření“, které vypadá složitě:**

```ts
const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  depth: 0,
})
```

Čti zevnitř ven:

1. `defineProps<Props>()` — deklaruje props a typy  
2. `withDefaults(…, defaults)` — doplní defaulty pro volitelné props  

Pro **pole/objekty** musí být default **factory** (jinak by se sdílela jedna instance mezi komponentami):

```ts
withDefaults(defineProps<{ pageSizes?: number[] }>(), {
  pageSizes: () => [...RESOURCE_PAGE_SIZES], // ✅ funkce
  // pageSizes: [10, 20], // ❌ sdílené pole — bug
})
```

**Hodnocení:** ✅ Používej vždy, když má prop default. Factory u array/object je povinnost.

### Inline props bez pojmenovaného `interface`

```ts
const props = withDefaults(
  defineProps<{
    data: T[]
    total: number
    loading?: boolean
  }>(),
  {
    loading: false,
  },
)
```

Stejná myšlenka — jen typ je přímo v `defineProps<{…}>()`.

**Hodnocení:** ✅ OK u jednorázových / generických komponent (`DataTable`). U formulářů s více místy spíš pojmenovaný `interface Props`.

### `defineEmits<{ … }>()`

Typované eventy — payload je tuple:

```ts
const emit = defineEmits<{
  submit: [payload: ArticleAdminDetail | { id: number }]
  cancel: [] // bez payloadu
  close: [value?: FormResult]
}>()

emit('submit', row)
emit('cancel')
```

**Hodnocení:** ✅ Vždy typovat. Starý `emit('foo', …)` bez typů nepoužívat u nových komponent.

### `defineModel` (v-model zevnitř)

Nahrazuje klasiku `modelValue` prop + `update:modelValue` emit:

```ts
// výchozí v-model
const model = defineModel<string>({ default: '' })

// pojmenované: v-model:pagination, v-model:search, …
const pagination = defineModel<TablePagination>('pagination', {
  default: () => ({ pageIndex: 0, pageSize: 20 }),
})
const search = defineModel<string>('search', { default: '' })
```

Rodič:

```vue
<DataTable
  v-model:pagination="pagination"
  v-model:sorting="sorting"
  v-model:search="search"
  v-model:filter-values="filters"
/>
```

**Hodnocení:** ✅ **Preferovaný** způsob obousměrné vazby. U `DataTable` je multi-model záměr — tabulka je „controlled“ shell nad URL/state.

### `defineOptions`

Options mimo props (např. vypnout dědění atributů):

```ts
defineOptions({ inheritAttrs: false })
```

Pak atributy (`class`, `id`…) nepůjdou automaticky na root — přemapuješ je přes `v-bind="$attrs"` (viz `SiteContainer`).

**Hodnocení:** ✅ Jen když potřebuješ polymorphic wrapper / přesměrovat attrs. Jinak netřeba.

---

## 4. Složité zanoření zápisů

### Čtení zevnitř ven

```ts
const props = withDefaults(
  defineProps<{
    data: T[]
    pageSizes?: number[]
  }>(),
  {
    pageSizes: () => [10, 20, 50],
  },
)
```

| Vrstva | Role |
|--------|------|
| `defineProps<{…}>()` | „Komponenta přijímá tyto props“ |
| `<{…}>` | TypeScript tvar props |
| `withDefaults(propsDecl, defaults)` | „Tyhle props mají default“ |
| `() => […]` | Factory — nová instance pole při každém mountu |

### Generická SFC

```vue
<script setup lang="ts" generic="T">
const props = defineProps<{ data: T[]; getRowId: (row: T) => string }>()
</script>
```

`T` je typ řádku tabulky — props, sloupce i `useDataTable<T>` mají stejný typ end-to-end.

**Hodnocení:** ✅ Správně u reusable table/list UI. Nepřehánět u jednorázových stránek.

### Dynamic `<component :is>`

```vue
<component
  :is="formComponent"
  :mode="mode"
  :id="id"
  @submit="onSubmit"
/>
```

Vykreslí libovolnou komponentu podle hodnoty (lazy form z registry).

**Hodnocení:** ✅ Ideální pro registry/plugin hosty. Pro 2–3 pevné varianty spíš `v-if` / pojmenované komponenty (lepší DX a tree-shaking přehled).

### Forwardování slotů

```vue
<template
  v-for="(_, name) in $slots"
  :key="name"
  #[name]="slotProps"
>
  <slot
    v-if="name !== 'toolbar'"
    :name="name"
    v-bind="slotProps ?? {}"
  />
</template>
```

Wrapper (`DataTable`) propustí všechny sloty dál do `UTable`, kromě vlastního `toolbar`.

**Hodnocení:** ✅ Správný pattern pro thin wrapper kolem knihovní komponenty. Vypadá magicky — ale je to jen „projdi sloty a znovu je vystav“.

### Render funkce `h()`

```ts
h(UCheckbox, {
  'modelValue': handlers.isAllSelected(),
  'onUpdate:modelValue': (value: unknown) => handlers.selectAll(!!value),
})
```

Používá se ve sloupcích TanStack Table (header/cell jako funkce → VNode), ne v SFC šabloně.

**Hodnocení:** ✅ Nutné u column definitions. V běžných Vue šablonách `h()` nepreferuj — šablona je čitelnější.

---

## 5. Composables

### Co to je

Funkce `useSomething()`, která sdílí stavovou logiku mezi komponentami. V Nuxtu se auto-importují.

### Orchestace ve vrstvách

```
stránka (dashboard/articles)
  → useDashboardList   (URL state + useFetch + bulk)
      → useTableState  (query ↔ pagination/sort/search)
  → DataTable
      → useDataTable   (selection, columns, bulk UI)
```

**Hodnocení:** ✅ Stránka má zůstat tenká; business flow v composable/service. Tohle je hlavní architektonický princip projektu.

### Registry + dynamic `import()`

```ts
const loaders = {
  article: () => import('~/components/dashboard/form/articles/ArticleForm.vue'),
  author: () => import('~/components/dashboard/form/authors/AuthorForm.vue'),
}

export async function resolveForm(type: string): Promise<Component> {
  const mod = await loaders[type]()
  return mod.default
}
```

**Hodnocení:** ✅ Code-splitting formulářů. Nový resource = `registerForm` / záznam v mapě, ne if-else ve Slideoveru.

### Module-level stav (nesting stack)

```ts
let stack = 0 // mimo funkci — sdílené napříč voláními

export function useFormSlideover() {
  async function open(options) {
    const depth = stack
    stack += 1
    try {
      return await overlay.create(FormSlideover, { props: { …, depth } }).open()
    }
    finally {
      stack = Math.max(0, stack - 1)
    }
  }
  return { open }
}
```

`depth === 0` → jen root slideover má dim overlay (aby se při vnořeném „nový autor“ nestackovaly tmavé vrstvy).

**Hodnocení:** ⚠️ Funguje a je záměrné. Module `let` je globální v rámci client bundlu — OK pro UI stack, **ne** pro user/session data. Pro sdílený app state v Nuxtu spíš `useState`.

### `useState` jako „provide“ mezi layout a page

Vue `provide`/`inject` z page do layout **nefunguje** (layout je rodič). Proto:

```ts
export function useLocaleSwitchParams() {
  return useState<LocaleRouteParams | null>('locale-switch-params', () => null)
}

export function provideLocaleSwitchParams(params) {
  const state = useLocaleSwitchParams()
  watch(() => toValue(params) ?? null, (v) => { state.value = v }, { immediate: true })
  onBeforeUnmount(() => { state.value = null })
}
```

Název `provideLocale…` je **metafora** — pod kapotou je Nuxt `useState`, ne Vue `provide`.

**Hodnocení:** ✅ Správný Nuxt pattern pro layout ↔ page. Neplést si to s Pinia (tady stačí malý SSR-safe key).

### Promise API overlayů

```ts
const result = await openForm<AuthorDetail>({ type: 'author', mode: 'create' })
if (result?.ok) { /* vyber nového autora */ }
```

**Hodnocení:** ✅ Skvělé UX API (jako `window.confirm`, ale async). Preferuj před event busem.

---

## 6. Nuxt data fetching

| API | Kdy |
|-----|-----|
| `useFetch` / `useAsyncData` | Čtení dat vázaná na stránku/composable (SSR + cache key) |
| `$fetch` | Mutace (POST/PATCH), ad-hoc load v handleru tlačítka |
| `refresh()` | Znovu načti po mutaci |

```ts
// dashboard list — query je reaktivní, watch znovu fetchné
await useFetch(endpoint, { query, watch: watchSources })

// detail — klíč závisí na locale + slug
await useAsyncData(
  computed(() => `article-${locale.value}-${slug.value}`),
  () => $fetch(`/api/articles/${slug.value}`, { query: { locale } }),
  { watch: [slug, locale] },
)

// uložení formuláře
await $fetch('/api/articles', { method: 'POST', body: form })
```

**Hodnocení:** ✅ Drž dělení read vs mutate. Nevolej `useFetch` uvnitř click handleru — tam patří `$fetch`.

### `definePageMeta`

```ts
definePageMeta({ layout: 'dashboard' })
```

**Hodnocení:** ✅ Jediný způsob, jak stránce říct layout / middleware / atd.

### SEO

- Plugin defaults: `plugins/seo.ts`
- Stránky: `usePageSeo({…})` / `useSeoMeta` / `useHead`
- JSON-LD: `composables/jsonLd/*`

**Hodnocení:** ✅ Centralizuj do `usePageSeo`, ať stránky neopakují boilerplate.

---

## 7. Nuxt UI a overlaye

### Programmatic overlay

```ts
const overlay = useOverlay()
const modal = overlay.create(ConfirmDialog, {
  destroyOnClose: true,
  props: options,
})
return modal.open() // Promise
```

Stejný vzor: confirm, result dialog, form slideover.

**Hodnocení:** ✅ Preferuj před ručním `v-if` modalem v každé stránce, když je dialog „služba“.

### `.client.vue`

`FormEditor.client.vue` — HugeRTE jen na klientu (žádný SSR crash).

**Hodnocení:** ✅ Pro browser-only knihovny. Alternativa: `<ClientOnly>` kolem importu.

### `ClientOnly`

Obalí klientskou lib (např. lightbox v gallery).

**Hodnocení:** ✅ OK. Nepřehánět — zbytečný ClientOnly = horší SSR/SEO.

---

## 8. TypeScript vzory

### Sdílené typy v `shared/types/`

App i server importují stejné DTO (`ArticleDetail`, `BulkPayload`…). Žádné kopií interface ve stránce + API.

### Drizzle inference

```ts
export type Message = typeof messages.$inferSelect
export type NewMessage = typeof messages.$inferInsert
export type MessageForm = Pick<NewMessage, 'name' | 'email' | 'message'>
```

**Hodnocení:** ✅ Single source of truth ze schématu DB.

### `Omit` / `Partial` / `extends`

```ts
export interface ArticleDetail extends Omit<ArticleListItem, 'publishedAt'> {
  body: string
  publishedAt: string
  slugMap: LocaleSlugMap
}
```

**Hodnocení:** ✅ Skládej typy, neduplikuj pole.

### Zod + `z.infer`

```ts
export const articleFormSchema = z.object({ /* … */ })
export type ArticleFormParsed = z.infer<typeof articleFormSchema>
```

Validace na serveru; typ odvozený ze schématu.

**Hodnocení:** ✅ Povinné na API. Client validace (`useValidation`) je jen UX.

### Generics na composables

```ts
export function useDataTable<T>(options: Options<T>) { … }
export function useDashboardList<T>(…) { … }
openForm<AuthorDetail>({ … })
```

**Hodnocení:** ✅ Tam, kde se mění tvar entity. Negenericuj „pro jistotu“.

---

## 9. Server (Nitro)

### Tenký handler

```ts
export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (data) => {
    const parsed = articleFormSchema.safeParse(data)
    if (!parsed.success) {
      throw createError({ statusCode: 400, message: … })
    }
    return parsed.data
  })
  return await createArticle(body)
})
```

Handler: authorize → validate → action → return. Logika v `server/services/…`.

**Hodnocení:** ✅ Drž se toho; nepřidávej SQL do `server/api`.

### Tasks

Těžká práce (feedy, sitemap, seed) → `server/tasks/` + scripts, ne v request path.

**Hodnocení:** ✅ Správně.

---

## 10. Co v projektu (zatím) nepoužíváme

| Technika | Poznámka |
|----------|----------|
| Options API | Záměrně ne |
| `watchEffect` | Preferujeme explicitní `watch` |
| `toRef` / `toRefs` / `unref` | Nahrazeno `toValue` / gettery |
| `customRef`, `markRaw`, `triggerRef` | Zatím netřeba |
| Vue `provide` / `inject` | Místo toho `useState` |
| `defineExpose` / `defineSlots` | Zatím ne |
| `PropType` | TS generics props stačí |
| Pinia `defineStore` | Modul je v configu, stores se nepoužívají |
| `navigateTo` | Zatím bez usage v app kódu |
| `<Suspense>` ručně | Nuxt řeší top-level await |

Když některou z nich přidáš, měj jasný důvod (ne „protože existuje“).

---

## Rychlý cheatsheet „kdy co“

| Potřeba | Použij |
|---------|--------|
| Jedna hodnota / vyměním celek | `ref` |
| Formulář s vnořenými poli | `reactive` nebo `ref({…})` |
| Komponenta / heavy object bez deep track | `shallowRef` |
| Odvozená hodnota | `computed` |
| UI ↔ jiný tvar dat | writable `computed` |
| Side effect (URL, log) | `watch` |
| Prop s defaultem | `withDefaults(defineProps<…>(), …)` |
| v-model z child | `defineModel` |
| Reusable table/list | `generic="T"` + `MaybeRefOrGetter` |
| Layout ↔ page state | `useState` |
| Dialog / form jako služba | `useOverlay` + Promise |
| Čtení stránky | `useFetch` / `useAsyncData` |
| Uložit / smazat | `$fetch` |
| Validace API | Zod ve service + thin handler |

---

## Kam se dívat v kódu (živá reference)

| Téma | Soubory |
|------|---------|
| `shallowRef` + dynamic form | `app/components/dashboard/form/FormSlideover.vue` |
| Nested slideover stack | `app/composables/form/useFormSlideover.ts` |
| Form registry | `app/composables/form/formRegistry.ts` |
| Generics + multi `defineModel` | `app/components/dashboard/table/DataTable.vue` |
| `MaybeRefOrGetter` / `toValue` | `app/composables/table/useDataTable.ts` |
| URL sync + `flush: 'sync'` | `app/composables/table/useTableState.ts` |
| Writable computed (datum) | `app/components/dashboard/form/articles/ArticleForm.vue` |
| `useState` locale bridge | `app/composables/useLocaleSwitch.ts` |
| Dashboard list fetch | `app/composables/dashboard/useDashboardList.ts` |
| `h()` sloupce | `app/utils/tableColumns.ts`, `app/utils/sortHeader.ts` |
| Zod + create | `server/services/articles/schema.ts`, `server/api/articles/index.post.ts` |
| Auto-import config | `nuxt.config.ts` (`components`, `imports.dirs`) |

---

*Tenhle dokument popisuje stav codebase v době napsání. Nové vzory doplň sem, ať zůstane učební mapa projektu.*
