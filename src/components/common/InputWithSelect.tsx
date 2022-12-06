import React, { useRef, useState } from 'react'
import { useOutsideClick } from '../../hooks/useOutsideClick'

const InputWithSelect = ({
  errorMessage,
  value,
  onChangeHandler,
  onSelectHandler,
  options,
  getOptionDisplayValue,
  label,
  loading
}: {
  errorMessage: string
  value: string
  onChangeHandler(value: string): void
  onSelectHandler(value: string): void
  options: any[]
  getOptionDisplayValue(value: any): string
  label: string
  loading: boolean
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [isInputInFocus, setIsInputInFocus] = useState<boolean>(false)

  useOutsideClick(inputRef, () => {
    setTimeout(() => setIsInputInFocus(false), 100)
  })

  return (<div className='w-full relative flex justify-between items-center text-white'>
    <label htmlFor={label.toLowerCase()} >{label}</label>
    <div className='relative w-full max-w-xs flex flex-col justify-center'>
      <input
        id={label.toLowerCase()}
        type='text'
        value={value}
        onChange={e => onChangeHandler(e.target.value)}
        onMouseDown={() => !isInputInFocus && setIsInputInFocus(true)}
        className={
          (errorMessage ? "border-orange-400" : "border-stone-700") +
          " w-full rounded-md bg-[#ffffff29] border-2 border-stone-700 p-3"
        }
        ref={inputRef}
      />
      {isInputInFocus && <div
        id={label}
        className='rounded-md w-full max-h-40 overflow-auto flex flex-col text-zinc-800 bg-slate-100 absolute top-[calc(100%+3px)]'
      >
        {!value && 'Start typing'}
        {value && !loading && !options && 'Loading'}
        {loading && value && 'Loading'}
        {!loading && value && options && options
          .map(option => <button
            tabIndex={0}
            onClick={(e) => {
              onChangeHandler(getOptionDisplayValue(option))
              onSelectHandler(getOptionDisplayValue(option))
            }}
            key={getOptionDisplayValue(option)}
            className='hover:backdrop-brightness-90 p-2 cursor-pointer'
          >
            {getOptionDisplayValue(option)}
          </button>
          )}
      </div>
      }
      <div className='text-orange-400'>
        {errorMessage}
      </div>
    </div>
  </div>
  )
}

export default InputWithSelect