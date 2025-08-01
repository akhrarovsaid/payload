import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import { AdminUrlUtil } from 'helpers/adminUrlUtil.js'
import path from 'path'
import { wait } from 'payload/shared'
import { fileURLToPath } from 'url'

import { ensureCompilationIsDone, initPageConsoleErrorCatch, saveDocAndAssert } from '../helpers.js'
import { initPayloadE2ENoConfig } from '../helpers/initPayloadE2ENoConfig.js'
import { TEST_TIMEOUT_LONG } from '../playwright.config.js'
import { collectionSlugs } from './shared.js'

const { beforeAll, describe } = test
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

describe('Field Error States', () => {
  let serverURL: string
  let page: Page
  let validateDraftsOff: AdminUrlUtil
  let validateDraftsOn: AdminUrlUtil
  let validateDraftsOnAutosave: AdminUrlUtil
  let prevValue: AdminUrlUtil
  let prevValueRelation: AdminUrlUtil
  let errorFieldsURL: AdminUrlUtil

  beforeAll(async ({ browser }, testInfo) => {
    testInfo.setTimeout(TEST_TIMEOUT_LONG)
    ;({ serverURL } = await initPayloadE2ENoConfig({ dirname }))
    validateDraftsOff = new AdminUrlUtil(serverURL, collectionSlugs.validateDraftsOff)
    validateDraftsOn = new AdminUrlUtil(serverURL, collectionSlugs.validateDraftsOn)
    validateDraftsOnAutosave = new AdminUrlUtil(serverURL, collectionSlugs.validateDraftsOnAutosave)
    prevValue = new AdminUrlUtil(serverURL, collectionSlugs.prevValue)
    prevValueRelation = new AdminUrlUtil(serverURL, collectionSlugs.prevValueRelation)
    errorFieldsURL = new AdminUrlUtil(serverURL, collectionSlugs.errorFields)
    const context = await browser.newContext()
    page = await context.newPage()
    initPageConsoleErrorCatch(page)

    await ensureCompilationIsDone({ page, serverURL })
  })

  test('Remove row should remove error states from parent fields', async () => {
    await page.goto(`${serverURL}/admin/collections/error-fields/create`)

    // add parent array
    await page.locator('#field-parentArray > .array-field__add-row').click()

    // add first child array
    await page.locator('#parentArray-row-0 .collapsible__content .array-field__add-row').click()
    await page.locator('#field-parentArray__0__childArray__0__childArrayText').focus()
    await page.keyboard.type('T1')

    // add second child array
    await page.locator('#parentArray-row-0 .collapsible__content .array-field__add-row').click()
    await page.locator('#field-parentArray__0__childArray__1__childArrayText').focus()
    await page.keyboard.type('T2')

    // add third child array
    await page.locator('#parentArray-row-0 .collapsible__content .array-field__add-row').click()

    // remove the row
    await page.locator('#parentArray-0-childArray-row-2 .array-actions__button').click()

    await page
      .locator('#parentArray-0-childArray-row-2 .array-actions__action.array-actions__remove')
      .click()

    await page.locator('#action-save').click()

    const errorPill = await page.waitForSelector(
      '#parentArray-row-0 > .collapsible > .collapsible__toggle-wrap .array-field__row-error-pill',
      { state: 'hidden', timeout: 500 },
    )

    expect(errorPill).toBeNull()
  })

  describe('draft validations', () => {
    test('should not validate drafts by default', async () => {
      await page.goto(validateDraftsOff.create)
      await saveDocAndAssert(page, '#action-save-draft')
    })

    test('should validate drafts when enabled', async () => {
      await page.goto(validateDraftsOn.create)
      await saveDocAndAssert(page, '#action-save-draft', 'error')
    })

    test('should show validation errors when validate and autosave are enabled', async () => {
      await page.goto(validateDraftsOnAutosave.create)
      await page.locator('#field-title').fill('valid')
      await saveDocAndAssert(page)
      await page.locator('#field-title').fill('')
      await saveDocAndAssert(page, '#action-save', 'error')
    })
  })

  describe('previous values', () => {
    test('should pass previous value into validate function', async () => {
      // save original
      await page.goto(prevValue.create)
      await page.locator('#field-title').fill('original value')
      await saveDocAndAssert(page)
      await page.locator('#field-title').fill('original value 2')
      await saveDocAndAssert(page)
      await wait(500)

      // create relation to doc
      await page.goto(prevValueRelation.create)
      await page.locator('#field-previousValueRelation .react-select').click()
      await page.locator('#field-previousValueRelation .rs__option').first().click()
      await saveDocAndAssert(page)

      // go back to doc
      await page.goto(prevValue.list)
      await page.locator('.row-1 a').click()
      await page.locator('#field-description').fill('some description')
      await saveDocAndAssert(page)
      await page.locator('#field-title').fill('changed')
      await saveDocAndAssert(page, '#action-save', 'error')

      // ensure value is the value before relationship association
      await page.reload()
      await expect(page.locator('#field-title')).toHaveValue('original value 2')
    })
  })

  describe('error field types', () => {
    async function prefillBaseRequiredFields() {
      const homeTabLocator = page.locator('.tabs-field__tab-button', {
        hasText: 'Home',
      })
      const heroTabLocator = page.locator('.tabs-field__tab-button', {
        hasText: 'Hero',
      })

      await homeTabLocator.click()
      // fill out all required fields in the home tab
      await page.locator('#field-home__text').fill('Home Collapsible Text')
      await page.locator('#field-home__tabText').fill('Home Tab Text')

      await page.locator('#field-group__text').fill('Home Group Text')
      await heroTabLocator.click()
      // fill out all required fields in the hero tab
      await page.locator('#field-tabText').fill('Hero Tab Text')
      await page.locator('#field-text').fill('Hero Tab Collapsible Text')
    }
    test('group errors', async () => {
      await page.goto(errorFieldsURL.create)
      await prefillBaseRequiredFields()

      // clear group and save
      await page.locator('#field-group__text').fill('')
      await saveDocAndAssert(page, '#action-save', 'error')

      // should show the error pill and count
      const groupFieldErrorPill = page.locator('#field-group .group-field__header .error-pill', {
        hasText: '1 error',
      })
      await expect(groupFieldErrorPill).toBeVisible()

      // finish filling out the group
      await page.locator('#field-group__text').fill('filled out')

      await expect(page.locator('#field-group .group-field__header .error-pill')).toBeHidden()
      await saveDocAndAssert(page, '#action-save')
    })
  })
})
