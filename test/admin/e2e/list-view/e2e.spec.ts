import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'
import { mapAsync } from 'payload'
import * as qs from 'qs-esm'

import type { Config, Geo, Post } from '../../payload-types.js'

import {
  ensureCompilationIsDone,
  exactText,
  getRoutes,
  initPageConsoleErrorCatch,
  openColumnControls,
} from '../../../helpers.js'
import { AdminUrlUtil } from '../../../helpers/adminUrlUtil.js'
import { initPayloadE2ENoConfig } from '../../../helpers/initPayloadE2ENoConfig.js'
import { customAdminRoutes } from '../../shared.js'
import {
  arrayCollectionSlug,
  customViews1CollectionSlug,
  geoCollectionSlug,
  listDrawerSlug,
  placeholderCollectionSlug,
  postsCollectionSlug,
  with300DocumentsSlug,
} from '../../slugs.js'

const { beforeAll, beforeEach, describe } = test

const title = 'Title'
const description = 'Description'

let payload: PayloadTestSDK<Config>

import { devUser } from 'credentials.js'
import { addListFilter } from 'helpers/e2e/addListFilter.js'
import { goToNextPage, goToPreviousPage } from 'helpers/e2e/goToNextPage.js'
import { goToFirstCell } from 'helpers/e2e/navigateToDoc.js'
import { openListColumns } from 'helpers/e2e/openListColumns.js'
import { openListFilters } from 'helpers/e2e/openListFilters.js'
import { deletePreferences } from 'helpers/e2e/preferences.js'
import { sortColumn } from 'helpers/e2e/sortColumn.js'
import { toggleColumn, waitForColumnInURL } from 'helpers/e2e/toggleColumn.js'
import { openDocDrawer } from 'helpers/e2e/toggleDocDrawer.js'
import { closeListDrawer } from 'helpers/e2e/toggleListDrawer.js'
import path from 'path'
import { wait } from 'payload/shared'
import { fileURLToPath } from 'url'

import type { PayloadTestSDK } from '../../../helpers/sdk/index.js'

import { reorderColumns } from '../../../helpers/e2e/reorderColumns.js'
import { reInitializeDB } from '../../../helpers/reInitializeDB.js'
import { POLL_TOPASS_TIMEOUT, TEST_TIMEOUT_LONG } from '../../../playwright.config.js'

const filename = fileURLToPath(import.meta.url)
const currentFolder = path.dirname(filename)
const dirname = path.resolve(currentFolder, '../../')

