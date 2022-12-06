'use client'

import React, { ReactNode, useMemo } from 'react'
import styles from './styles.module.css'

const IconRadio = ({ children, name, disabled = false, checked = false }: { children: ReactNode, name: string, disabled?: boolean, checked?: boolean }) => {
  return (<>
    <input type='radio' defaultChecked={checked} id={name} value={name.toLowerCase()} name='language' disabled={disabled} className={styles['checkbox']} />
    <label htmlFor={name}>
      <span className=''>
        {children}
      </span>
      <span className='hidden'>{name}</span>
    </label>
  </>
  )
}

export default IconRadio