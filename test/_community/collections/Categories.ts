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
      type: 'join',
      collection: 'posts',
      on: 'category',
      name: 'relatedPosts',
    },
  ],
}
