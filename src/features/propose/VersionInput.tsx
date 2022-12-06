import React, { ChangeEvent } from 'react'
import { DocVersion } from '../../types/Documentation'
import inputStyles from '../../styles/input.module.css'

const VersionInput = ({
  errorMessage,
  label,
  value,
  onChangeHandler
}: {
  errorMessage: string
  label: string
  value: DocVersion
  onChangeHandler(value: DocVersion): void
}) => {
  const id = label.split(' ').join('').toLowerCase()
  return (
    <div className="flex w-full justify-between items-center text-white">
      <label htmlFor={id} >{label}</label>
      <div className='w-full max-w-xs flex flex-col'>
        <div className='flex gap-5'>
          {value.map((item, index) => <input
            key={id + index}
            className={
              (errorMessage ? "border-orange-400" : "border-stone-700") + ' ' +
              inputStyles['input']
            }
            id={id}
            placeholder='X'
            min={0}
            type='number'
            value={value[index] || ''}
            onChange={e => {
              const target = e.target as HTMLInputElement
              value[index] = +target.value
              if (+target.value === 0) value[index] = null
              onChangeHandler([...value])
            }}
          />
          )}
        </div>
        <div className='text-orange-400'>
          {errorMessage}
        </div>
      </div>
    </div>
  )
}

export default VersionInput