
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/Ecom-frontend/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {},
  assets: {
    'index.csr.html': {size: 25149, hash: '5543f69e28fb9313d9ec244757172128235d79aab59bd0efb4fee9e1ae12f2c8', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17149, hash: '15c414169be4bd21cd55a8ddeda20e9bcb146b5066b31548a5d750d54a41882a', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-F2TLLIZK.css': {size: 29917, hash: 'cS/lYkAiJcw', text: () => import('./assets-chunks/styles-F2TLLIZK_css.mjs').then(m => m.default)}
  },
};
