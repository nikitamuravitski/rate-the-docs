import React from 'react'
import JsIcon from '../../assets/svg/jsIcon.svg'
import PythonIcon from '../../assets/svg/pythonIcon.svg'
import JavaIcon from '../../assets/svg/javaIcon.svg'
import RustIcon from '../../assets/svg/rustIcon.svg'

import { Language } from '../../types/Documentation'

import styles from './style.module.css'

const icons = {
  [Language.javascript]: <JsIcon />,
  [Language.rust]: <RustIcon />,
  [Language.java]: <JavaIcon />,
  [Language.python]: <PythonIcon />
}

const LanguageIcon = ({ language }: { language: `${Language}` }) => {
  return <div className={
    styles['iconWrapper'] + ' ' +
    'w-[30px] h-[30px] flex justify-center rounded-md overflow-hidden m-0 p-0'
  }>
    {icons[language]}
  </div>

}

export default LanguageIcon