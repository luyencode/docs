import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'
import { nav, sidebar } from '../sidebar.mts'

export const en: LocaleSpecificConfig<DefaultTheme.Config> = {
  description: 'Documentation for the LCOJ online judge',
  themeConfig: {
    nav: nav('en'),
    sidebar: sidebar('en'),
    editLink: {
      pattern: 'https://github.com/luyencode/docs/edit/master/src/:path',
      text: 'Edit this page on GitHub',
    },
    lastUpdated: { text: 'Last updated' },
    footer: {
      message:
        'LCOJ is built on <a href="https://github.com/DMOJ/online-judge">DMOJ</a> and <a href="https://github.com/VNOI-Admin/OJ">VNOJ</a> (AGPL-3.0).',
      copyright:
        'Need help? <a href="https://github.com/luyencode/lcoj-docker/issues">GitHub Issues</a> · <a href="https://behitek.com">behitek.com</a> · <a href="https://luyencode.net/about/#lien-he">Contact</a>',
    },
  },
}