describe('List View', () => {
  let page: Page
  let geoUrl: AdminUrlUtil
  let arrayUrl: AdminUrlUtil
  let postsUrl: AdminUrlUtil
  let baseListFiltersUrl: AdminUrlUtil
  let customViewsUrl: AdminUrlUtil
  let with300DocumentsUrl: AdminUrlUtil
  let withListViewUrl: AdminUrlUtil
  let placeholderUrl: AdminUrlUtil
  let disableBulkEditUrl: AdminUrlUtil
  let user: any

  let serverURL: string
  let adminRoutes: ReturnType<typeof getRoutes>

  beforeAll(async ({ browser }, testInfo) => {
    const prebuild = false // Boolean(process.env.CI)

    testInfo.setTimeout(TEST_TIMEOUT_LONG)

    process.env.SEED_IN_CONFIG_ONINIT = 'false' // Makes it so the payload config onInit seed is not run. Otherwise, the seed would be run unnecessarily twice for the initial test run - once for beforeEach and once for onInit
    ;({ payload, serverURL } = await initPayloadE2ENoConfig<Config>({
      dirname,
      prebuild,
    }))

    geoUrl = new AdminUrlUtil(serverURL, geoCollectionSlug)
    arrayUrl = new AdminUrlUtil(serverURL, arrayCollectionSlug)
    postsUrl = new AdminUrlUtil(serverURL, postsCollectionSlug)
    with300DocumentsUrl = new AdminUrlUtil(serverURL, with300DocumentsSlug)
    baseListFiltersUrl = new AdminUrlUtil(serverURL, 'base-list-filters')
    customViewsUrl = new AdminUrlUtil(serverURL, customViews1CollectionSlug)
    withListViewUrl = new AdminUrlUtil(serverURL, listDrawerSlug)
    placeholderUrl = new AdminUrlUtil(serverURL, placeholderCollectionSlug)
    disableBulkEditUrl = new AdminUrlUtil(serverURL, 'disable-bulk-edit')
    const context = await browser.newContext()
    page = await context.newPage()
    initPageConsoleErrorCatch(page)

    await ensureCompilationIsDone({ customAdminRoutes, page, serverURL })

    adminRoutes = getRoutes({ customAdminRoutes })

    user = await payload.login({
      collection: 'users',
      data: {
        email: devUser.email,
        password: devUser.password,
      },
    })
  })

  beforeEach(async () => {
    await reInitializeDB({
      serverURL,
      snapshotKey: 'adminTests',
    })

    await ensureCompilationIsDone({ customAdminRoutes, page, serverURL })

    // delete all posts created by the seed
    await deleteAllPosts()
    await page.goto(postsUrl.list)
    await expect(page.locator(tableRowLocator)).toBeHidden()

    await createPost({ title: 'post1' })
    await createPost({ title: 'post2' })
    await page.reload()
    await expect(page.locator(tableRowLocator)).toHaveCount(2)
  })

  const tableRowLocator = 'table > tbody > tr'

  describe('list view descriptions', () => {
    test('should render static collection descriptions', async () => {
      await page.goto(postsUrl.list)
      await expect(
        page.locator('.custom-view-description', {
          hasText: exactText('This is a custom collection description.'),
        }),
      ).toBeVisible()
    })

    test('should render dynamic collection description components', async () => {
      await page.goto(customViewsUrl.list)
      await expect(
        page.locator('.custom-view-description', {
          hasText: exactText('This is a custom view description component.'),
        }),
      ).toBeVisible()
    })
  })

  describe('list view table', () => {
    test('should link second cell', async () => {
      const { id } = await createPost()
      await page.reload()
      const linkCell = page.locator(`${tableRowLocator} td`).nth(1).locator('a')

      await expect(linkCell).toHaveAttribute(
        'href',
        `${adminRoutes.routes?.admin}/collections/posts/${id}`,
      )

      await page.locator('.list-controls__toggle-columns').click()
      await expect(page.locator('.list-controls__columns.rah-static--height-auto')).toBeVisible()

      await page
        .locator('.pill-selector .pill-selector__pill', {
          hasText: exactText('ID'),
        })
        .click()

      await page.locator('#heading-id').waitFor({ state: 'detached' })
      await page.locator('.cell-id').first().waitFor({ state: 'detached' })

      await expect(linkCell).toHaveAttribute(
        'href',
        `${adminRoutes.routes?.admin}/collections/posts/${id}`,
      )
    })

    test('should hide create new button when allowCreate is false', async () => {
      await page.goto(withListViewUrl.list)

      const drawerButton = page.locator('button', { hasText: 'Select Posts' })
      await expect(drawerButton).toBeVisible()
      await drawerButton.click()

      const drawer = page.locator('.drawer__content')
      await expect(drawer).toBeVisible()

      const createButton = page.locator('button', { hasText: 'Create New' })
      await expect(createButton).toBeHidden()
    })
  })

  describe('list view custom components', () => {
    test('should render custom beforeList component', async () => {
      await page.goto(postsUrl.list)
      await expect(
        page.locator('.collection-list--posts').locator('div', {
          hasText: exactText('BeforeList custom component'),
        }),
      ).toBeVisible()
    })

    test('should render custom beforeListTable component', async () => {
      await page.goto(postsUrl.list)
      await expect(
        page.locator('.collection-list__wrap').locator('div', {
          hasText: exactText('BeforeListTable custom component'),
        }),
      ).toBeVisible()
    })

    test('should render custom Cell component in table', async () => {
      await page.goto(postsUrl.list)
      await expect(
        page
          .locator(`${tableRowLocator} td.cell-demoUIField`)
          .first()
          .locator('p', {
            hasText: exactText('Demo UI Field Cell'),
          }),
      ).toBeVisible()
    })

    test('should render custom afterList component', async () => {
      await page.goto(postsUrl.list)
      await expect(
        page.locator('.collection-list__wrap').locator('div', {
          hasText: exactText('AfterListTable custom component'),
        }),
      ).toBeVisible()
    })

    test('should render custom listMenuItems component', async () => {
      await page.goto(postsUrl.list)
      const kebabMenu = page.locator('.list-controls__popup')
      await expect(kebabMenu).toBeVisible()
      await kebabMenu.click()

      await expect(
        page.locator('.popup-button-list').locator('div', {
          hasText: 'listMenuItems',
        }),
      ).toBeVisible()
    })

    test('should render custom afterListTable component', async () => {
      await page.goto(postsUrl.list)
      await expect(
        page.locator('.collection-list--posts').locator('div', {
          hasText: exactText('AfterList custom component'),
        }),
      ).toBeVisible()
    })
  })

  describe('search', () => {
    test('should prefill search input from query param', async () => {
      await createPost({ title: 'dennis' })
      await createPost({ title: 'charlie' })

      // prefill search with "a" from the query param
      await page.goto(`${postsUrl.list}?search=dennis`)

      // input should be filled out, list should filter
      await expect(page.locator('.search-filter__input')).toHaveValue('dennis')
      await expect(page.locator(tableRowLocator)).toHaveCount(1)
    })

    test('should search by id with listSearchableFields', async () => {
      const { id } = await createPost()
      const url = `${postsUrl.list}?limit=10&page=1&search=${id}`
      await page.goto(url)
      const tableItems = page.locator(tableRowLocator)
      await expect(tableItems).toHaveCount(1)
    })

    test('should search by id without listSearchableFields', async () => {
      const { id } = await createGeo()
      const url = `${geoUrl.list}?limit=10&page=1&search=${id}`
      await page.goto(url)
      const tableItems = page.locator(tableRowLocator)
      await expect(tableItems).toHaveCount(1)
    })

    test('should search by title or description', async () => {
      await createPost({
        description: 'this is fun',
        title: 'find me',
      })

      await page.locator('.search-filter__input').fill('find me')
      await expect(page.locator(tableRowLocator)).toHaveCount(1)

      await page.locator('.search-filter__input').fill('this is fun')
      await expect(page.locator(tableRowLocator)).toHaveCount(1)
    })

    test('search should persist through browser back button', async () => {
      const url = `${postsUrl.list}?limit=10&page=1&search=post1`
      await page.goto(url)
      await expect(page.locator('#search-filter-input')).toHaveValue('post1')
      await goToFirstCell(page, postsUrl)
      await page.goBack()
      await wait(1000) // wait one second to ensure that the new view does not accidentally reset the search
      await page.waitForURL(url)
    })

    test('search should not persist between navigation', async () => {
      const url = `${postsUrl.list}?limit=10&page=1&search=test`
      await page.goto(url)

      await expect(page.locator('#search-filter-input')).toHaveValue('test')

      await page.locator('.nav-toggler.template-default__nav-toggler').click()
      await expect(page.locator('#nav-uploads')).toContainText('Uploads')

      const uploadsUrl = await page.locator('#nav-uploads').getAttribute('href')
      await page.goto(serverURL + uploadsUrl)

      await expect(page.locator('#search-filter-input')).toHaveValue('')
    })
  })

  describe('filters', () => {
    test('should not close where builder when clearing final condition', async () => {
      await page.goto(postsUrl.list)

      await addListFilter({
        page,
        fieldLabel: 'Relationship',
        operatorLabel: 'equals',
        value: 'post1',
      })

      const encodedQueryString =
        '&' + encodeURIComponent('where[or][0][and][0][relationship][equals]') + '='

      await page.waitForURL(new RegExp(encodedQueryString + '[^&]*'))

      await page.locator('.condition__actions .btn.condition__actions-remove').click()

      await page.waitForURL(new RegExp(encodedQueryString))

      await expect(
        page.locator('.list-controls__where.rah-static.rah-static--height-auto'),
      ).toBeVisible()
    })

    test('should respect base list filters', async () => {
      await page.goto(baseListFiltersUrl.list)
      await expect(page.locator(tableRowLocator)).toHaveCount(1)
    })

    test('should filter rows', async () => {
      // open the column controls
      await page.locator('.list-controls__toggle-columns').click()

      // wait until the column toggle UI is visible and fully expanded
      await expect(page.locator('.pill-selector')).toBeVisible()
      await expect(page.locator('table > thead > tr > th:nth-child(2)')).toHaveText('ID')

      // ensure the ID column is active
      const idButton = page.locator('.pill-selector .pill-selector__pill', {
        hasText: exactText('ID'),
      })

      const id = (await page.locator('.cell-id').first().innerText()).replace('ID: ', '')

      const buttonClasses = await idButton.getAttribute('class')

      if (buttonClasses && !buttonClasses.includes('pill-selector__pill--selected')) {
        await idButton.click()
        await expect(page.locator(tableRowLocator).first().locator('.cell-id')).toBeVisible()
      }

      await expect(page.locator(tableRowLocator)).toHaveCount(2)

      await addListFilter({
        page,
        fieldLabel: 'ID',
        operatorLabel: 'equals',
        value: id,
      })

      const tableRows = page.locator(tableRowLocator)

      await expect(tableRows).toHaveCount(1)
      const firstId = page.locator(tableRowLocator).first().locator('.cell-id')
      await expect(firstId).toHaveText(`ID: ${id}`)

      await page.locator('.condition__actions-remove').click()
      await expect(page.locator(tableRowLocator)).toHaveCount(2)
    })

    test('should search for nested fields in field dropdown', async () => {
      await page.goto(postsUrl.list)

      await openListFilters(page, {})

      const whereBuilder = page.locator('.where-builder')
      await whereBuilder.locator('.where-builder__add-first-filter').click()
      const conditionField = whereBuilder.locator('.condition__field')
      await conditionField.click()
      await conditionField.locator('input.rs__input').fill('Tab 1 > Title')

      await expect(
        conditionField.locator('.rs__menu-list').locator('div', {
          hasText: exactText('Tab 1 > Title'),
        }),
      ).toBeVisible()
    })

    test('should allow to filter in array field', async () => {
      await createArray()

      await page.goto(arrayUrl.list)
      await expect(page.locator(tableRowLocator)).toHaveCount(1)

      await addListFilter({
        page,
        fieldLabel: 'Array > Text',
        operatorLabel: 'equals',
        value: 'test',
      })

      await expect(page.locator(tableRowLocator)).toHaveCount(1)

      await page.locator('.condition__actions .btn.condition__actions-remove').click()
      await addListFilter({
        page,
        fieldLabel: 'Array > Text',
        operatorLabel: 'equals',
        value: 'not-matching',
      })

      await expect(page.locator(tableRowLocator)).toHaveCount(0)
    })

    test('should reset filter value when a different field is selected', async () => {
      const id = (await page.locator('.cell-id').first().innerText()).replace('ID: ', '')

      const { whereBuilder } = await addListFilter({
        page,
        fieldLabel: 'ID',
        operatorLabel: 'equals',
        value: id,
      })

      const filterField = whereBuilder.locator('.condition__field')
      await filterField.click()

      // select new filter field of Number
      const dropdownFieldOption = filterField.locator('.rs__option', {
        hasText: exactText('Status'),
      })

      await dropdownFieldOption.click()
      await expect(filterField).toContainText('Status')

      await expect(whereBuilder.locator('.condition__value input')).toHaveValue('')
    })

    test('should remove condition from URL when value is cleared', async () => {
      await page.goto(postsUrl.list)

      const { whereBuilder } = await addListFilter({
        page,
        fieldLabel: 'Relationship',
        operatorLabel: 'equals',
        value: 'post1',
      })

      const encodedQueryString =
        '&' + encodeURIComponent('where[or][0][and][0][relationship][equals]') + '='

      await page.waitForURL(new RegExp(encodedQueryString + '[^&]*'))

      await whereBuilder.locator('.condition__value .clear-indicator').click()

      await page.waitForURL(new RegExp(encodedQueryString))
      expect(true).toBe(true)
    })

    test('should refresh relationship values when a different field is selected', async () => {
      await page.goto(postsUrl.list)

      const { whereBuilder } = await addListFilter({
        page,
        fieldLabel: 'Relationship',
        operatorLabel: 'equals',
        value: 'post1',
      })

      const conditionField = whereBuilder.locator('.condition__field')
      await conditionField.click()

      await conditionField
        .locator('.rs__option', {
          hasText: exactText('Users'),
        })
        ?.click()

      await expect(whereBuilder.locator('.condition__field')).toContainText('Users')

      const operatorInput = whereBuilder.locator('.condition__operator')
      await operatorInput.click()
      const operatorOptions = operatorInput.locator('.rs__option')
      await operatorOptions.locator(`text=equals`).click()

      await whereBuilder.locator('.condition__value').click()

      const valueOptions = await whereBuilder
        .locator('.condition__value .rs__option')
        .evaluateAll((options) => options.map((option) => option.textContent))

      expect(valueOptions).not.toContain('post1')
    })

    test('should accept where query from valid URL where parameter', async () => {
      // delete all posts created by the seed
      await deleteAllPosts()
      await page.goto(postsUrl.list)
      await expect(page.locator(tableRowLocator)).toBeHidden()

      await createPost({ title: 'post1' })
      await createPost({ title: 'post2' })
      await page.goto(postsUrl.list)
      await expect(page.locator(tableRowLocator)).toHaveCount(2)

      await page.goto(`${postsUrl.list}?limit=10&page=1&where[or][0][and][0][title][equals]=post1`)

      await expect(page.locator('.react-select--single-value').first()).toContainText('Title')
      await expect(page.locator(tableRowLocator)).toHaveCount(1)
    })

    test('should accept transformed where query from invalid URL where parameter', async () => {
      // delete all posts created by the seed
      await deleteAllPosts()
      await page.goto(postsUrl.list)
      await expect(page.locator(tableRowLocator)).toBeHidden()

      await createPost({ title: 'post1' })
      await createPost({ title: 'post2' })
      await page.goto(postsUrl.list)
      await expect(page.locator(tableRowLocator)).toHaveCount(2)

      // [title][equals]=post1 should be getting transformed into a valid where[or][0][and][0][title][equals]=post1
      await page.goto(`${postsUrl.list}?limit=10&page=1&where[title][equals]=post1`)

      await expect(page.locator('.react-select--single-value').first()).toContainText('Title')
      await expect(page.locator(tableRowLocator)).toHaveCount(1)
    })

    test('should accept where query from complex, valid URL where parameter using the near operator', async () => {
      // We have one point collection with the point [5,-5] and one with [7,-7]. This where query should kick out the [5,-5] point
      await page.goto(
        `${
          new AdminUrlUtil(serverURL, 'geo').list
        }?limit=10&page=1&where[or][0][and][0][point][near]=6,-7,200000`,
      )

      await expect(page.getByPlaceholder('Enter a value')).toHaveValue('6,-7,200000')
      await expect(page.locator(tableRowLocator)).toHaveCount(1)
    })

    test('should accept transformed where query from complex, invalid URL where parameter using the near operator', async () => {
      // We have one point collection with the point [5,-5] and one with [7,-7]. This where query should kick out the [5,-5] point
      await page.goto(
        `${new AdminUrlUtil(serverURL, 'geo').list}?limit=10&page=1&where[point][near]=6,-7,200000`,
      )

      await expect(page.getByPlaceholder('Enter a value')).toHaveValue('6,-7,200000')
      await expect(page.locator(tableRowLocator)).toHaveCount(1)
    })

    test('should accept where query from complex, valid URL where parameter using the within operator', async () => {
      type Point = [number, number]
      const polygon: Point[] = [
        [3.5, -3.5], // bottom-left
        [3.5, -6.5], // top-left
        [6.5, -6.5], // top-right
        [6.5, -3.5], // bottom-right
        [3.5, -3.5], // back to starting point to close the polygon
      ]

      const whereQueryJSON = {
        point: {
          within: {
            type: 'Polygon',
            coordinates: [polygon],
          },
        },
      }

      const whereQuery = qs.stringify(
        {
          ...{ where: whereQueryJSON },
        },
        {
          addQueryPrefix: false,
        },
      )

      // We have one point collection with the point [5,-5] and one with [7,-7]. This where query should kick out the [7,-7] point, as it's not within the polygon
      await page.goto(`${new AdminUrlUtil(serverURL, 'geo').list}?limit=10&page=1&${whereQuery}`)

      await expect(page.getByPlaceholder('Enter a value')).toHaveValue('[object Object]')
      await expect(page.locator(tableRowLocator)).toHaveCount(1)
    })

    test('should reset page when filters are applied', async () => {
      await deleteAllPosts()

      await Promise.all(
        Array.from({ length: 6 }, async (_, i) => {
          if (i < 3) {
            await createPost()
          } else {
            await createPost({ title: 'test' })
          }
        }),
      )

      await page.reload()

      const tableItems = page.locator(tableRowLocator)

      await expect(tableItems).toHaveCount(5)
      await expect(page.locator('.page-controls__page-info')).toHaveText('1-5 of 6')
      await expect(page.locator('.per-page')).toContainText('Per Page: 5')
      await page.goto(`${postsUrl.list}?limit=5&page=2`)

      await addListFilter({
        page,
        fieldLabel: 'Tab 1 > Title',
        operatorLabel: 'equals',
        value: 'test',
      })

      await page.waitForURL(new RegExp(`${postsUrl.list}\\?limit=5&page=1`))
      await expect(page.locator('.page-controls__page-info')).toHaveText('1-3 of 3')
    })

    test('should reset filter values for every additional filter', async () => {
      await page.goto(postsUrl.list)

      const { whereBuilder } = await addListFilter({
        page,
        fieldLabel: 'Tab 1 > Title',
        operatorLabel: 'equals',
        value: 'Test',
      })

      await whereBuilder.locator('.condition__actions-add').click()
      const secondLi = whereBuilder.locator('.where-builder__and-filters li:nth-child(2)')
      await expect(secondLi).toBeVisible()

      await expect(
        secondLi.locator('.condition__field').locator('.rs__single-value'),
      ).toContainText('Tab 1 > Title')

      await expect(secondLi.locator('.condition__operator >> input')).toHaveValue('')
      await expect(secondLi.locator('.condition__value >> input')).toHaveValue('')
    })

    test('should not re-render page upon typing in a value in the filter value field', async () => {
      await page.goto(postsUrl.list)

      const { whereBuilder } = await addListFilter({
        page,
        fieldLabel: 'Tab 1 > Title',
        operatorLabel: 'equals',
        skipValueInput: true,
      })

      const valueInput = whereBuilder.locator('.condition__value >> input')

      // Type into the input field instead of filling it
      await valueInput.click()
      await valueInput.type('Test', { delay: 100 }) // Add a delay to simulate typing speed

      // Wait for a short period to see if the input loses focus
      await page.waitForTimeout(500)

      // Check if the input still has the correct value
      await expect(valueInput).toHaveValue('Test')
    })

    test('should still show second filter if two filters exist and first filter is removed', async () => {
      await page.goto(postsUrl.list)

      const { whereBuilder } = await addListFilter({
        page,
        fieldLabel: 'Tab 1 > Title',
        operatorLabel: 'equals',
        value: 'Test 1',
      })

      await wait(500)

      await whereBuilder.locator('.condition__actions-add').click()

      const secondLi = whereBuilder.locator('.where-builder__and-filters li:nth-child(2)')
      await expect(secondLi).toBeVisible()
      const secondConditionField = secondLi.locator('.condition__field')
      const secondOperatorField = secondLi.locator('.condition__operator')
      const secondValueField = secondLi.locator('.condition__value >> input')
      await secondConditionField.click()

      await secondConditionField
        .locator('.rs__option', { hasText: exactText('Tab 1 > Title') })
        .click()

      await expect(secondConditionField.locator('.rs__single-value')).toContainText('Tab 1 > Title')
      await secondOperatorField.click()
      await secondOperatorField.locator('.rs__option').locator('text=equals').click()
      await secondValueField.fill('Test 2')
      await expect(secondValueField).toHaveValue('Test 2')

      const firstLi = page.locator('.where-builder__and-filters li:nth-child(1)')
      const removeButton = firstLi.locator('.condition__actions-remove')

      await wait(500)

      // remove first filter
      await removeButton.click()
      const filterListItems = page.locator('.where-builder__and-filters li')
      await expect(filterListItems).toHaveCount(1)
      const firstValueField = page.locator('.condition__value >> input')
      await expect(firstValueField).toHaveValue('Test 2')
    })

    test('should hide field filter when admin.disableListFilter is true', async () => {
      await page.goto(postsUrl.list)
      await openListFilters(page, {})
      await page.locator('.where-builder__add-first-filter').click()

      const initialField = page.locator('.condition__field')
      await initialField.click()

      await expect(
        initialField.locator(`.rs__option :has-text("Disable List Filter Text")`),
      ).toBeHidden()
    })

    test('should simply disable field filter when admin.disableListFilter is true but still exists in the query', async () => {
      await page.goto(
        `${postsUrl.list}${qs.stringify(
          {
            where: {
              or: [
                {
                  and: [
                    {
                      disableListFilterText: {
                        equals: 'Disable List Filter Text',
                      },
                    },
                  ],
                },
              ],
            },
          },
          { addQueryPrefix: true },
        )}`,
      )

      await openListFilters(page, {})

      const condition = page.locator('.condition__field')
      await expect(condition.locator('input.rs__input')).toBeDisabled()
      await expect(page.locator('.condition__operator input.rs__input')).toBeDisabled()
      await expect(page.locator('.condition__value input.condition-value-text')).toBeDisabled()
      await expect(condition.locator('.rs__single-value')).toHaveText('Disable List Filter Text')
      await page.locator('button.condition__actions-add').click()
      const condition2 = page.locator('.condition__field').nth(1)
      await condition2.click()
      await expect(
        condition2?.locator('.rs__menu-list:has-text("Disable List Filter Text")'),
      ).toBeHidden()
    })

    test('should show no results when queryin on a field a user cannot read', async () => {
      await payload.create({
        collection: postsCollectionSlug,
        data: {
          noReadAccessField: 'test',
        },
      })

      await page.goto(postsUrl.list)

      const { whereBuilder } = await addListFilter({
        page,
        fieldLabel: 'No Read Access Field',
        operatorLabel: 'equals',
        value: 'test',
      })

      await expect(whereBuilder.locator('.condition__value input')).toBeVisible()
      await expect(page.locator('.collection-list__no-results')).toBeVisible()
    })

    test('should properly paginate many documents', async () => {
      await page.goto(with300DocumentsUrl.list)

      const { whereBuilder } = await addListFilter({
        page,
        fieldLabel: 'Self Relation',
        operatorLabel: 'equals',
        skipValueInput: true,
      })

      const valueField = whereBuilder.locator('.condition__value')
      await valueField.click()
      await page.keyboard.type('4')

      const options = whereBuilder.locator('.condition__value .rs__option')

      await expect(options).toHaveCount(10)

      for (const option of await options.all()) {
        expect(await option.innerText()).toContain('4')
      }

      await page.keyboard.press('Backspace')
      await page.keyboard.type('5')
      await expect(options).toHaveCount(10)

      for (const option of await options.all()) {
        expect(await option.innerText()).toContain('5')
      }

      await options.first().hover()

      // three times because react-select is not very reliable
      await page.mouse.wheel(0, 50)
      await page.mouse.wheel(0, 50)
      await page.mouse.wheel(0, 50)
      await expect(options).toHaveCount(20)
    })
  })

  describe('table columns', () => {
    test('should hide field column when field.hidden is true', async () => {
      await page.goto(postsUrl.list)
      await page.locator('.list-controls__toggle-columns').click()

      await expect(page.locator('.pill-selector')).toBeVisible()

      await expect(
        page.locator(`.pill-selector .pill-selector__pill`, {
          hasText: exactText('Hidden Field'),
        }),
      ).toBeHidden()
    })

    test('should show field column despite admin.hidden being true', async () => {
      await page.goto(postsUrl.list)
      await page.locator('.list-controls__toggle-columns').click()

      await expect(page.locator('.pill-selector')).toBeVisible()

      await expect(
        page.locator(`.pill-selector .pill-selector__pill`, {
          hasText: exactText('Admin Hidden Field'),
        }),
      ).toBeVisible()
    })

    test('should hide field in column selector when admin.disableListColumn is true', async () => {
      await page.goto(postsUrl.list)
      await page.locator('.list-controls__toggle-columns').click()

      await expect(page.locator('.pill-selector')).toBeVisible()

      // Check if "Disable List Column Text" is not present in the column options
      await expect(
        page.locator(`.pill-selector .pill-selector__pill`, {
          hasText: exactText('Disable List Column Text'),
        }),
      ).toBeHidden()
    })

    test('should display field in column selector despite admin.disableListFilter', async () => {
      await page.goto(postsUrl.list)
      await page.locator('.list-controls__toggle-columns').click()

      await expect(page.locator('.pill-selector')).toBeVisible()

      // Check if "Disable List Filter Text" is present in the column options
      await expect(
        page.locator(`.pill-selector .pill-selector__pill`, {
          hasText: exactText('Disable List Filter Text'),
        }),
      ).toBeVisible()
    })

    test('should still show field in filter when admin.disableListColumn is true', async () => {
      await page.goto(postsUrl.list)
      await openListFilters(page, {})
      await page.locator('.where-builder__add-first-filter').click()

      const initialField = page.locator('.condition__field')
      await initialField.click()

      await expect(
        initialField.locator(`.rs__menu-list:has-text("Disable List Column Text")`),
      ).toBeVisible()
    })

    test('should toggle columns and effect table', async () => {
      const tableHeaders = 'table > thead > tr > th'

      await openListColumns(page, {})
      const numberOfColumns = await page.locator(tableHeaders).count()
      await expect(page.locator('.pill-selector')).toBeVisible()
      await expect(page.locator('table > thead > tr > th:nth-child(2)')).toHaveText('ID')

      await toggleColumn(page, { columnLabel: 'ID', columnName: 'id', targetState: 'off' })

      await page.locator('#heading-id').waitFor({ state: 'detached' })
      await page.locator('.cell-id').first().waitFor({ state: 'detached' })
      await expect(page.locator(tableHeaders)).toHaveCount(numberOfColumns - 1)
      await expect(page.locator('table > thead > tr > th:nth-child(2)')).toHaveText('Number')

      await toggleColumn(page, { columnLabel: 'ID', columnName: 'id', targetState: 'on' })

      await expect(page.locator('.cell-id').first()).toBeVisible()
      await expect(page.locator(tableHeaders)).toHaveCount(numberOfColumns)
      await expect(page.locator('table > thead > tr > th:nth-child(2)')).toHaveText('ID')

      await toggleColumn(page, { columnLabel: 'ID', columnName: 'id', targetState: 'off' })
    })

    test('should toggle columns and save to preferences', async () => {
      const tableHeaders = 'table > thead > tr > th'
      const numberOfColumns = await page.locator(tableHeaders).count()

      await toggleColumn(page, { columnLabel: 'ID', columnName: 'id', targetState: 'off' })

      await page.reload()

      await expect(page.locator('#heading-id')).toBeHidden()
      await expect(page.locator('.cell-id').first()).toBeHidden()
      await expect(page.locator(tableHeaders)).toHaveCount(numberOfColumns - 1)
      await expect(page.locator('table > thead > tr > th:nth-child(2)')).toHaveText('Number')
    })

    test('should inject preferred columns into URL search params on load', async () => {
      await toggleColumn(page, { columnLabel: 'ID', columnName: 'id', targetState: 'off' })

      // reload to ensure the columns were stored and loaded from preferences
      await page.reload()

      // The `columns` search params _should_ contain "-id"
      await waitForColumnInURL({ page, columnName: 'id', state: 'off' })

      expect(true).toBe(true)
    })

    test('should not inject default columns into URL search params on load', async () => {
      // clear preferences first, ensure that they don't automatically populate in the URL on load
      await deletePreferences({
        payload,
        key: `${postsCollectionSlug}.list`,
        user,
      })

      // wait for the URL search params to populate
      await page.waitForURL(/posts\?/)

      // The `columns` search params should _not_ appear in the URL
      expect(page.url()).not.toMatch(/columns=/)
    })

    test('should render nested field in named group as separate column', async () => {
      await createPost({ namedGroup: { someTextField: 'nested group text field' } })
      await page.goto(postsUrl.list)
      await openColumnControls(page)
      await page
        .locator('.pill-selector .pill-selector__pill', {
          hasText: exactText('Named Group > Some Text Field'),
        })
        .click()
      await expect(page.locator('.row-1 .cell-namedGroup__someTextField')).toHaveText(
        'nested group text field',
      )
    })

    test('should render nested field in unnamed group as separate column', async () => {
      await createPost({ textFieldInUnnamedGroup: 'nested text in unnamed group' })
      await page.goto(postsUrl.list)
      await openColumnControls(page)
      await page
        .locator('.pill-selector .pill-selector__pill', {
          hasText: exactText('Text Field In Unnamed Group'),
        })
        .click()
      await expect(page.locator('.row-1 .cell-textFieldInUnnamedGroup')).toHaveText(
        'nested text in unnamed group',
      )
    })

    test('should not render group field as top level column when custom cell is not defined', async () => {
      await createPost({ namedGroup: { someTextField: 'nested group text field' } })
      await page.goto(postsUrl.list)
      await openColumnControls(page)
      await expect(
        page.locator('.pill-selector .pill-selector__pill', {
          hasText: exactText('Named Group'),
        }),
      ).toBeHidden()
    })

    test('should render group field as top level column when custom cell is defined', async () => {
      await createPost({
        groupWithCustomCell: {
          nestedTextFieldInGroupWithCustomCell: 'nested group text field in group with custom cell',
        },
      })
      await page.goto(postsUrl.list)
      await openColumnControls(page)
      await expect(
        page.locator('.pill-selector .pill-selector__pill', {
          hasText: exactText('Group With Custom Cell'),
        }),
      ).toBeVisible()
    })

    test('should render top-level field and group field with same name in separate columns', async () => {
      await createPost({
        someTextField: 'top-level text field',
        namedGroup: { someTextField: 'nested group text field' },
      })

      await page.goto(postsUrl.list)
      await openColumnControls(page)

      // Enable top-level column
      await page
        .locator('.pill-selector .pill-selector__pill', {
          hasText: exactText('Some Text Field'),
        })
        .click()

      // Enable group column
      await page
        .locator('.pill-selector .pill-selector__pill', {
          hasText: exactText('Named Group > Some Text Field'),
        })
        .click()

      // Expect top-level cell
      await expect(page.locator('.row-1 .cell-someTextField')).toHaveText('top-level text field')

      // Expect nested group cell
      await expect(page.locator('.row-1 .cell-namedGroup__someTextField')).toHaveText(
        'nested group text field',
      )
    })

    test('should render nested field in named tab as separate column', async () => {
      await createPost({ namedTab: { nestedTextFieldInNamedTab: 'nested text in named tab' } })
      await page.goto(postsUrl.list)
      await openColumnControls(page)
      await page
        .locator('.pill-selector .pill-selector__pill', {
          hasText: exactText('Named Tab > Nested Text Field In Named Tab'),
        })
        .click()
      await expect(page.locator('.row-1 .cell-namedTab__nestedTextFieldInNamedTab')).toHaveText(
        'nested text in named tab',
      )
    })

    test('should render nested field in unnamed tab as separate column', async () => {
      await createPost({ nestedTextFieldInUnnamedTab: 'nested text in unnamed tab' })
      await page.goto(postsUrl.list)
      await openColumnControls(page)
      await page
        .locator('.pill-selector .pill-selector__pill', {
          hasText: exactText('Nested Text Field In Unnamed Tab'),
        })
        .click()
      await expect(page.locator('.row-1 .cell-nestedTextFieldInUnnamedTab')).toHaveText(
        'nested text in unnamed tab',
      )
    })

    test('should drag to reorder columns and save to preferences', async () => {
      await reorderColumns(page, { fromColumn: 'Number', toColumn: 'ID' })

      // reload to ensure the columns were stored and loaded from preferences
      await page.reload()

      await expect(
        page.locator('.list-controls .pill-selector .pill-selector__pill').first(),
      ).toHaveText('Number')

      await expect(page.locator('table thead tr th').nth(1)).toHaveText('Number')
    })

    test('should render list drawer columns in proper order', async () => {
      await reorderColumns(page, { fromColumn: 'Number', toColumn: 'ID' })

      await page.reload()

      await page.goto(postsUrl.create)
      await openDocDrawer({ page, selector: '.rich-text .list-drawer__toggler' })
      const listDrawer = page.locator('[id^=list-drawer_1_]')
      await expect(listDrawer).toBeVisible()

      const collectionSelector = page.locator(
        '[id^=list-drawer_1_] .list-header__select-collection.react-select',
      )

      // select the "Post" collection
      await collectionSelector.click()

      await page
        .locator('[id^=list-drawer_1_] .list-header__select-collection.react-select .rs__option', {
          hasText: exactText('Post'),
        })
        .click()

      await openListColumns(page, {
        columnContainerSelector: '.list-controls__columns',
        togglerSelector: '[id^=list-drawer_1_] .list-controls__toggle-columns',
      })

      // ensure that the columns are in the correct order
      await expect(
        page
          .locator('[id^=list-drawer_1_] .list-controls .pill-selector .pill-selector__pill')
          .first(),
      ).toHaveText('Number')
    })

    test('should toggle columns in list drawer', async () => {
      await page.goto(postsUrl.create)

      // Open the drawer
      await openDocDrawer({ page, selector: '.rich-text .list-drawer__toggler' })
      const listDrawer = page.locator('[id^=list-drawer_1_]')
      await expect(listDrawer).toBeVisible()

      await openListColumns(page, {
        columnContainerSelector: '.list-controls__columns',
        togglerSelector: '[id^=list-drawer_1_] .list-controls__toggle-columns',
      })

      await toggleColumn(page, {
        togglerSelector: '[id^=list-drawer_1_] .list-controls__toggle-columns',
        columnContainerSelector: '.list-controls__columns',
        columnLabel: 'ID',
        targetState: 'off',
        expectURLChange: false,
      })

      await closeListDrawer({ page })

      await openDocDrawer({ page, selector: '.rich-text .list-drawer__toggler' })

      await openListColumns(page, {
        columnContainerSelector: '.list-controls__columns',
        togglerSelector: '[id^=list-drawer_1_] .list-controls__toggle-columns',
      })

      const columnContainer = page.locator('.list-controls__columns').first()

      const column = columnContainer.locator(`.pill-selector .pill-selector__pill`, {
        hasText: exactText('ID'),
      })

      await expect(column).not.toHaveClass(/pill-selector__pill--selected/)
    })

    test('should retain preferences when changing drawer collections', async () => {
      await page.goto(postsUrl.create)

      // Open the drawer
      await openDocDrawer({ page, selector: '.rich-text .list-drawer__toggler' })
      const listDrawer = page.locator('[id^=list-drawer_1_]')
      await expect(listDrawer).toBeVisible()

      await openListColumns(page, {
        columnContainerSelector: '.list-controls__columns',
        togglerSelector: '[id^=list-drawer_1_] .list-controls__toggle-columns',
      })

      const collectionSelector = page.locator(
        '[id^=list-drawer_1_] .list-header__select-collection.react-select',
      )

      // wait until the column toggle UI is visible and fully expanded
      await expect(page.locator('.list-controls__columns.rah-static--height-auto')).toBeVisible()

      // deselect the "id" column
      await toggleColumn(page, {
        togglerSelector: '[id^=list-drawer_1_] .list-controls__toggle-columns',
        columnContainerSelector: '.list-controls__columns',
        columnLabel: 'ID',
        targetState: 'off',
        expectURLChange: false,
      })

      // select the "Post" collection
      await collectionSelector.click()

      await page
        .locator('[id^=list-drawer_1_] .list-header__select-collection.react-select .rs__option', {
          hasText: exactText('Post'),
        })
        .click()

      await toggleColumn(page, {
        togglerSelector: '[id^=list-drawer_1_] .list-controls__toggle-columns',
        columnContainerSelector: '.list-controls__columns',
        columnLabel: 'Number',
        targetState: 'off',
        expectURLChange: false,
      })

      // select the "User" collection again
      await collectionSelector.click()

      await page
        .locator('[id^=list-drawer_1_] .list-header__select-collection.react-select .rs__option', {
          hasText: exactText('User'),
        })
        .click()

      // ensure that the "id" column is still deselected
      await expect(
        page
          .locator('[id^=list-drawer_1_] .list-controls .pill-selector .pill-selector__pill')
          .first(),
      ).not.toHaveClass('pill-selector__pill--selected')

      // select the "Post" collection again
      await collectionSelector.click()

      await page
        .locator('[id^=list-drawer_1_] .list-header__select-collection.react-select .rs__option', {
          hasText: exactText('Post'),
        })
        .click()

      // ensure that the "number" column is still deselected
      await expect(
        page
          .locator('[id^=list-drawer_1_] .list-controls .pill-selector .pill-selector__pill')
          .first(),
      ).not.toHaveClass('pill-selector__pill--selected')
    })

    test('should render custom table cell component', async () => {
      await createPost()
      await page.goto(postsUrl.list)
      await expect(
        page.locator('table > thead > tr > th', {
          hasText: exactText('Demo UI Field'),
        }),
      ).toBeVisible()
    })

    test('should reset default columns', async () => {
      await page.goto(postsUrl.list)
      await toggleColumn(page, { columnLabel: 'ID', targetState: 'off', columnName: 'id' })

      // should not have the ID column #heading-id
      await expect(page.locator('#heading-id')).toBeHidden()

      await page.locator('#reset-columns-button').click()

      await expect(page.locator('#heading-id')).toBeVisible()
    })
  })

  describe('multi-select', () => {
    beforeEach(async () => {
      // delete all posts created by the seed
      await deleteAllPosts()

      await createPost()
      await createPost()
      await createPost()
    })

    test('should select multiple rows', async () => {
      await page.reload()
      const selectAll = page.locator('.checkbox-input:has(#select-all)')
      await page.locator('.row-1 .cell-_select input').check()

      const indeterminateSelectAll = selectAll.locator('.checkbox-input__icon.partial')
      expect(indeterminateSelectAll).toBeDefined()

      await selectAll.locator('input').click()
      const emptySelectAll = selectAll.locator('.checkbox-input__icon:not(.check):not(.partial)')
      await expect(emptySelectAll).toHaveCount(0)

      await selectAll.locator('input').click()
      const checkSelectAll = selectAll.locator('.checkbox-input__icon.check')
      expect(checkSelectAll).toBeDefined()
    })

    test('should delete many', async () => {
      await page.goto(postsUrl.list)
      // delete should not appear without selection
      await expect(page.locator('#confirm-delete-many-docs #confirm-action')).toHaveCount(0)
      // select one row
      await page.locator('.row-1 .cell-_select input').check()

      // delete button should be present
      await expect(page.locator('#confirm-delete-many-docs #confirm-action')).toHaveCount(1)

      await page.locator('.row-2 .cell-_select input').check()

      await page.locator('.delete-documents__toggle').click()
      await page.locator('#confirm-delete-many-docs #confirm-action').click()
      await expect(page.locator('.cell-_select')).toHaveCount(1)
    })

    test('should hide edit many from collection with disableBulkEdit: true', async () => {
      await payload.create({ collection: 'disable-bulk-edit', data: {} })
      await page.goto(disableBulkEditUrl.list)

      // select one row
      await page.locator('.row-1 .cell-_select input').check()
      // ensure the edit many button is hidden
      await expect(page.locator('.edit-many button')).toBeHidden()
    })
  })

  describe('pagination', () => {
    test('should use custom admin.pagination.defaultLimit', async () => {
      await deleteAllPosts()

      await mapAsync([...Array(6)], async () => {
        await createPost()
      })

      await page.goto(postsUrl.list)
      await expect(page.locator('.per-page .per-page__base-button')).toContainText('Per Page: 5')
      await expect(page.locator(tableRowLocator)).toHaveCount(5)
    })

    test('should use custom admin.pagination.limits', async () => {
      await deleteAllPosts()

      await mapAsync([...Array(6)], async () => {
        await createPost()
      })

      await page.goto(postsUrl.list)
      await page.locator('.per-page .popup-button').click()
      await page.locator('.per-page .popup-button').click()
      const options = page.locator('.per-page button.per-page__button')
      await expect(options).toHaveCount(3)
      await expect(options.nth(0)).toContainText('5')
      await expect(options.nth(1)).toContainText('10')
      await expect(options.nth(2)).toContainText('15')
    })

    test('should paginate', async () => {
      await deleteAllPosts()

      await mapAsync([...Array(6)], async () => {
        await createPost()
      })

      await page.reload()
      await expect(page.locator(tableRowLocator)).toHaveCount(5)
      await expect(page.locator('.page-controls__page-info')).toHaveText('1-5 of 6')
      await expect(page.locator('.per-page')).toContainText('Per Page: 5')

      await goToNextPage(page)
      await expect(page.locator(tableRowLocator)).toHaveCount(1)

      await goToPreviousPage(page)
      await expect(page.locator(tableRowLocator)).toHaveCount(5)
    })

    test('should paginate without resetting selected limit', async () => {
      await deleteAllPosts()

      await mapAsync([...Array(16)], async () => {
        await createPost()
      })

      await page.reload()
      const tableItems = page.locator(tableRowLocator)
      await expect(tableItems).toHaveCount(5)
      await expect(page.locator('.page-controls__page-info')).toHaveText('1-5 of 16')
      await expect(page.locator('.per-page')).toContainText('Per Page: 5')
      await page.locator('.per-page .popup-button').click()

      await page
        .locator('.per-page button.per-page__button', {
          hasText: '15',
        })
        .click()

      await expect(tableItems).toHaveCount(15)
      await expect(page.locator('.per-page .per-page__base-button')).toContainText('Per Page: 15')

      await goToNextPage(page)
      await expect(tableItems).toHaveCount(1)
      await expect(page.locator('.per-page')).toContainText('Per Page: 15') // ensure this hasn't changed
      await expect(page.locator('.page-controls__page-info')).toHaveText('16-16 of 16')
    })
  })

  // TODO: Troubleshoot flaky suite
  describe('sorting', () => {
    beforeEach(async () => {
      // delete all posts created by the seed
      await deleteAllPosts()
      await createPost({
        number: 1,
        namedGroup: { someTextField: 'nested group text field' },
        namedTab: { nestedTextFieldInNamedTab: 'nested text in named tab' },
      })
      await createPost({ number: 2 })
    })

    test('should sort', async () => {
      await page.reload()

      await sortColumn(page, { fieldPath: 'number', fieldLabel: 'Number', targetState: 'asc' })

      await expect(page.locator('.row-1 .cell-number')).toHaveText('1')
      await expect(page.locator('.row-2 .cell-number')).toHaveText('2')

      await sortColumn(page, { fieldPath: 'number', fieldLabel: 'Number', targetState: 'desc' })

      await expect(page.locator('.row-1 .cell-number')).toHaveText('2')
      await expect(page.locator('.row-2 .cell-number')).toHaveText('1')
    })

    test('should allow sorting by nested field within group in separate column', async () => {
      await page.goto(postsUrl.list)
      await openColumnControls(page)
      await page
        .locator('.pill-selector .pill-selector__pill', {
          hasText: exactText('Named Group > Some Text Field'),
        })
        .click()

      await sortColumn(page, {
        fieldPath: 'namedGroup.someTextField',
        fieldLabel: 'Named Group > Some Text Field',
        targetState: 'asc',
      })

      await expect(page.locator('.row-1 .cell-namedGroup__someTextField')).toHaveText(
        '<No Some Text Field>',
      )

      await expect(page.locator('.row-2 .cell-namedGroup__someTextField')).toHaveText(
        'nested group text field',
      )

      await sortColumn(page, {
        fieldPath: 'namedGroup.someTextField',
        fieldLabel: 'Named Group > Some Text Field',
        targetState: 'desc',
      })

      await expect(page.locator('.row-1 .cell-namedGroup__someTextField')).toHaveText(
        'nested group text field',
      )

      await expect(page.locator('.row-2 .cell-namedGroup__someTextField')).toHaveText(
        '<No Some Text Field>',
      )
    })

    test('should allow sorting by nested field within tab in separate column', async () => {
      await page.goto(postsUrl.list)
      await openColumnControls(page)
      await page
        .locator('.pill-selector .pill-selector__pill', {
          hasText: exactText('Named Tab > Nested Text Field In Named Tab'),
        })
        .click()

      await sortColumn(page, {
        fieldPath: 'namedTab.nestedTextFieldInNamedTab',
        fieldLabel: 'Named Tab > Nested Text Field In Named Tab',
        targetState: 'asc',
      })

      await expect(page.locator('.row-1 .cell-namedTab__nestedTextFieldInNamedTab')).toHaveText(
        '<No Nested Text Field In Named Tab>',
      )

      await expect(page.locator('.row-2 .cell-namedTab__nestedTextFieldInNamedTab')).toHaveText(
        'nested text in named tab',
      )

      await sortColumn(page, {
        fieldPath: 'namedTab.nestedTextFieldInNamedTab',
        fieldLabel: 'Named Tab > Nested Text Field In Named Tab',
        targetState: 'desc',
      })

      await expect(page.locator('.row-1 .cell-namedTab__nestedTextFieldInNamedTab')).toHaveText(
        'nested text in named tab',
      )

      await expect(page.locator('.row-2 .cell-namedTab__nestedTextFieldInNamedTab')).toHaveText(
        '<No Nested Text Field In Named Tab>',
      )
    })

    test('should sort with existing filters', async () => {
      await page.goto(postsUrl.list)

      await toggleColumn(page, { columnLabel: 'ID', targetState: 'off', columnName: 'id' })

      await page.locator('#heading-id').waitFor({ state: 'detached' })
      await page.locator('#heading-title button.sort-column__asc').click()
      await page.waitForURL(/sort=title/)

      const columnAfterSort = page.locator(
        `.list-controls__columns .pill-selector .pill-selector__pill`,
        {
          hasText: exactText('ID'),
        },
      )

      await expect(columnAfterSort).not.toHaveClass('pill-selector__pill--selected')
      await expect(page.locator('#heading-id')).toBeHidden()
      await expect(page.locator('.cell-id')).toHaveCount(0)
    })

    test('should sort without resetting column preferences', async () => {
      await deletePreferences({
        key: `${postsCollectionSlug}.list`,
        payload,
        user,
      })

      await page.goto(postsUrl.list)

      // sort by title
      await page.locator('#heading-title button.sort-column__asc').click()
      await page.waitForURL(/sort=title/)

      // enable a column that is _not_ part of this collection's default columns
      await toggleColumn(page, { columnLabel: 'Status', targetState: 'on', columnName: '_status' })

      await page.locator('#heading-_status').waitFor({ state: 'visible' })

      const columnAfterSort = page.locator(
        `.list-controls__columns .pill-selector .pill-selector__pill`,
        {
          hasText: exactText('Status'),
        },
      )

      await expect(columnAfterSort).toHaveClass(/pill-selector__pill--selected/)
      await expect(page.locator('#heading-_status')).toBeVisible()
      await expect(page.locator('.cell-_status').first()).toBeVisible()

      await toggleColumn(page, {
        columnLabel: 'Wavelengths',
        targetState: 'on',
        columnName: 'wavelengths',
      })

      await toggleColumn(page, {
        columnLabel: 'Select Field',
        targetState: 'on',
        columnName: 'selectField',
      })

      // check that the cells have the classes added per value selected
      await expect(
        page.locator('.cell-_status').first().locator("[class*='selected--']"),
      ).toBeVisible()

      await expect(
        page.locator('.cell-wavelengths').first().locator("[class*='selected--']"),
      ).toBeVisible()

      await expect(
        page.locator('.cell-selectField').first().locator("[class*='selected--']"),
      ).toBeVisible()

      // sort by title again in descending order
      await page.locator('#heading-title button.sort-column__desc').click()
      await page.waitForURL(/sort=-title/)

      // allow time for components to re-render
      await wait(100)

      // ensure the column is still visible
      const columnAfterSecondSort = page.locator(
        `.list-controls__columns .pill-selector .pill-selector__pill`,
        {
          hasText: exactText('Status'),
        },
      )

      await expect(columnAfterSecondSort).toHaveClass(/pill-selector__pill--selected/)
      await expect(page.locator('#heading-_status')).toBeVisible()
      await expect(page.locator('.cell-_status').first()).toBeVisible()
    })
  })

  describe('placeholder', () => {
    test('should display placeholder in filter options', async () => {
      await page.goto(
        `${placeholderUrl.list}${qs.stringify(
          {
            where: {
              or: [
                {
                  and: [
                    {
                      defaultSelect: {
                        equals: '',
                      },
                    },
                    {
                      placeholderSelect: {
                        equals: '',
                      },
                    },
                    {
                      defaultRelationship: {
                        equals: '',
                      },
                    },
                    {
                      placeholderRelationship: {
                        equals: '',
                      },
                    },
                  ],
                },
              ],
            },
          },
          { addQueryPrefix: true },
        )}`,
      )

      const conditionValueSelects = page.locator('#list-controls-where .condition__value')
      await expect(conditionValueSelects.nth(0)).toHaveText('Select a value')
      await expect(conditionValueSelects.nth(1)).toHaveText('Custom placeholder')
      await expect(conditionValueSelects.nth(2)).toHaveText('Select a value')
      await expect(conditionValueSelects.nth(3)).toHaveText('Custom placeholder')
    })
  })
  test('should display placeholder in edit view', async () => {
    await page.goto(placeholderUrl.create)

    await expect(page.locator('#field-defaultSelect .rs__placeholder')).toHaveText('Select a value')
    await expect(page.locator('#field-placeholderSelect .rs__placeholder')).toHaveText(
      'Custom placeholder',
    )
    await expect(page.locator('#field-defaultRelationship .rs__placeholder')).toHaveText(
      'Select a value',
    )
    await expect(page.locator('#field-placeholderRelationship .rs__placeholder')).toHaveText(
      'Custom placeholder',
    )
  })

  test('should reset list selection when query params change', async () => {
    await deleteAllPosts()
    await Promise.all(Array.from({ length: 12 }, (_, i) => createPost({ title: `post${i + 1}` })))
    await page.goto(postsUrl.list)

    const pageOneButton = page.locator('.paginator__page', { hasText: '1' })
    await expect(pageOneButton).toBeVisible()
    await pageOneButton.click()

    await page.locator('.checkbox-input:has(#select-all)').locator('input').click()
    await expect(page.locator('.checkbox-input:has(#select-all)').locator('input')).toBeChecked()
    await expect(page.locator('.list-selection')).toContainText('5 selected')

    const pageTwoButton = page.locator('.paginator__page', { hasText: '2' })
    await expect(pageTwoButton).toBeVisible()
    await pageTwoButton.click()

    await expect(
      page.locator('.checkbox-input:has(#select-all) input:not([checked])'),
    ).toBeVisible()

    await page.locator('.row-1 .cell-_select input').check()
    await page.locator('.row-2 .cell-_select input').check()

    await expect(page.locator('.list-selection')).toContainText('2 selected')
  })

  test('should refresh custom list drawer using the refresh method from context', async () => {
    const url = new AdminUrlUtil(serverURL, 'custom-list-drawer')

    await payload.delete({
      collection: 'custom-list-drawer',
      where: { id: { exists: true } },
    })

    const { id } = await payload.create({
      collection: 'custom-list-drawer',
      data: {},
    })

    await page.goto(url.list)

    await expect(page.locator('.table > table > tbody > tr')).toHaveCount(1)

    await page.goto(url.edit(id))

    await page.locator('#open-custom-list-drawer').click()
    const drawer = page.locator('[id^=list-drawer_1_]')
    await expect(drawer).toBeVisible()

    await expect(drawer.locator('.table > table > tbody > tr')).toHaveCount(1)

    await drawer.locator('.list-header__create-new-button.doc-drawer__toggler').click()
    const createNewDrawer = page.locator('[id^=doc-drawer_custom-list-drawer_1_]')
    await createNewDrawer.locator('#create-custom-list-drawer-doc').click()

    await expect(page.locator('.payload-toast-container')).toContainText('successfully')

    await createNewDrawer.locator('.doc-drawer__header-close').click()

    await expect(drawer.locator('.table > table > tbody > tr')).toHaveCount(2)
  })
})

async function createPost(overrides?: Partial<Post>): Promise<Post> {
  return payload.create({
    collection: postsCollectionSlug,
    data: {
      description,
      title,
      ...overrides,
    },
  }) as unknown as Promise<Post>
}

async function deleteAllPosts() {
  await payload.delete({ collection: postsCollectionSlug, where: { id: { exists: true } } })
}

async function createGeo(overrides?: Partial<Geo>): Promise<Geo> {
  return payload.create({
    collection: geoCollectionSlug,
    data: {
      point: [4, -4],
      ...overrides,
    },
  }) as unknown as Promise<Geo>
}

async function createArray() {
  return payload.create({
    collection: arrayCollectionSlug,
    data: {
      array: [{ text: 'test' }],
    },
  })
}
