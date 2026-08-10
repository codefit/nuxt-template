const SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa.',
  'Praesent sapien massa, convallis a pellentesque nec, egestas non nisi.',
  'Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus.',
  'Curabitur aliquet quam id dui posuere blandit vestibulum ac diam.',
  'Nulla quis lorem ut libero malesuada feugiat cras ultricies ligula.',
  'Donec rutrum congue leo eget malesuada curabitur arcu erat.',
  'Proin eget tortor risus mauris blandit aliquet elit eget tincidunt.',
  'Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui.',
]

const HEADLINES = [
  'Moderní řešení pro váš produkt',
  'Jednoduše. Rychle. Spolehlivě.',
  'Vše, co potřebujete, na jednom místě',
  'Kvalita, které můžete věřit',
  'Navrženo pro každodenní použití',
  'Výkon bez kompromisů',
  'Objevte nový standard',
  'Připraveno růst s vámi',
]

const pick = <T>(list: T[]): T => list[Math.floor(Math.random() * list.length)]!

const shuffle = <T>(list: T[]): T[] => {
  const next = [...list]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const a = next[i]!
    next[i] = next[j]!
    next[j] = a
  }
  return next
}

/** Short headline for heading widgets. */
export const randomHeading = (): string => pick(HEADLINES)

/** Lorem paragraph with at least `min` characters (default 255). */
export const randomText = (min = 255): string => {
  const parts: string[] = []
  let len = 0
  const pool = shuffle(SENTENCES)
  let i = 0
  while (len < min) {
    const sentence = pool[i % pool.length]!
    parts.push(sentence)
    len += sentence.length + (parts.length > 1 ? 1 : 0)
    i++
    if (i % pool.length === 0) pool.push(...shuffle(SENTENCES))
  }
  return parts.join(' ')
}

