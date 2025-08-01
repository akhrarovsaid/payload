'use client'
import type {
  Option,
  OptionObject,
  SelectFieldClientComponent,
  SelectFieldClientProps,
} from 'payload'

import React, { useCallback, useMemo } from 'react'

import type { ReactSelectAdapterProps } from '../../elements/ReactSelect/types.js'
import type { SelectInputProps } from './Input.js'

import { useField } from '../../forms/useField/index.js'
import { withCondition } from '../../forms/withCondition/index.js'
import { mergeFieldStyles } from '../mergeFieldStyles.js'
import { SelectInput } from './Input.js'

export const formatOptions = (options: Option[]): OptionObject[] =>
  options.map((option) => {
    if (typeof option === 'object' && (option.value || option.value === '')) {
      return option
    }

    return {
      label: option,
      value: option,
    } as OptionObject
  })

const SelectFieldComponent: SelectFieldClientComponent = (props) => {
  const {
    field,
    field: {
      name,
      admin: {
        className,
        description,
        isClearable = true,
        isSortable = true,
        placeholder,
      } = {} as SelectFieldClientProps['field']['admin'],
      hasMany = false,
      label,
      localized,
      options: optionsFromProps = [],
      required,
    },
    onChange: onChangeFromProps,
    path: pathFromProps,
    readOnly,
    validate,
  } = props

  const options = React.useMemo(() => formatOptions(optionsFromProps), [optionsFromProps])

  const memoizedValidate = useCallback(
    (value, validationOptions) => {
      if (typeof validate === 'function') {
        return validate(value, { ...validationOptions, hasMany, options, required })
      }
    },
    [validate, required, hasMany, options],
  )

  const {
    customComponents: { AfterInput, BeforeInput, Description, Error, Label } = {},
    disabled,
    path,
    selectFilterOptions,
    setValue,
    showError,
    value,
  } = useField({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  })

  const onChange: ReactSelectAdapterProps['onChange'] = useCallback(
    (selectedOption: OptionObject | OptionObject[]) => {
      if (!readOnly || disabled) {
        let newValue: string | string[] = null
        if (selectedOption && hasMany) {
          if (Array.isArray(selectedOption)) {
            newValue = selectedOption.map((option) => option.value)
          } else {
            newValue = []
          }
        } else if (selectedOption && !Array.isArray(selectedOption)) {
          newValue = selectedOption.value
        }

        if (typeof onChangeFromProps === 'function') {
          onChangeFromProps(newValue)
        }

        setValue(newValue)
      }
    },
    [readOnly, disabled, hasMany, setValue, onChangeFromProps],
  )

  const styles = useMemo(() => mergeFieldStyles(field), [field])

  return (
    <SelectInput
      AfterInput={AfterInput}
      BeforeInput={BeforeInput}
      className={className}
      Description={Description}
      description={description}
      Error={Error}
      filterOption={
        selectFilterOptions
          ? ({ value }) =>
              selectFilterOptions?.some(
                (option) => (typeof option === 'string' ? option : option.value) === value,
              )
          : undefined
      }
      hasMany={hasMany}
      isClearable={isClearable}
      isSortable={isSortable}
      Label={Label}
      label={label}
      localized={localized}
      name={name}
      onChange={onChange}
      options={options}
      path={path}
      placeholder={placeholder}
      readOnly={readOnly || disabled}
      required={required}
      showError={showError}
      style={styles}
      value={value as string | string[]}
    />
  )
}

export const SelectField = withCondition(SelectFieldComponent)

export { SelectInput, type SelectInputProps }
