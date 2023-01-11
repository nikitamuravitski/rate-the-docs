import React from 'react'
import inputStyles from '../../styles/input.module.css'
const Input = ({
  errorMessage,
  label,
  value,
  onChangeHandler,
  multiline = false
}: {
  errorMessage: string
  label: string
  value: string
  onChangeHandler(value: string): void
  multiline?: boolean
}) => {
  const id = label.split(' ').join('').toLowerCase()
  return (
    <div className="flex w-full justify-between items-center text-white">
      <label htmlFor={id} >{label}</label>
      <div className='w-full max-w-xs flex flex-col'>
        {multiline
          ?
          <textarea
            className={
              inputStyles['input'] + ' ' +
              (errorMessage ? "border-orange-400" : "border-stone-700")
            }
            id={id}
            value={value}
            onChange={e => {
              onChangeHandler(e.target.value)
            }}
          />
          :
          <input
            className={
              inputStyles['input'] + ' ' +
              (errorMessage ? "border-orange-400" : "border-stone-700")
            }
            id={id}
            type='text'
            value={value}
            onChange={e => {
              const target = e.target as HTMLInputElement
              onChangeHandler(target.value)
            }}
          />
        }
        <div className='text-orange-400'>
          {errorMessage}
        </div>
      </div>
    </div>
  )
}

export default Input