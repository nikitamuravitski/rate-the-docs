import React, { } from 'react'
import JsIcon from '../../assets/svg/jsIcon.svg'
import PythonIcon from '../../assets/svg/pythonIcon.svg'
import JavaIcon from '../../assets/svg/javaIcon.svg'
import RustIcon from '../../assets/svg/rustIcon.svg'
import IconRadio from '../../features/propose/IconCheckbox'
import { Language } from '../../types/Documentation'


const ChooseLanguage = ({
  onChoose,
  currentPick,
  hideLabel = false,
  includeAll = false
}: {
  hideLabel?: boolean,
  includeAll?: boolean
  onChoose: any,
  currentPick: Language | undefined
}) => {
  return (<div className='text-white flex flex-col gap-5'>
    <div className='flex justify-between items-center'>
      {!hideLabel && <span>Language:</span>}
      <fieldset id='language' className='flex max-w-xs w-full gap-3' onChange={e => {
        const target = e.target as HTMLInputElement
        let value = target.value as Language | 'all' | undefined
        if (value === 'all') value = undefined
        onChoose(value)
      }}>
        {includeAll &&
          <IconRadio checked={currentPick === undefined} name='all' >
            <svg width={40} height={40}>
              <circle cx="20" cy="20" r="19" stroke="white" fill='none'></circle>
              <text x="7" y="25" fill='white'>ALL</text>
            </svg>
          </IconRadio>
        }
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

export default ChooseLanguage