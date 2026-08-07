/** Logical file kind — drives allowed extensions / MIME checks. */
export const FileType = {
  IMAGE: 'image',
  VIDEO: 'video',
  DOCUMENT: 'document',
  AUDIO: 'audio',
  ARCHIVE: 'archive',
  PDF: 'pdf',
  SPREADSHEET: 'spreadsheet',
  TEXT: 'text',
  HTML: 'html',
  XML: 'xml',
  JSON: 'json',
  CSV: 'csv',
  TXT: 'txt',
  UNKNOWN: 'unknown',
} as const

export type FileType = (typeof FileType)[keyof typeof FileType]

export const FILE_TYPE_EXTENSIONS: Record<FileType, readonly string[]> = {
  [FileType.IMAGE]: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'],
  [FileType.VIDEO]: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'],
  [FileType.DOCUMENT]: ['doc', 'docx', 'odt', 'rtf'],
  [FileType.AUDIO]: ['mp3', 'wav', 'ogg', 'flac', 'm4a'],
  [FileType.ARCHIVE]: ['zip', 'rar', '7z', 'tar', 'gz'],
  [FileType.PDF]: ['pdf'],
  [FileType.SPREADSHEET]: ['xls', 'xlsx', 'ods'],
  [FileType.TEXT]: ['txt', 'md', 'log'],
  [FileType.HTML]: ['html', 'htm'],
  [FileType.XML]: ['xml'],
  [FileType.JSON]: ['json'],
  [FileType.CSV]: ['csv'],
  [FileType.TXT]: ['txt'],
  [FileType.UNKNOWN]: [],
}

export const FILE_TYPE_MIMES: Record<FileType, readonly string[]> = {
  [FileType.IMAGE]: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
  ],
  [FileType.VIDEO]: [
    'video/mp4',
    'video/x-msvideo',
    'video/quicktime',
    'video/x-ms-wmv',
    'video/x-flv',
    'video/x-matroska',
    'video/webm',
  ],
  [FileType.DOCUMENT]: [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.oasis.opendocument.text',
    'application/rtf',
  ],
  [FileType.AUDIO]: [
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/flac',
    'audio/mp4',
  ],
  [FileType.ARCHIVE]: [
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/x-tar',
    'application/gzip',
  ],
  [FileType.PDF]: ['application/pdf'],
  [FileType.SPREADSHEET]: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.oasis.opendocument.spreadsheet',
  ],
  [FileType.TEXT]: ['text/plain', 'text/markdown'],
  [FileType.HTML]: ['text/html'],
  [FileType.XML]: ['application/xml', 'text/xml'],
  [FileType.JSON]: ['application/json'],
  [FileType.CSV]: ['text/csv'],
  [FileType.TXT]: ['text/plain'],
  [FileType.UNKNOWN]: [],
}

export function fileTypeFromExtension(extension: string): FileType {
  const ext = extension.toLowerCase().replace(/^\./, '')
  for (const [type, list] of Object.entries(FILE_TYPE_EXTENSIONS) as [FileType, readonly string[]][]) {
    if (list.includes(ext)) {
      return type
    }
  }
  return FileType.UNKNOWN
}

export function fileTypeFromMime(mime: string): FileType {
  for (const [type, list] of Object.entries(FILE_TYPE_MIMES) as [FileType, readonly string[]][]) {
    if (list.includes(mime)) {
      return type
    }
  }
  return FileType.UNKNOWN
}

export function isFileType(value: string): value is FileType {
  return Object.values(FileType).includes(value as FileType)
}
