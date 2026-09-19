import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import { vi } from './locales/vi.mts'
import { en } from './locales/en.mts'

export default withMermaid(
  defineConfig({
    title: 'LCOJ Docs',
    description: 'Tài liệu hệ thống chấm bài trực tuyến LCOJ',
    cleanUrls: true,
    lastUpdated: true,
    head: [
      ['link', { rel: 'icon', href: '/favicon.ico' }],
      // Old Docsify links look like /#/site/installation?id=buoc-2 — send them to /site/installation#buoc-2
      [
        'script',
        {},
        `(function(){var h=location.hash;if(h.indexOf('#/')!==0)return;` +
          `var m=h.slice(1).match(/^([^?]*)(?:\\?id=(.*))?$/);` +
          `var p=m[1].replace(/\\.md$/,'').replace(/\\/README$/i,'/');` +
          `location.replace(p+(m[2]?'#'+m[2]:''));})();`,
      ],
    ],

    locales: {
      root: { label: 'Tiếng Việt', lang: 'vi-VN', ...vi },
      en: { label: 'English', lang: 'en-US', link: '/en/', ...en },
    },

    themeConfig: {
      logo: '/logo.png',
      siteTitle: false,
      socialLinks: [{ icon: 'github', link: 'https://github.com/luyencode/lcoj-docker' }],
      search: {
        provider: 'local',
        options: {
          locales: {
            root: {
              translations: {
                button: { buttonText: 'Tìm kiếm', buttonAriaLabel: 'Tìm kiếm' },
                modal: {
                  noResultsText: 'Không tìm thấy kết quả',
                  resetButtonTitle: 'Xóa',
                  footer: { selectText: 'chọn', navigateText: 'di chuyển', closeText: 'đóng' },
                },
              },
            },
          },
        },
      },
    },

    markdown: {
      languageAlias: { env: 'dotenv', cron: 'shellscript' },
    },

    vite: {
      // Mermaid is large on its own; it's loaded lazily, only on pages with diagrams
      build: { chunkSizeWarningLimit: 2000 },
      // Pre-bundle mermaid so its CommonJS deps (e.g. fastdom) get ESM interop in `vitepress dev`
      optimizeDeps: { include: ['mermaid'] },
    },

    mermaid: {},
  }),
)
