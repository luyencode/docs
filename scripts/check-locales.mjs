// Fails if a page exists in only one locale: src/<path>.md (vi) must have src/en/<path>.md (en), and vice versa.
import { readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const SRC = new URL('../src/', import.meta.url).pathname
const EN = join(SRC, 'en')

function pages(dir, skip = []) {
  const out = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (name.startsWith('.') || name === 'public' || skip.includes(full)) continue
    if (statSync(full).isDirectory()) out.push(...pages(full, skip))
    else if (name.endsWith('.md')) out.push(full)
  }
  return out
}

const vi = new Set(pages(SRC, [EN]).map((p) => relative(SRC, p)))
const en = new Set(pages(EN).map((p) => relative(EN, p)))

const missingEn = [...vi].filter((p) => !en.has(p))
const missingVi = [...en].filter((p) => !vi.has(p))

for (const p of missingEn) console.error(`missing English page:    src/en/${p}`)
for (const p of missingVi) console.error(`missing Vietnamese page: src/${p}`)

if (missingEn.length || missingVi.length) process.exit(1)
console.log(`locales in sync: ${vi.size} pages in vi and en`)
