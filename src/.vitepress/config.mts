import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import taskLists from 'markdown-it-task-lists'
import { vi } from './locales/vi.mts'
import { en } from './locales/en.mts'

// Pages moved in the 2026-09 restructure: old path -> new path (no locale prefix, no extension)
const LEGACY_PATHS: Record<string, string> = {
  'features/quiz': 'learn/quiz',
  'features/quiz_authoring': 'setter/quiz-authoring',
  'features/library': 'learn/exam-library',
  'features/url_shortener': 'admin/url-shortener',
  'site/installation': 'operate/installation',
  'site/operations': 'operate/operations',
  'site/updating': 'operate/updating',
  'site/uwsgi': 'operate/architecture',
  'site/management_commands': 'reference/management-commands',
  'site/contest_formats': 'organize/contest-formats',
  'site/permission_system': 'admin/permissions',
  'site/managing_problems': 'setter/managing-problems',
  'site/mathoid': 'operate/mathoid',
  'site/texoid': 'operate/texoid',
  'site/pdfoid': 'operate/pdfoid',
  'site/recaptcha': 'operate/recaptcha',
  'site/ssl_content_proxy': 'operate/ssl-content-proxy',
  'site/user_data_download': 'operate/user-data-download',
  'site/contest_data_download': 'organize/contest-data-download',
  'site/api': 'reference/api',
  'judge/setting_up_a_judge': 'operate/judge-setup',
  'judge/judge_configuration': 'operate/judge-configuration',
  'judge/supported_languages': 'reference/languages',
  'judge/status_codes': 'reference/status-codes',
  'problem_format/problem_format': 'setter/problem-format',
  'problem_format/custom_checkers': 'setter/checkers',
  'problem_format/custom_graders': 'setter/graders',
  'problem_format/generator': 'setter/generators',
  'problem_format/problem_examples': 'setter/examples',
  'about/LICENSE': 'about/license',
}

const SITE_URL = 'https://docs.luyencode.net'
const OG_IMAGE = `${SITE_URL}/og_logo.png`

// 'features/quiz.md' -> '/features/quiz', 'en/index.md' -> '/en/'
const pageUrl = (relativePath: string) =>
  '/' + relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')

export default withMermaid(
  defineConfig({
    title: 'LCOJ Docs',
    description: 'Tài liệu hệ thống chấm bài trực tuyến LCOJ',
    cleanUrls: true,
    lastUpdated: true,
    sitemap: { hostname: SITE_URL },
    // Icons and social metadata match luyencode.net (icon set from lcoj-site resources/icons)
    head: [
      ['link', { rel: 'icon', href: '/favicon.ico' }],
      ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
      ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
      ['link', { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' }],
      ['link', { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-chrome-192x192.png' }],
      ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon-180x180.png' }],
      ['meta', { name: 'theme-color', content: '#231F20' }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:site_name', content: 'LCOJ: Luyện Code Online Judge' }],
      ['meta', { property: 'og:image', content: OG_IMAGE }],
      ['meta', { property: 'og:image:type', content: 'image/png' }],
      ['meta', { property: 'og:image:width', content: '1200' }],
      ['meta', { property: 'og:image:height', content: '675' }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['meta', { name: 'twitter:site', content: '@nguyenvanhieuvn' }],
      ['meta', { name: 'twitter:creator', content: '@nguyenvanhieuvn' }],
      ['meta', { name: 'twitter:image', content: OG_IMAGE }],
      // Redirect old URLs. GitHub Pages has no server-side redirects, but this runs on every page,
      // including 404.html, so both Docsify links (/#/site/x?id=y) and pre-restructure paths
      // (/site/x, /en/site/x) land on the page's current URL.
      [
        'script',
        {},
        `(function(){var R=${JSON.stringify(LEGACY_PATHS)};` +
          `var h=location.hash,p=location.pathname,a=h,fromHash=h.indexOf('#/')===0;` +
          `if(fromHash){var m=h.slice(1).match(/^([^?]*)(?:\\?id=(.*))?$/);p=m[1];a=m[2]?'#'+m[2]:'';}` +
          `p=p.replace(/\\.(md|html)$/,'').replace(/\\/README$/i,'/');` +
          `var en=p.indexOf('/en/')===0,k=en?p.slice(3):p,n=R[k.replace(/^\\//,'')];` +
          `if(n)location.replace((en?'/en/':'/')+n+a);else if(fromHash)location.replace(p+a);})();`,
      ],
    ],

    // Per-page social/SEO tags: title, description, canonical URL, locale and the vi/en alternate
    transformHead({ pageData, title, description, content }) {
      if (pageData.isNotFound) return []
      // Pages without a frontmatter description get the first paragraph of the page instead
      if (!pageData.frontmatter.description) {
        const p = content.split('class="vp-doc')[1]?.match(/<p>([\s\S]*?)<\/p>/)?.[1]
        const text = p
          ?.replace(/<[^>]+>/g, '')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&amp;/g, '&')
          .replace(/\s+/g, ' ')
          .trim()
        if (text) description = text.length > 160 ? text.slice(0, 157).trimEnd() + '…' : text
      }
      const path = pageUrl(pageData.relativePath)
      const isEn = path.startsWith('/en/')
      const viPath = isEn ? path.slice(3) || '/' : path
      const enPath = isEn ? path : '/en' + path
      const url = SITE_URL + path
      return [
        ['meta', { name: 'description', content: description }],
        ['link', { rel: 'canonical', href: url }],
        ['link', { rel: 'alternate', hreflang: 'vi', href: SITE_URL + viPath }],
        ['link', { rel: 'alternate', hreflang: 'en', href: SITE_URL + enPath }],
        ['link', { rel: 'alternate', hreflang: 'x-default', href: SITE_URL + viPath }],
        ['meta', { property: 'og:url', content: url }],
        ['meta', { property: 'og:locale', content: isEn ? 'en_US' : 'vi_VN' }],
        ['meta', { property: 'og:locale:alternate', content: isEn ? 'vi_VN' : 'en_US' }],
        ['meta', { property: 'og:title', content: title }],
        ['meta', { property: 'og:description', content: description }],
        ['meta', { property: 'og:image:alt', content: title }],
        ['meta', { name: 'twitter:title', content: title }],
        ['meta', { name: 'twitter:description', content: description }],
      ]
    },

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
      // Render "- [ ] item" checklists (used in "Before you start" sections) as checkboxes
      config: (md) => md.use(taskLists, { label: true }),
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
