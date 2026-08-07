# API

Nitro JSON · base `/api` · admin přes session cookie (`nuxt-auth-utils`).

**Vrstvy**

| Vrstva | Role |
|--------|------|
| `server/api/*` | authorize → validate → call → return |
| `server/services/*` | business logic (1 akce = 1 modul) |
| `server/utils/*` | `listQuery`, `bulkBody`, `apiI18n`, … |
| `shared/types/{ui,dto,db}` | kontrakty client ↔ server |

Handler zůstává tenký. Logika patří do services.

---

## Testování

| Soubor | Nástroj |
|--------|---------|
| [`openapi.yaml`](./openapi.yaml) | Swagger / Postman / Insomnia / Bruno |
| [`api.http`](./api.http) | **PhpStorm / IntelliJ HTTP Client** |
| [`http-client.env.json`](./http-client.env.json) | env pro HTTP Client (`domain`, …) |
| [`api-curl.cmd`](./api-curl.cmd) | **Windows CMD** (curl + cookies) |

```yaml
# openapi.yaml
servers:
  - url: '{domain}'
    variables:
      domain:
        default: http://localhost:3000
```

```http
# api.http (PhpStorm: otevři soubor → zelená šipka / Ctrl+Enter)
@domain = http://localhost:3000

GET {{domain}}/api/articles?page=1&limit=10&locale=cs
```

```bat
REM CMD
cd server\api
set DOMAIN=http://localhost:3000
api-curl.cmd login
api-curl.cmd articles
```

Admin routy: nejdřív Login (HTTP Client cookie / `cookies.txt` u curl). Doménu přepiš v `@domain`, `http-client.env.json`, nebo `set DOMAIN=…`.

---

## Auth

Veřejné (bez session):

- `GET /api/articles`
- `GET /api/articles/:slug`
- `POST /api/messages`
- `GET /api/languages/options`
- `GET /api/slugs/:entity/:slug`
- `/api/auth/*` · `/api/_auth/*`

Všechno ostatní → `requireUserSession` (401).

Locale: `?locale=` → cookie `i18n_redirected` → `defaultLocale`.

---

## Resource surface

```
GET    /api/{model}           list
POST   /api/{model}           create
GET    /api/{model}/:id       detail   (articles: /api/articles/id/:id)
PATCH  /api/{model}/:id       update
POST   /api/{model}/bulk      bulk
```

Model může metody vynechat. Kontrakt: `shared/types/ui/resource.ts`.

---

## List query

Parser: `readListQuery(event, filterKeys)` · klient: `toListQuery()`.

```
?page=2
&limit=20
&q=hledany+text
&sort=-createdAt                 # nebo createdAt:desc · csv: id,-title
&createdAt=2024-01-01..2024-01-31
&isPublished=true
&with=author                     # csv relací
&locale=cs
```

| Param | Limity |
|-------|--------|
| `page` | ≥ 1, default `1` |
| `limit` | 1…100, default `10` · UI: 10 / 20 / 50 / 100 |
| `q` | fulltext → `filters.q` |
| `sort` | `-col` = desc · bere se první sloupec |
| filtry | string · boolean · `from..to` date-range |
| `with` | např. `author` |

```ts
// ResourceListQuery
{ page?, limit?, sort?: TableSort[], filters?: TableFilters, with?: string[] }

// ResourceListResponse<T>
{ items: T[], meta: { page, limit, total } }
```

**Request**

```http
GET /api/articles?page=1&limit=10&q=nuxt&sort=-publishedAt&isPublished=true&with=author&locale=cs
```

**Response**

```json
{
  "items": [
    {
      "id": 1,
      "slug": "ahoj-svete",
      "title": "Ahoj světe",
      "description": "…",
      "author": "Jan Novák",
      "image": "https://…",
      "isPublished": true,
      "publishedAt": "2026-03-01T10:00:00.000Z",
      "createdAt": "2026-02-20T08:00:00.000Z",
      "updatedAt": "2026-03-01T10:00:00.000Z",
      "archivedAt": null
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 42 }
}
```

| Model | `filterKeys` | default sort |
|-------|--------------|--------------|
| articles | `createdAt`, `isPublished` | `-publishedAt` |
| messages | `createdAt` | — |
| languages | `createdAt`, `isActive`, `isDefault` | — |

---

## Bulk

```http
POST /api/{model}/bulk
```

```json
{
  "action": "delete",
  "search": "volitelný q",
  "filters": { "isPublished": "false" },
  "selection": { "mode": "include", "ids": ["1", "2"] }
}
```

- `include` — jen tyto ids
- `exclude` — vše matching filters kromě ids (select-all)

```json
{
  "ok": true,
  "mode": "include",
  "action": "delete",
  "affected": 2,
  "result": { "title": "…", "stats": [], "items": [] }
}
```

Typy: `ResourceBulkBody` · `ResourceBulkResponse` · `TableSelection`.

---

## Endpointy

### Auth

| Method | Path | Body | Response |
|--------|------|------|----------|
| POST | `/api/auth/login` | `{ email, password }` | `{ user }` |
| POST | `/api/auth/logout` | — | `{ ok: true }` |
| POST | `/api/auth/register` | schema | user / ok |
| POST | `/api/auth/forgot-password` | `{ email }` | ok |
| POST | `/api/auth/reset-password` | token + password | ok |

