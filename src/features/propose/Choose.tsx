import React, { } from 'react'
import JsIcon from '../../assets/svg/jsIcon.svg'
import PythonIcon from '../../assets/svg/pythonIcon.svg'
import JavaIcon from '../../assets/svg/javaIcon.svg'
import RustIcon from '../../assets/svg/rustIcon.svg'
import IconRadio from './IconCheckbox'
import { Language } from '../../types/Documentation'


const Choose = ({ onChoose, currentPick }: {
  onChoose: (lang: Language) => void,
  currentPick: Language
}) => {
  return (<div className='text-white flex flex-col gap-5'>
    <div className='flex justify-between items-center'>
      <span>Language:</span>
      <fieldset id='language' className='flex max-w-xs w-full gap-3' onChange={e => {
        const target = e.target as HTMLInputElement
        const value = target.value as Language
        onChoose(value)
      }}>
        <IconRadio checked={currentPick === Language.javascript} name='Javascript'>
          <JsIcon />
        </IconRadio>
        <IconRadio checked={currentPick === Language.python} name='Python' >
          <PythonIcon />
        </IconRadio>
        <IconRadio checked={currentPick === Language.java} name='Java' >
          <JavaIcon />
        </IconRadio>
        <IconRadio checked={currentPick === Language.rust} name='Rust' >
          <RustIcon />
        </IconRadio>
      </fieldset>
    </div>
  </div>
  )
}

export default Choose