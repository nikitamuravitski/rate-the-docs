import React, { ChangeEvent } from 'react'

const Input = ({
  errorMessage,
  label,
  value,
  onChangeHandler
}: {
  errorMessage: string
  label: string
  value: string
  onChangeHandler(value: string): void
}) => {
  const id = label.split(' ').join('').toLowerCase()
  return (
    <div className="flex w-full justify-between items-center text-white">
      <label htmlFor={id} >{label}</label>
      <div className='w-full max-w-xs flex flex-col'>
        <input
          className={
            (errorMessage ? "border-orange-400" : "border-stone-700") +
            " box-border w-full max-w-xs rounded-md bg-[#ffffff29] border-2 border-stone-700 p-3"
          }
          id={id}
          type='text'
          value={value}
          onChange={e => {
            const target = e.target as HTMLInputElement
            onChangeHandler(target.value)
          }}
        />
        <div className='text-orange-400'>
          {errorMessage}
        </div>
      </div>
    </div>
  )
}

export default Input