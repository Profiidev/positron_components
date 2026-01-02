import { defineConfig } from 'jsrepo';
import prettier from '@jsrepo/transform-prettier';

export default defineConfig({
  registries: ['@ieedan/shadcn-svelte-extras'],
  paths: {
    '*': '$lib/blocks',
    ui: '$lib/components/ui-extra',
    utils: '$lib/util',
    hooks: '$lib/hooks',
    actions: '$lib/actions',
    action: 'src/lib/blocks',
    hook: 'src/lib/blocks',
    lib: 'src/lib/blocks',
    util: 'src/lib/blocks'
  },
  transforms: [prettier()]
});
