import React, { ChangeEvent } from 'react'
import { VersionRange } from '../../types/Documentation'
import inputStyles from '../../styles/input.module.css'

const VersionInput = ({
  errorMessage,
  label,
  value,
  onChangeHandler
}: {
  errorMessage: string
  label: string
  value: VersionRange
  onChangeHandler(value: VersionRange): void
}) => {
  const id = label.split(' ').join('').toLowerCase()
  return (
    <div className="flex w-full justify-between items-center text-white">
      <label htmlFor={id} >{label}</label>
      <div className='w-full max-w-xs flex flex-col'>
        <div className='flex gap-5'>
          {value.map((item, index) => {
            let calcValue: string | number = ''
            if (value[index] !== null) calcValue = value[index] as number
            return <input
              key={id + index}
              className={
                (errorMessage ? "border-orange-400" : "border-stone-700") + ' ' +
                inputStyles.input
              }
              id={id}
              placeholder='X'
              min={0}
              type='number'
              value={calcValue}
              onChange={e => {
                const target = e.target as HTMLInputElement
                value[index] = +target.value
                if (index === 0 && value[0] !== null) {
                  if (value[1] !== null && value[0] > value[1]) value[1] = +target.value
                  if (!value[1]) value[1] = +target.value
                }
                if (e.target.value === '') value[index] = null
                if (e.target.value === '0') value[index] = 0
                onChangeHandler([...value])
              }}
            />
          }
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