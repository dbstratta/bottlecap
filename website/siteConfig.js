// See https://docusaurus.io/docs/site-config.html for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = [
  {
    caption: 'User1',
    // You will need to prepend the image path with your baseUrl
    // if it is not '/', like: '/test-site/img/docusaurus.svg'.
    image: '/img/docusaurus.svg',
    infoLink: 'https://www.facebook.com',
    pinned: true,
  },
];

const siteConfig = {
  title: 'Bottlecap',
  tagline: 'A decentralized cryptocurrency',
  // Your website url.
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',

  projectName: 'bottlecap',
  organizationName: 'strattadb',

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [{ page: 'help', label: 'Help' }, { blog: true, label: 'Blog' }],

  // If you have users set above, you add it here:
  users,

  // Path to images for header/footer.
  headerIcon: 'img/docusaurus.svg',
  footerIcon: 'img/docusaurus.svg',
  favicon: 'img/favicon.png',

  // Colors for website.
  colors: {
    primaryColor: '#2E8555',
    secondaryColor: '#205C3B',
  },

  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Diego Stratta`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'default',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: ['https://buttons.github.io/buttons.js'],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',

  // Open Graph and Twitter card images.
  ogImage: 'img/docusaurus.png',
  twitterImage: 'img/docusaurus.png',

  repoUrl: 'https://github.com/strattadb/bottlecap',
};

module.exports = siteConfig;
