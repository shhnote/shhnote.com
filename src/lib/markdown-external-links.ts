import { defineHastPlugin } from 'satteri';

// Markdown links to other origins open in a new tab, without an opener.
export const externalLinks = defineHastPlugin({
  name: 'external-links',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      const href = node.properties?.['href'];
      if (typeof href === 'string' && /^https?:\/\//.test(href)) {
        ctx.setProperty(node, 'target', '_blank');
        ctx.setProperty(node, 'rel', 'noopener');
      }
    },
  },
});
