import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'
import { nav, sidebar } from '../sidebar.mts'

export const vi: LocaleSpecificConfig<DefaultTheme.Config> = {
  description: 'Tài liệu hệ thống chấm bài trực tuyến LCOJ',
  themeConfig: {
    nav: nav('vi'),
    sidebar: sidebar('vi'),
    editLink: {
      pattern: 'https://github.com/luyencode/docs/edit/master/src/:path',
      text: 'Sửa trang này trên GitHub',
    },
    lastUpdated: { text: 'Cập nhật lần cuối' },
    docFooter: { prev: 'Trang trước', next: 'Trang sau' },
    outline: { level: [2, 3], label: 'Trên trang này' },
    returnToTopLabel: 'Lên đầu trang',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Giao diện',
    langMenuLabel: 'Ngôn ngữ',
    footer: {
      message:
        'LCOJ được phát triển dựa trên <a href="https://github.com/DMOJ/online-judge">DMOJ</a> và <a href="https://github.com/VNOI-Admin/OJ">VNOJ</a> (AGPL-3.0).',
      copyright:
        'Cần hỗ trợ? <a href="https://github.com/luyencode/lcoj-docker/issues">GitHub Issues</a> · <a href="https://behitek.com">behitek.com</a> · <a href="https://luyencode.net/about/#lien-he">Liên hệ</a>',
    },
  },
}
