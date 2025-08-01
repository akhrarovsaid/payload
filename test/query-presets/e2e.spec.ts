import type { BrowserContext, Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import { devUser } from 'credentials.js'
import { openListColumns } from 'helpers/e2e/openListColumns.js'
import { toggleColumn } from 'helpers/e2e/toggleColumn.js'
import { openNav } from 'helpers/e2e/toggleNav.js'
import * as path from 'path'
import { fileURLToPath } from 'url'

import type { PayloadTestSDK } from '../helpers/sdk/index.js'
import type { Config, PayloadQueryPreset } from './payload-types.js'

import {
  ensureCompilationIsDone,
  exactText,
  initPageConsoleErrorCatch,
  saveDocAndAssert,
  // throttleTest,
} from '../helpers.js'
import { AdminUrlUtil } from '../helpers/adminUrlUtil.js'
import { clickListMenuItem, openListMenu } from '../helpers/e2e/toggleListMenu.js'
import { initPayloadE2ENoConfig } from '../helpers/initPayloadE2ENoConfig.js'
import { TEST_TIMEOUT_LONG } from '../playwright.config.js'
import { assertURLParams } from './helpers/assertURLParams.js'
import { openQueryPresetDrawer } from './helpers/openQueryPresetDrawer.js'
import { clearSelectedPreset, selectPreset } from './helpers/togglePreset.js'
import { seedData } from './seed.js'
import { pagesSlug } from './slugs.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const { beforeAll, describe, beforeEach } = test

let page: Page
let pagesUrl: AdminUrlUtil
let payload: PayloadTestSDK<Config>
let serverURL: string
let everyoneID: string | undefined
let context: BrowserContext
let user: any
let ownerUser: any

let seededData: {
  everyone: PayloadQueryPreset
  onlyMe: PayloadQueryPreset
  specificUsers: PayloadQueryPreset
}

describe('Query Presets', () => {
  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({ dirname }))

    pagesUrl = new AdminUrlUtil(serverURL, pagesSlug)

    context = await browser.newContext()
    page = await context.newPage()

    initPageConsoleErrorCatch(page)

    await ensureCompilationIsDone({ page, serverURL })

    user = await payload
      .login({
        collection: 'users',
        data: {
          email: devUser.email,
          password: devUser.password,
        },
      })
      ?.then((res) => res.user) // TODO: this type is wrong

    ownerUser = await payload
      .find({
        collection: 'users',
        where: {
          name: {
            equals: 'Owner',
          },
        },
        limit: 1,
        depth: 0,
      })
      ?.then((res) => res.docs[0])
  })

  beforeEach(async () => {
    // await throttleTest({
    //   page,
    //   context,
    //   delay: 'Fast 4G',
    // })

    // clear and reseed everything
    try {
      await payload.delete({
        collection: 'payload-query-presets',
        where: {
          id: {
            exists: true,
          },
        },
      })

      const [, everyone, onlyMe, specificUsers] = await Promise.all([
        payload.delete({
          collection: 'payload-preferences',
          where: {
            and: [
              {
                key: { equals: 'pages-list' },
              },
              {
                'user.relationTo': {
                  equals: 'users',
                },
              },
              {
                'user.value': {
                  equals: user.id,
                },
              },
            ],
          },
        }),
        payload.create({
          collection: 'payload-query-presets',
          data: seedData.everyone({ ownerUserID: ownerUser?.id || '' }),
        }),
        payload.create({
          collection: 'payload-query-presets',
          data: seedData.onlyMe({ ownerUserID: ownerUser?.id || '' }),
        }),
        payload.create({
          collection: 'payload-query-presets',
          data: seedData.specificUsers({ ownerUserID: ownerUser?.id || '', adminUserID: user.id }),
        }),
      ])

      seededData = {
        everyone,
        onlyMe,
        specificUsers,
      }

      everyoneID = everyone.id
    } catch (error) {
      console.error('Error in beforeEach:', error)
    }
  })

  test('should select preset and apply filters', async () => {
    await page.goto(pagesUrl.list)

    await selectPreset({ page, presetTitle: seededData.everyone.title })

    await assertURLParams({
      page,
      columns: seededData.everyone.columns,
      preset: everyoneID,
    })
  })

  test('should clear selected preset and reset filters', async () => {
    await page.goto(pagesUrl.list)

    await selectPreset({ page, presetTitle: seededData.everyone.title })

    await clearSelectedPreset({ page })

    // ensure that the preset was cleared from preferences by navigating without the `?preset=` param
    // e.g. do not do `page.reload()`
    await page.goto(pagesUrl.list)

    // poll url to ensure that `?preset=` param is not present
    // this is first set to an empty string to clear from the user's preferences
    // it is then removed entirely after it is processed on the server
    const regex = /preset=/
    await page.waitForURL((url) => !regex.test(url.search), { timeout: TEST_TIMEOUT_LONG })

    await expect(
      page.locator('button#select-preset', {
        hasText: exactText('Select Preset'),
      }),
    ).toBeVisible()
  })

  test('should delete a preset, clear selection, and reset changes', async () => {
    await page.goto(pagesUrl.list)
    await selectPreset({ page, presetTitle: seededData.everyone.title })
    await openListMenu({ page })

    await clickListMenuItem({ page, menuItemLabel: 'Delete' })

    await page.locator('#confirm-delete-preset #confirm-action').click()

    // columns can either be omitted or an empty string after being cleared
    const regex = /columns=(?:\[\]|$)/

    await page.waitForURL((url) => !regex.test(url.search), {
      timeout: TEST_TIMEOUT_LONG,
    })

    await expect(
      page.locator('button#select-preset', {
        hasText: exactText('Select Preset'),
      }),
    ).toBeVisible()

    await openQueryPresetDrawer({ page })
    const modal = page.locator('[id^=list-drawer_0_]')
    await expect(modal).toBeVisible()

    await expect(
      modal.locator('tbody tr td button', {
        hasText: exactText(seededData.everyone.title),
      }),
    ).toBeHidden()
  })

  test('should save last used preset to preferences and load on initial render', async () => {
    await page.goto(pagesUrl.list)

    await selectPreset({ page, presetTitle: seededData.everyone.title })

    await page.goto(pagesUrl.list)

    await assertURLParams({
      page,
      columns: seededData.everyone.columns,
      where: seededData.everyone.where,
      preset: everyoneID,
    })

    // for good measure, also soft navigate away and back
    await page.goto(pagesUrl.admin)
    await openNav(page)
    await page.click(`a[href="/admin/collections/${pagesSlug}"]`)

    await assertURLParams({
      page,
      columns: seededData.everyone.columns,
      where: seededData.everyone.where,
      preset: everyoneID,
    })
  })

  test('should only show "edit" and "delete" controls when there is an active preset', async () => {
    await page.goto(pagesUrl.list)
    await openListMenu({ page })

    await expect(
      page.locator('#list-menu .popup__content .popup-button-list__button', {
        hasText: exactText('Edit'),
      }),
    ).toBeHidden()

    await expect(
      page.locator('#list-menu .popup__content .popup-button-list__button', {
        hasText: exactText('Delete'),
      }),
    ).toBeHidden()

    await selectPreset({ page, presetTitle: seededData.everyone.title })

    await openListMenu({ page })

    await expect(
      page.locator('#list-menu .popup__content .popup-button-list__button', {
        hasText: exactText('Edit'),
      }),
    ).toBeVisible()

    await expect(
      page.locator('#list-menu .popup__content .popup-button-list__button', {
        hasText: exactText('Delete'),
      }),
    ).toBeVisible()
  })

  test('should only show "reset" and "save" controls when there is an active preset and changes have been made', async () => {
    await page.goto(pagesUrl.list)

    await openListMenu({ page })

    await expect(
      page.locator('#list-menu .popup__content .popup-button-list__button', {
        hasText: exactText('Reset'),
      }),
    ).toBeHidden()

    await expect(
      page.locator('#list-menu .popup__content .popup-button-list__button', {
        hasText: exactText('Update for everyone'),
      }),
    ).toBeHidden()

    await expect(
      page.locator('#list-menu .popup__content .popup-button-list__button', {
        hasText: exactText('Save'),
      }),
    ).toBeHidden()

    await selectPreset({ page, presetTitle: seededData.onlyMe.title })

    await toggleColumn(page, { columnLabel: 'ID' })

    await openListMenu({ page })

    await expect(
      page.locator('#list-menu .popup__content .popup-button-list__button', {
        hasText: exactText('Reset'),
      }),
    ).toBeVisible()

    await expect(
      page.locator('#list-menu .popup__content .popup-button-list__button', {
        hasText: exactText('Save'),
      }),
    ).toBeVisible()
  })

  test('should conditionally render "update for everyone" label based on if preset is shared', async () => {
    await page.goto(pagesUrl.list)

    await selectPreset({ page, presetTitle: seededData.onlyMe.title })

    await toggleColumn(page, { columnLabel: 'ID' })

    await openListMenu({ page })

    // When not shared, the label is "Save"
    await expect(
      page.locator('#list-menu .popup__content .popup-button-list__button', {
        hasText: exactText('Save'),
      }),
    ).toBeVisible()

    await selectPreset({ page, presetTitle: seededData.everyone.title })

    await toggleColumn(page, { columnLabel: 'ID' })

    await openListMenu({ page })

    // When shared, the label is "Update for everyone"
    await expect(
      page.locator('#list-menu .popup__content .popup-button-list__button', {
        hasText: exactText('Update for everyone'),
      }),
    ).toBeVisible()
  })

  test('should reset active changes', async () => {
    await page.goto(pagesUrl.list)
    await selectPreset({ page, presetTitle: seededData.everyone.title })

    const { columnContainer } = await toggleColumn(page, { columnLabel: 'ID' })

    const column = columnContainer.locator(`.pill-selector .pill-selector__pill`, {
      hasText: exactText('ID'),
    })

    await openListMenu({ page })
    await clickListMenuItem({ page, menuItemLabel: 'Reset' })

    await openListColumns(page, {})
    await expect(column).toHaveClass(/pill-selector__pill--selected/)
  })

  test('should only enter modified state when changes are made to an active preset', async () => {
    await page.goto(pagesUrl.list)
    await expect(page.locator('.list-controls__modified')).toBeHidden()
    await selectPreset({ page, presetTitle: seededData.everyone.title })
    await expect(page.locator('.list-controls__modified')).toBeHidden()
    await toggleColumn(page, { columnLabel: 'ID' })
    await expect(page.locator('.list-controls__modified')).toBeVisible()
    await openListMenu({ page })
    await clickListMenuItem({ page, menuItemLabel: 'Update for everyone' })
    await expect(page.locator('.list-controls__modified')).toBeHidden()
    await toggleColumn(page, { columnLabel: 'ID' })
    await expect(page.locator('.list-controls__modified')).toBeVisible()
    await openListMenu({ page })
    await clickListMenuItem({ page, menuItemLabel: 'Reset' })
    await expect(page.locator('.list-controls__modified')).toBeHidden()
  })

  test('can edit a preset through the document drawer', async () => {
    const presetTitle = 'New Preset'

    await page.goto(pagesUrl.list)

    await selectPreset({ page, presetTitle: seededData.everyone.title })
    await openListMenu({ page })
    await clickListMenuItem({ page, menuItemLabel: 'Edit' })

    const drawer = page.locator('[id^=doc-drawer_payload-query-presets_0_]')
    const titleValue = drawer.locator('input[name="title"]')
    await expect(titleValue).toHaveValue(seededData.everyone.title)

    const newTitle = `${seededData.everyone.title} (Updated)`
    await drawer.locator('input[name="title"]').fill(newTitle)

    await saveDocAndAssert(page)

    await drawer.locator('button.doc-drawer__header-close').click()
    await expect(drawer).toBeHidden()

    await expect(page.locator('button#select-preset')).toHaveText(newTitle)
  })

  test('should not display query presets when admin.enableQueryPresets is not true', async () => {
    // go to users list view and ensure the query presets select is not visible
    const usersURL = new AdminUrlUtil(serverURL, 'users')
    await page.goto(usersURL.list)
    await expect(page.locator('#select-preset')).toBeHidden()
  })

  // eslint-disable-next-line playwright/no-skipped-test, playwright/expect-expect
  test.skip('can save a preset', () => {
    // select a preset, make a change to the presets, click "save for everyone" or "save", and ensure the changes persist
  })

  test('can create new preset', async () => {
    await page.goto(pagesUrl.list)

    const presetTitle = 'New Preset'

    await openListMenu({ page })
    await clickListMenuItem({ page, menuItemLabel: 'Create New' })
    const modal = page.locator('[id^=doc-drawer_payload-query-presets_0_]')
    await expect(modal).toBeVisible()
    await modal.locator('input[name="title"]').fill(presetTitle)

    const currentURL = page.url()
    await saveDocAndAssert(page)
    await expect(modal).toBeHidden()

    await page.waitForURL(() => page.url() !== currentURL)

    await expect(
      page.locator('button#select-preset', {
        hasText: exactText(presetTitle),
      }),
    ).toBeVisible()
  })

  test('only shows query presets related to the underlying collection', async () => {
    // no results on `posts` collection
    const postsURL = new AdminUrlUtil(serverURL, 'posts')
    await page.goto(postsURL.list)
    const drawer = await openQueryPresetDrawer({ page })
    await expect(drawer.locator('.table table > tbody > tr')).toHaveCount(0)
    await expect(drawer.locator('.collection-list__no-results')).toBeVisible()

    // results on `pages` collection
    await page.goto(pagesUrl.list)
    await openQueryPresetDrawer({ page })
    await expect(drawer.locator('.table table > tbody > tr')).toHaveCount(3)
    await drawer.locator('.collection-list__no-results').isHidden()
  })
})
