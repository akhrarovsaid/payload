'use client'
import type { ClientUser, DocumentPreferences } from 'payload'

import * as qs from 'qs-esm'
import React, { createContext, use, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useControllableState } from '../../hooks/useControllableState.js'
import { useAuth } from '../../providers/Auth/index.js'
import { requests } from '../../utilities/api.js'
import { formatDocTitle } from '../../utilities/formatDocTitle/index.js'
import { useConfig } from '../Config/index.js'
import { DocumentTitleProvider } from '../DocumentTitle/index.js'
import { useLocale, useLocaleLoading } from '../Locale/index.js'
import { usePreferences } from '../Preferences/index.js'
import { useTranslation } from '../Translation/index.js'
import { UploadEditsProvider, useUploadEdits } from '../UploadEdits/index.js'
import { type DocumentInfoContext, type DocumentInfoProps } from './types.js'
import { useGetDocPermissions } from './useGetDocPermissions.js'

const Context = createContext({} as DocumentInfoContext)

export type * from './types.js'

export const useDocumentInfo = (): DocumentInfoContext => use(Context)

const DocumentInfo: React.FC<
  {
    readonly children: React.ReactNode
  } & DocumentInfoProps
> = ({ children, ...props }) => {
  const {
    id,
    collectionSlug,
    currentEditor: currentEditorFromProps,
    docPermissions: docPermissionsFromProps,
    globalSlug,
    hasPublishedDoc: hasPublishedDocFromProps,
    hasPublishPermission: hasPublishPermissionFromProps,
    hasSavePermission: hasSavePermissionFromProps,
    initialData,
    initialState,
    isLocked: isLockedFromProps,
    lastUpdateTime: lastUpdateTimeFromProps,
    mostRecentVersionIsAutosaved: mostRecentVersionIsAutosavedFromProps,
    unpublishedVersionCount: unpublishedVersionCountFromProps,
    versionCount: versionCountFromProps,
  } = props

  const [docPermissions, setDocPermissions] = useControllableState(docPermissionsFromProps)

  const [hasSavePermission, setHasSavePermission] = useControllableState(hasSavePermissionFromProps)

  const [hasPublishPermission, setHasPublishPermission] = useControllableState(
    hasPublishPermissionFromProps,
  )

  const { permissions } = useAuth()

  const {
    config: {
      admin: { dateFormat },
      routes: { api },
      serverURL,
    },
    getEntityConfig,
  } = useConfig()

  const collectionConfig = getEntityConfig({ collectionSlug })
  const globalConfig = getEntityConfig({ globalSlug })

  const abortControllerRef = useRef(new AbortController())
  const docConfig = collectionConfig || globalConfig

  const { i18n } = useTranslation()

  const { uploadEdits } = useUploadEdits()

  /**
   * @deprecated This state will be removed in v4.
   * This is for performance reasons. Use the `DocumentTitleContext` instead.
   */
  const [title, setDocumentTitle] = useState(() =>
    formatDocTitle({
      collectionConfig,
      data: { ...(initialData || {}), id },
      dateFormat,
      fallback: id?.toString(),
      globalConfig,
      i18n,
    }),
  )

  const [mostRecentVersionIsAutosaved, setMostRecentVersionIsAutosaved] = useState(
    mostRecentVersionIsAutosavedFromProps,
  )

  const [versionCount, setVersionCount] = useState(versionCountFromProps)

  const [hasPublishedDoc, setHasPublishedDoc] = useState(hasPublishedDocFromProps)
  const [unpublishedVersionCount, setUnpublishedVersionCount] = useState(
    unpublishedVersionCountFromProps,
  )

  const [documentIsLocked, setDocumentIsLocked] = useControllableState<boolean | undefined>(
    isLockedFromProps,
  )
  const [currentEditor, setCurrentEditor] = useControllableState<ClientUser | null>(
    currentEditorFromProps,
  )
  const [lastUpdateTime, setLastUpdateTime] = useControllableState<number>(lastUpdateTimeFromProps)
  const [savedDocumentData, setSavedDocumentData] = useControllableState(initialData)
  const [uploadStatus, setUploadStatus] = useControllableState<'failed' | 'idle' | 'uploading'>(
    'idle',
  )

  const documentLockState = useRef<{
    hasShownLockedModal: boolean
    isLocked: boolean
    user: ClientUser | number | string
  } | null>({
    hasShownLockedModal: false,
    isLocked: false,
    user: null,
  })

  const updateUploadStatus = useCallback(
    (status: 'failed' | 'idle' | 'uploading') => {
      setUploadStatus(status)
    },
    [setUploadStatus],
  )

  const { getPreference, setPreference } = usePreferences()
  const { code: locale } = useLocale()
  const { localeIsLoading } = useLocaleLoading()

  const isInitializing = useMemo(
    () => initialState === undefined || initialData === undefined || localeIsLoading,
    [initialData, initialState, localeIsLoading],
  )

  const baseURL = `${serverURL}${api}`
  let slug: string
  let pluralType: 'collections' | 'globals'
  let preferencesKey: string

  if (globalSlug) {
    slug = globalSlug
    pluralType = 'globals'
    preferencesKey = `global-${slug}`
  }

  if (collectionSlug) {
    slug = collectionSlug
    pluralType = 'collections'

    if (id) {
      preferencesKey = `collection-${slug}-${id}`
    }
  }

  const unlockDocument = useCallback(
    async (docID: number | string, slug: string) => {
      try {
        const isGlobal = slug === globalSlug

        const query = isGlobal
          ? `where[globalSlug][equals]=${slug}`
          : `where[document.value][equals]=${docID}&where[document.relationTo][equals]=${slug}`

        const request = await requests.get(`${serverURL}${api}/payload-locked-documents?${query}`, {
          credentials: 'include',
        })

        const { docs } = await request.json()

        if (docs?.length > 0) {
          const lockID = docs[0].id
          await requests.delete(`${serverURL}${api}/payload-locked-documents/${lockID}`, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          setDocumentIsLocked(false)
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to unlock the document', error)
      }
    },
    [serverURL, api, globalSlug, setDocumentIsLocked],
  )

  const updateDocumentEditor = useCallback(
    async (docID: number | string, slug: string, user: ClientUser | number | string) => {
      try {
        const isGlobal = slug === globalSlug

        const query = isGlobal
          ? `where[globalSlug][equals]=${slug}`
          : `where[document.value][equals]=${docID}&where[document.relationTo][equals]=${slug}`

        // Check if the document is already locked
        const request = await requests.get(`${serverURL}${api}/payload-locked-documents?${query}`, {
          credentials: 'include',
        })

        const { docs } = await request.json()

        if (docs?.length > 0) {
          const lockID = docs[0].id

          const userData =
            typeof user === 'object'
              ? { relationTo: user.collection, value: user.id }
              : { relationTo: 'users', value: user }

          // Send a patch request to update the _lastEdited info
          await requests.patch(`${serverURL}${api}/payload-locked-documents/${lockID}`, {
            body: JSON.stringify({
              user: userData,
            }),
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to update the document editor', error)
      }
    },
    [serverURL, api, globalSlug],
  )

  const getDocPermissions = useGetDocPermissions({
    id: id as string,
    api,
    collectionSlug,
    globalSlug,
    i18n,
    locale,
    permissions,
    serverURL,
    setDocPermissions,
    setHasPublishPermission,
    setHasSavePermission,
  })

  const getDocPreferences = useCallback(() => {
    return getPreference<DocumentPreferences>(preferencesKey)
  }, [getPreference, preferencesKey])

  const setDocFieldPreferences = useCallback<DocumentInfoContext['setDocFieldPreferences']>(
    async (path, fieldPreferences) => {
      const allPreferences = await getDocPreferences()

      if (preferencesKey) {
        try {
          await setPreference(preferencesKey, {
            ...allPreferences,
            fields: {
              ...(allPreferences?.fields || {}),
              [path]: {
                ...allPreferences?.fields?.[path],
                ...fieldPreferences,
              },
            },
          })
        } catch (e) {
          console.error(e) // eslint-disable-line no-console
        }
      }
    },
    [setPreference, preferencesKey, getDocPreferences],
  )

  const incrementVersionCount = useCallback(() => {
    const newCount = versionCount + 1
    if (collectionConfig && collectionConfig.versions) {
      if (collectionConfig.versions.maxPerDoc > 0) {
        setVersionCount(Math.min(newCount, collectionConfig.versions.maxPerDoc))
      } else {
        setVersionCount(newCount)
      }
    } else if (globalConfig && globalConfig.versions) {
      if (globalConfig.versions.max > 0) {
        setVersionCount(Math.min(newCount, globalConfig.versions.max))
      } else {
        setVersionCount(newCount)
      }
    }
  }, [collectionConfig, globalConfig, versionCount])

  const updateSavedDocumentData = React.useCallback<DocumentInfoContext['updateSavedDocumentData']>(
    (json) => {
      setSavedDocumentData(json)
    },
    [setSavedDocumentData],
  )

  /**
   * @todo: Remove this in v4
   * Users should use the `DocumentTitleContext` instead.
   */
  useEffect(() => {
    setDocumentTitle(
      formatDocTitle({
        collectionConfig,
        data: { ...savedDocumentData, id },
        dateFormat,
        fallback: id?.toString(),
        globalConfig,
        i18n,
      }),
    )
  }, [collectionConfig, globalConfig, savedDocumentData, dateFormat, i18n, id])

  // clean on unmount
  useEffect(() => {
    const re1 = abortControllerRef.current

    return () => {
      if (re1) {
        try {
          re1.abort()
        } catch (_err) {
          // swallow error
        }
      }
    }
  }, [])

  const action: string = React.useMemo(() => {
    const docURL = `${baseURL}${pluralType === 'globals' ? `/globals` : ''}/${slug}${id ? `/${id}` : ''}`
    const params = {
      depth: 0,
      'fallback-locale': 'null',
      locale,
      uploadEdits: uploadEdits || undefined,
    }

    return `${docURL}${qs.stringify(params, {
      addQueryPrefix: true,
    })}`
  }, [baseURL, locale, pluralType, id, slug, uploadEdits])

  const value: DocumentInfoContext = {
    ...props,
    action,
    currentEditor,
    docConfig,
    docPermissions,
    documentIsLocked,
    documentLockState,
    getDocPermissions,
    getDocPreferences,
    hasPublishedDoc,
    hasPublishPermission,
    hasSavePermission,
    incrementVersionCount,
    initialData,
    initialState,
    isInitializing,
    lastUpdateTime,
    mostRecentVersionIsAutosaved,
    preferencesKey,
    savedDocumentData,
    setCurrentEditor,
    setDocFieldPreferences,
    setDocumentIsLocked,
    setDocumentTitle,
    setHasPublishedDoc,
    setLastUpdateTime,
    setMostRecentVersionIsAutosaved,
    setUnpublishedVersionCount,
    setUploadStatus: updateUploadStatus,
    title,
    unlockDocument,
    unpublishedVersionCount,
    updateDocumentEditor,
    updateSavedDocumentData,
    uploadStatus,
    versionCount,
  }

  return (
    <Context value={value}>
      <DocumentTitleProvider>{children}</DocumentTitleProvider>
    </Context>
  )
}

export const DocumentInfoProvider: React.FC<
  {
    readonly children: React.ReactNode
  } & DocumentInfoProps
> = (props) => {
  return (
    <UploadEditsProvider>
      <DocumentInfo {...props} />
    </UploadEditsProvider>
  )
}
