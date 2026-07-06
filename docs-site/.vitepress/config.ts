import { defineConfig } from 'vitepress'

// Project site served at https://houtanrocky.github.io/uniswap-widget/
// so `base` MUST match the repo name. Change both `base` and the GitHub URLs
// below if the repo is ever renamed.
const REPO = 'https://github.com/houtanrocky/uniswap-widget'
const SITE = 'https://houtanrocky.github.io/uniswap-widget'
const DEFAULT_DESCRIPTION =
  'Open-source Uniswap swap widget for React and Vue. Add token swaps to a dApp with a framework-agnostic TypeScript core, wallet adapters, and no added fee.'

function pageUrl(relativePath: string) {
  const route = relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html')

  return `${SITE}/${route}`
}

export default defineConfig({
  title: 'uniswap-widget',
  titleTemplate: ':title | Uniswap Widget for React & Vue',
  description: DEFAULT_DESCRIPTION,
  base: '/uniswap-widget/',
  lastUpdated: true,

  // Emit sitemap.xml so search engines can index every page (discoverability).
  sitemap: {
    hostname: `${SITE}/`,
  },

  transformHead({ pageData }) {
    const title = pageData.title
      ? `${pageData.title} | Uniswap Widget for React & Vue`
      : 'Uniswap Widget for React & Vue'
    const description = pageData.description || DEFAULT_DESCRIPTION
    const url = pageUrl(pageData.relativePath)

    return [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
    ]
  },

  // The React README documents env vars in an ```env block; Shiki has no `env`
  // grammar, so map it to `ini` (KEY=value) to highlight it and silence the
  // build warning — without editing the published README.
  markdown: {
    languageAlias: { env: 'ini' },
  },

  // Site-wide discovery and rich-result metadata. Page-specific social and
  // canonical tags are emitted by transformHead above.
  head: [
    ['link', { rel: 'icon', href: '/uniswap-widget/favicon.ico' }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'uniswap-widget' }],
    ['meta', { property: 'og:locale', content: 'en_US' }],
    ['meta', { name: 'twitter:card', content: 'summary' }],
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: 'uniswap-widget',
        description: DEFAULT_DESCRIPTION,
        url: `${SITE}/`,
        codeRepository: REPO,
        programmingLanguage: ['TypeScript', 'React', 'Vue.js'],
        license: 'https://opensource.org/license/mit',
        runtimePlatform: 'Web browser',
        keywords: [
          'Uniswap widget',
          'React swap widget',
          'Vue swap widget',
          'Web3',
          'DeFi',
          'token swap',
        ],
      }),
    ],
  ],

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Packages', link: '/packages/react' },
      { text: 'Playground', link: '/playground/' },
      {
        text: 'npm',
        items: [
          {
            text: '@uniswap-widget/react',
            link: 'https://www.npmjs.com/package/@uniswap-widget/react',
          },
          {
            text: '@uniswap-widget/vue',
            link: 'https://www.npmjs.com/package/@uniswap-widget/vue',
          },
          {
            text: '@uniswap-widget/core',
            link: 'https://www.npmjs.com/package/@uniswap-widget/core',
          },
        ],
      },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/guide/introduction' },
          { text: 'Getting started', link: '/guide/getting-started' },
        ],
      },
      {
        text: 'Packages',
        items: [
          { text: '@uniswap-widget/react', link: '/packages/react' },
          { text: '@uniswap-widget/vue', link: '/packages/vue' },
          { text: '@uniswap-widget/core', link: '/packages/core' },
        ],
      },
      {
        text: 'Playground',
        items: [{ text: 'Example apps', link: '/playground/' }],
      },
      {
        text: 'Design',
        items: [{ text: 'Architecture', link: '/architecture/' }],
      },
    ],

    socialLinks: [{ icon: 'github', link: REPO }],

    search: { provider: 'local' },

    editLink: {
      pattern: `${REPO}/edit/main/docs-site/:path`,
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © ${new Date().getFullYear()} houtanrocky`,
    },
  },
})
