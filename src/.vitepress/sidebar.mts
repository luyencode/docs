import type { DefaultTheme } from 'vitepress'

// One definition for both locales, so the vi and en sidebars can't drift apart.
// Each entry: [path without locale prefix, vi label, en label]
type Entry = [string, string, string]
type Group = { vi: string; en: string; items: Entry[] }

const groups: Group[] = [
  {
    vi: 'Học sinh',
    en: 'Students',
    items: [
      ['/learn/submissions', 'Nộp bài và chấm bài', 'Submitting and judging'],
      ['/learn/quiz', 'Làm bài trắc nghiệm', 'Taking a quiz'],
      ['/learn/exam-library', 'Thư viện đề thi', 'Exam library'],
    ],
  },
  {
    vi: 'Người ra đề',
    en: 'Problem setters',
    items: [
      ['/setter/managing-problems', 'Quản lý bài tập', 'Managing problems'],
      ['/setter/problem-format', 'Cấu trúc bài tập', 'Problem format'],
      ['/setter/checkers', 'Checker', 'Checkers'],
      ['/setter/graders', 'Grader', 'Graders'],
      ['/setter/generators', 'Generator', 'Generators'],
      ['/setter/examples', 'Ví dụ bài tập', 'Problem examples'],
      ['/setter/quiz-authoring', 'Tạo bài trắc nghiệm', 'Creating quizzes'],
    ],
  },
  {
    vi: 'Tổ chức kỳ thi',
    en: 'Contest organizers',
    items: [
      ['/organize/contest-formats', 'Các định dạng kỳ thi', 'Contest formats'],
      ['/organize/contest-data-download', 'Tải dữ liệu kỳ thi', 'Contest data download'],
    ],
  },
  {
    vi: 'Quản trị viên',
    en: 'Site admins',
    items: [
      ['/admin/permissions', 'Hệ thống phân quyền', 'Permission system'],
      ['/admin/url-shortener', 'Rút gọn liên kết', 'URL shortener'],
    ],
  },
  {
    vi: 'Vận hành (tự cài đặt)',
    en: 'Operators (self-hosting)',
    items: [
      ['/operate/architecture', 'Kiến trúc hệ thống', 'Architecture'],
      ['/operate/installation', 'Cài đặt với Docker', 'Installing with Docker'],
      ['/operate/environment', 'Biến môi trường', 'Environment variables'],
      ['/operate/scripts', 'Các script hỗ trợ', 'Helper scripts'],
      ['/operate/operations', 'Vận hành hằng ngày', 'Day-to-day operations'],
      ['/operate/updating', 'Cập nhật hệ thống', 'Updating'],
      ['/operate/judge-setup', 'Cài đặt judge', 'Setting up judges'],
      ['/operate/judge-configuration', 'Cấu hình judge', 'Judge configuration'],
      ['/operate/mathoid', 'Công thức toán (Mathoid)', 'Math rendering (Mathoid)'],
      ['/operate/texoid', 'Sơ đồ LaTeX (Texoid)', 'LaTeX diagrams (Texoid)'],
      ['/operate/pdfoid', 'Xuất PDF đề bài (PDFoid)', 'Problem PDFs (PDFoid)'],
      ['/operate/recaptcha', 'Chống spam với reCAPTCHA', 'reCAPTCHA'],
      ['/operate/ssl-content-proxy', 'Proxy SSL cho nội dung', 'SSL content proxy'],
      ['/operate/user-data-download', 'Tải dữ liệu người dùng', 'User data download'],
    ],
  },
  {
    vi: 'Tham khảo',
    en: 'Reference',
    items: [
      ['/reference/status-codes', 'Mã trạng thái', 'Status codes'],
      ['/reference/languages', 'Ngôn ngữ được hỗ trợ', 'Supported languages'],
      ['/reference/management-commands', 'Management commands', 'Management commands'],
      ['/reference/api', 'API', 'API'],
    ],
  },
  {
    vi: 'Giới thiệu',
    en: 'About',
    items: [['/about/license', 'Giấy phép', 'License']],
  },
]

export function sidebar(lang: 'vi' | 'en'): DefaultTheme.SidebarItem[] {
  const prefix = lang === 'en' ? '/en' : ''
  return groups.map((g) => ({
    text: g[lang],
    collapsed: false,
    items: g.items.map(([path, vi, en]) => ({ text: lang === 'en' ? en : vi, link: prefix + path })),
  }))
}

export function nav(lang: 'vi' | 'en'): DefaultTheme.NavItem[] {
  const p = lang === 'en' ? '/en' : ''
  const t = (vi: string, en: string) => (lang === 'en' ? en : vi)
  return [
    { text: t('Học sinh', 'Students'), link: `${p}/learn/submissions`, activeMatch: `^${p}/learn/` },
    { text: t('Ra đề', 'Setters'), link: `${p}/setter/managing-problems`, activeMatch: `^${p}/setter/` },
    { text: t('Vận hành', 'Operators'), link: `${p}/operate/architecture`, activeMatch: `^${p}/operate/` },
    { text: t('Tham khảo', 'Reference'), link: `${p}/reference/status-codes`, activeMatch: `^${p}/reference/` },
    { text: 'luyencode.net', link: 'https://luyencode.net' },
  ]
}
