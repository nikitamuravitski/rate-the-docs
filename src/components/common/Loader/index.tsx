import React from 'react'
import styles from './style.module.css'

const Loader = () => {
  return (
    <div className={styles['loader']}>
      <div className={styles['row']}>
        <div className={styles['thumb'] + ' ' + styles['yellow']}></div>
      </div>
      <div className={styles['row']}>
        <div className={styles['thumb'] + ' ' + styles['green']}></div>
      </div>
      <div className={styles['row']}>
        <div className={styles['thumb'] + ' ' + styles['red']}></div>
      </div>
    </div>
  )
}

export default Loader