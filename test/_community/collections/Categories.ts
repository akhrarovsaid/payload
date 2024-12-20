import type { CollectionConfig } from 'payload'

export const categoriesSlug = 'categories'

export const CategoriesCollection: CollectionConfig = {
  slug: categoriesSlug,
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'posts',
      type: 'join',
      on: 'categories',
      collection: 'posts',
    },
  ],
  versions: {
    drafts: true,
  },
}
