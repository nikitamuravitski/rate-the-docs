import React from 'react'
import cc from 'classcat'
import { trpc } from '../../utils/trpc'

const SidePanel = ({ isOpen = false, id }: { isOpen?: boolean, id?: string | null }) => {

  return (
    <div
      className={cc({
        'rounded-xl overflow-hidden shadow-2xl w-full max-w-7xl m-3 backdrop-blur-lg p-3 bg-[#063b2815] transition-all duration-500 text-white': true,
        'max-w-0 opacity-0': !isOpen,
        'max-w-[400px] opacity-100': isOpen
      })}
    >
      {id}
      SidePanel
    </div>
  )
}

export default SidePanel