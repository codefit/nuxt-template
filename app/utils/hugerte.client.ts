/**
 * Bundle HugeRTE into the client chunk (skins + plugins).
 * Import this before `@hugerte/hugerte-vue` so `globalThis.hugerte` exists.
 */
import 'hugerte'
import 'hugerte/models/dom'
import 'hugerte/themes/silver'
import 'hugerte/icons/default'
import 'hugerte/plugins/lists'
import 'hugerte/plugins/link'
import 'hugerte/plugins/code'
import 'hugerte/skins/ui/oxide/skin.js'
import 'hugerte/skins/ui/oxide/content.js'
import 'hugerte/skins/content/default/content.js'
