import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'

export const en: LocaleSpecificConfig<DefaultTheme.Config> = {
  description: 'Documentation for the LCOJ online judge',
  themeConfig: {
    nav: [
      { text: 'Features', link: '/en/features/quiz' },
      { text: 'Website', link: '/en/site/installation' },
      { text: 'Judge', link: '/en/judge/setting_up_a_judge' },
      { text: 'Problems', link: '/en/problem_format/problem_format' },
      { text: 'luyencode.net', link: 'https://luyencode.net' },
    ],
    sidebar: {
      '/en/': [
        {
          text: 'Features',
          items: [
            { text: 'Taking a quiz', link: '/en/features/quiz' },
            { text: 'Creating quizzes', link: '/en/features/quiz_authoring' },
            { text: 'Exam library', link: '/en/features/library' },
            { text: 'URL shortener', link: '/en/features/url_shortener' },
          ],
        },
        {
          text: 'Website',
          items: [
            { text: 'Installing the website', link: '/en/site/installation' },
            { text: 'Operating the system', link: '/en/site/operations' },
            { text: 'Updating the website', link: '/en/site/updating' },
            { text: 'Configuring uWSGI', link: '/en/site/uwsgi' },
            { text: 'Management commands', link: '/en/site/management_commands' },
            { text: 'Contest formats', link: '/en/site/contest_formats' },
            { text: 'Permission system', link: '/en/site/permission_system' },
            { text: 'Managing problems', link: '/en/site/managing_problems' },
            { text: 'Rendering LaTeX math', link: '/en/site/mathoid' },
            { text: 'Rendering LaTeX diagrams', link: '/en/site/texoid' },
            { text: 'Generating problem PDFs', link: '/en/site/pdfoid' },
            { text: 'Fighting spam with reCAPTCHA', link: '/en/site/recaptcha' },
            { text: 'SSL proxy for user content', link: '/en/site/ssl_content_proxy' },
            { text: 'User data download', link: '/en/site/user_data_download' },
            { text: 'Contest data download', link: '/en/site/contest_data_download' },
            { text: 'API', link: '/en/site/api' },
          ],
        },
        {
          text: 'Judge',
          items: [
            { text: 'Setting up a judge', link: '/en/judge/setting_up_a_judge' },
            { text: 'Judge configuration', link: '/en/judge/judge_configuration' },
            { text: 'Supported languages', link: '/en/judge/supported_languages' },
            { text: 'Status codes', link: '/en/judge/status_codes' },
          ],
        },
        {
          text: 'Problem format',
          items: [
            { text: 'Problem structure', link: '/en/problem_format/problem_format' },
            { text: 'Custom checkers', link: '/en/problem_format/custom_checkers' },
            { text: 'Custom graders', link: '/en/problem_format/custom_graders' },
            { text: 'Generators', link: '/en/problem_format/generator' },
            { text: 'Problem examples', link: '/en/problem_format/problem_examples' },
          ],
        },
        {
          text: 'About',
          items: [{ text: 'License', link: '/en/about/LICENSE' }],
        },
      ],
    },
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