```json
{ "user": { "id": 1, "email": "a@b.cz", "name": "Admin" } }
```

### Articles

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/api/articles` | public | list + filters |
| GET | `/api/articles/:slug` | public | detail + `slugMap` + `gallery` · `?with=author` |
| GET | `/api/articles/id/:id` | session | admin detail (všechny locale) |
| POST | `/api/articles` | session | `ArticleFormInput` |
| PATCH | `/api/articles/id/:id` | session | `ArticleFormInput` |
| POST | `/api/articles/bulk` | session | publish / archive / delete / … |

```json
{
  "id": 1,
  "slug": "ahoj-svete",
  "title": "Ahoj světe",
  "body": "<p>…</p>",
  "description": "…",
  "isPublished": true,
  "publishedAt": "2026-03-01T10:00:00.000Z",
  "slugMap": { "cs": "ahoj-svete", "en": "hello-world", "sk": "ahoj-svet" }
}
```

```json
{
  "authorId": 1,
  "isPublished": true,
  "publishedAt": "2026-03-01T10:00:00.000Z",
  "translations": {
    "cs": {
      "title": "…", "slug": "…", "excerpt": "…", "body": "…",
      "metaTitle": "…", "metaDescription": "…", "metaKeywords": "…"
    }
  }
}
```

Media nepatří do article body — `/api/media`.

### Messages

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/messages` | session |
| GET | `/api/messages/:id` | session |
| POST | `/api/messages` | public · GDPR + reCAPTCHA |
| POST | `/api/messages/bulk` | session |

```json
{
  "name": "Jan",
  "email": "jan@example.com",
  "message": "Dobrý den…",
  "gdpr": true,
  "recaptchaToken": "…"
}
```

### Languages

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/languages` | session |
| GET | `/api/languages/options` | public |
| GET | `/api/languages/:id` | session |
| PATCH | `/api/languages/:id` | session |
| POST | `/api/languages/bulk` | session |

### Authors

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/authors` | session · paginated `ResourceListResponse` |
| GET | `/api/authors/options` | session · autocomplete `AuthorOption[]` |
| GET | `/api/authors/:id` | session |
| POST | `/api/authors` | session · `AuthorFormInput` |
| PATCH | `/api/authors/:id` | session · `AuthorFormInput` |
| POST | `/api/authors/bulk` | session · export / soft-delete |

### Media

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/media` | `?entity=&modelId=&collection=&grouped=` |
| POST | `/api/media/upload` | multipart |
| PATCH | `/api/media/reorder` | rank |
| DELETE | `/api/media/:id` | |

```json
{
  "image": { "id": 10, "url": "…", "collection": "image", "rank": 0 },
  "gallery": [],
  "icon": null,
  "preview": null
}
```

### Ostatní

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/slugs/:entity/:slug` | public |
| POST | `/api/mail/test` | session |

---

## Typy

```
shared/types/
├── ui/resource.ts      ResourceListQuery · Response · Bulk · page sizes
├── ui/data-table.ts    TableSort · TableFilters · TableSelection · BulkResult
├── dto/*.ts            to, co vrací / přijímá API
└── db/index.ts         Drizzle $inferSelect / $inferInsert (interní)
```

```ts
TableSort        { id: string, desc: boolean }
TableDateRange   { from?: 'YYYY-MM-DD', to?: 'YYYY-MM-DD' }
TableFilters     Record<string, string | string[] | boolean | TableDateRange>
TableSelection   { mode: 'include' | 'exclude', ids: string[] }

RESOURCE_PAGE_SIZES = [10, 20, 50, 100]
RESOURCE_MAX_LIMIT  = 100
```

| Vrstva | Příklady | Role |
|--------|----------|------|
| `db/` | `Article`, `Message`, `User` | raw Drizzle řádky |
| `dto/` | `ArticleListItem`, `ArticleFormInput`, `MediaItemDto` | API wire |

API mapuje na DTO ve services — nevrací raw DB se sensitives.

| DTO | Použití |
|-----|---------|
| `ArticleFormInput` | create / update article |
| `MessageForm` | contact form (+ GDPR / reCAPTCHA) |
| `LanguageFormInput` | patch language |
| `AuthorFormInput` | create author |

---

## Nový endpoint

1. Typy — `shared/types/dto/…` (+ `Resource*` pro list/bulk)
2. Schema — `server/services/{model}/schema.ts` (Zod)
3. Action — `server/services/{model}/{action}.ts`
4. Route — `server/api/{model}/….ts` → validate → action → return / `apiError`
5. Auth — veřejné? → `isPublicApi` v `01-admin-api.ts`
6. List — `readListQuery` + `listResponse`

```ts
export default defineEventHandler(async (event) => {
  const query = readListQuery(event, ['createdAt'])
  return await listThings(query)
})
```

**Kde koukat**

- `shared/types/ui/resource.ts` — list / bulk kontrakt
- `server/utils/listQuery.ts` — parse + pagination + sort
- `server/utils/bulkBody.ts` — selection / filters
- `server/middleware/01-admin-api.ts` — public vs session
- `server/services/{model}/*` — logika
