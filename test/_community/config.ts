import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fileURLToPath } from 'node:url'
import path from 'path'

import { buildConfigWithDefaults } from '../buildConfigWithDefaults.js'
import { devUser } from '../credentials.js'
import { CategoriesCollection, categoriesSlug } from './collections/Categories.js'
import { MediaCollection } from './collections/Media/index.js'
import { PostsCollection, postsSlug } from './collections/Posts/index.js'
import { MenuGlobal } from './globals/Menu/index.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfigWithDefaults({
  // ...extend config here
  collections: [PostsCollection, CategoriesCollection, MediaCollection],
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  localization: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
  },
  editor: lexicalEditor({}),
  globals: [
    // ...add more globals here
    MenuGlobal,
  ],
  onInit: async (payload) => {
    await payload.create({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })

    const cat = await payload.create({
      collection: categoriesSlug,
      data: {
        title: 'Finance',
      },
    })

    const post = await payload.create({
      collection: postsSlug,
      data: {
        title: 'example post in en',
        category: cat.id,
      },
      locale: 'en',
    })

    await payload.update({
      collection: postsSlug,
      id: post.id,
      data: {
        title: 'example post in es',
        category: cat.id,
      },
      locale: 'es',
    })
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
