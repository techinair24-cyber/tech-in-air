import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { getPublicSeoPaths, getSeoMetadata, renderSeoHead } from './src/seo.js'

function routeSeoPages() {
  return {
    name: 'route-seo-pages',
    apply: 'build',
    async writeBundle(options) {
      const outputDirectory = options.dir || resolve(process.cwd(), 'dist')
      const template = await readFile(resolve(outputDirectory, 'index.html'), 'utf8')
      const marker = /<!-- SEO_METADATA_START -->[\s\S]*?<!-- SEO_METADATA_END -->/
      if (!marker.test(template)) {
        throw new Error('Unable to generate route SEO pages: SEO metadata markers are missing.')
      }

      for (const path of getPublicSeoPaths().filter((route) => route !== '/')) {
        const metadata = getSeoMetadata(path)
        const html = template.replace(
          marker,
          `<!-- SEO_METADATA_START -->\n    ${renderSeoHead(metadata)}\n    <!-- SEO_METADATA_END -->`,
        )
        const routeFile = resolve(outputDirectory, path.slice(1), 'index.html')
        await mkdir(dirname(routeFile), { recursive: true })
        await writeFile(routeFile, html)
      }
    },
  }
}

export default defineConfig({
  publicDir: 'Public',
  plugins: [react(), routeSeoPages()],
  server: {
    port: 5173
  }
})
