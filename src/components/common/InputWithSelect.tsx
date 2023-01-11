import React, { useRef, useState } from 'react'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import inputStyles from '../../styles/input.module.css'

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
  options: any[] | undefined
  getOptionDisplayValue(value: any): string
  label: string
  loading: boolean
}) => {
  const id = label.split(' ').join('').toLowerCase()
  const inputRef = useRef<HTMLInputElement>(null)

  const [isInputInFocus, setIsInputInFocus] = useState<boolean>(false)

  useOutsideClick(inputRef, () => setIsInputInFocus(false))


  return (<div className='w-full relative flex justify-between items-center text-white'>
    <label htmlFor={id} >{label}</label>
    <div className='relative w-full max-w-xs flex flex-col justify-center'>
      <input
        id={id}
        type='text'
        value={value}
        onChange={e => onChangeHandler(e.target.value)}
        onMouseDown={() => !isInputInFocus && setIsInputInFocus(true)}
        className={
          inputStyles['input'] + ' ' +
          (errorMessage ? "border-orange-400" : "border-stone-700")
        }
        ref={inputRef}
      />
      {isInputInFocus && <div
        className='z-50 rounded-md w-full max-h-40 overflow-auto flex flex-col text-zinc-800 bg-slate-100 absolute top-[calc(100%+3px)]'
      >
        {!value && <span className='p-3'>Start typing</span>}
        {value && !loading && !options && <span className='p-3'>Loading</span>}
        {loading && value && <span className='p-3'>Loading</span>}
        {!loading && value && options?.length && options
          .map(option => <button
            tabIndex={0}
            onMouseDown={(e) => {
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