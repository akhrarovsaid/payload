import type { CollectionConfig } from 'payload'

export const postsSlug = 'posts'

export const PostsCollection: CollectionConfig = {
  slug: postsSlug,
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: ({ t }) => t('authentication:apiKey'),
          description: ({ t }) => t('general:anotherUserTakenOver'),
          fields: [
            {
              type: 'text',
              name: 'someText',
            },
          ],
        },
        {
          label: ({ t }) => t('authentication:account'),
          fields: [
            {
              type: 'text',
              name: 'someTextAgain',
            },
          ],
        },
      ],
    },
  ],
  versions: {
    drafts: true,
  },
}
