import type { CollectionConfig } from 'payload'

export const mediaSlug = 'media'

export const MediaCollection: CollectionConfig = {
  slug: mediaSlug,
  access: {
    create: () => true,
    read: () => true,
  },
  fields: [
    {
      type: 'text',
      name: 'alt',
    },
    {
      type: 'text',
      name: 'readonlyText',
      defaultValue: 'hello world',
      admin: {
        readOnly: true,
      },
    },
    {
      type: 'array',
      name: 'readonlyArray',
      defaultValue: [{ arrayText: 'Some array member in readonly array' }],
      admin: {
        readOnly: true,
      },
      fields: [
        {
          type: 'text',
          name: 'arrayText',
        },
      ],
    },
    {
      type: 'array',
      name: 'editableWithReadonlyMemberArray',
      defaultValue: [{ arrayText: 'Some array member in readonly array' }],
      fields: [
        {
          type: 'text',
          name: 'arrayReadonlyText',
          defaultValue: 'Cant touch this',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      type: 'array',
      name: 'editableArray',
      admin: {
        readOnly: false,
      },
      fields: [
        {
          type: 'text',
          name: 'arrayEditableText',
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          name: 'namedTab',
          fields: [
            {
              type: 'text',
              name: 'namedTabText',
            },
          ],
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'unnamedTab',
          fields: [
            {
              type: 'text',
              name: 'unnamedTabText',
            },
          ],
        },
      ],
    },
  ],
  upload: {
    crop: true,
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        height: 200,
        width: 200,
      },
      {
        name: 'medium',
        height: 800,
        width: 800,
      },
      {
        name: 'large',
        height: 1200,
        width: 1200,
      },
    ],
  },
}
