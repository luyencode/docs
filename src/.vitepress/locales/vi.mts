import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const vi: LocaleSpecificConfig<DefaultTheme.Config> = {
  description: 'Tài liệu hệ thống chấm bài trực tuyến LCOJ',
  themeConfig: {
    nav: [
      { text: 'Website', link: '/site/installation' },
      { text: 'Judge', link: '/judge/setting_up_a_judge' },
      { text: 'Bài tập', link: '/problem_format/problem_format' },
      { text: 'luyencode.net', link: 'https://luyencode.net' },
    ],
    sidebar: [
      {
        text: 'Hệ thống Website',
        items: [
          { text: 'Cài đặt website', link: '/site/installation' },
          { text: 'Vận hành hệ thống', link: '/site/operations' },
          { text: 'Cập nhật website', link: '/site/updating' },
          { text: 'Cấu hình uWSGI', link: '/site/uwsgi' },
          { text: 'Management Commands', link: '/site/management_commands' },
          { text: 'Các định dạng kỳ thi', link: '/site/contest_formats' },
          { text: 'Hệ thống phân quyền', link: '/site/permission_system' },
          { text: 'Quản lý bài tập', link: '/site/managing_problems' },
          { text: 'Hiển thị công thức toán học LaTeX', link: '/site/mathoid' },
          { text: 'Hiển thị sơ đồ LaTeX', link: '/site/texoid' },
          { text: 'Tạo file PDF cho đề bài', link: '/site/pdfoid' },
          { text: 'Chống spam với reCAPTCHA', link: '/site/recaptcha' },
          { text: 'SSL proxy cho nội dung người dùng', link: '/site/ssl_content_proxy' },
          { text: 'Tải dữ liệu người dùng', link: '/site/user_data_download' },
          { text: 'Tải dữ liệu kỳ thi', link: '/site/contest_data_download' },
          { text: 'API', link: '/site/api' },
        ],
      },
      {
        text: 'Hệ thống Judge',
        items: [
          { text: 'Cài đặt judge', link: '/judge/setting_up_a_judge' },
          { text: 'Cấu hình judge', link: '/judge/judge_configuration' },
          { text: 'Các ngôn ngữ được hỗ trợ', link: '/judge/supported_languages' },
          { text: 'Các mã trạng thái', link: '/judge/status_codes' },
        ],
      },
      {
        text: 'Định dạng bài tập',
        items: [
          { text: 'Cấu trúc bài tập', link: '/problem_format/problem_format' },
          { text: 'Custom checker', link: '/problem_format/custom_checkers' },
          { text: 'Custom grader', link: '/problem_format/custom_graders' },
          { text: 'Generator', link: '/problem_format/generator' },
          { text: 'Ví dụ bài tập', link: '/problem_format/problem_examples' },
        ],
      },
      {
        text: 'Giới thiệu',
        items: [{ text: 'Giấy phép', link: '/about/LICENSE' }],
      },
    ],
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
