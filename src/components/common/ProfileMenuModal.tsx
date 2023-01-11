import React, { useRef } from 'react'
import { useOutsideClick } from '../../hooks/useOutsideClick'
import cc from 'classcat'
import { signOut } from 'next-auth/react'
type ProfileMenuModalProps = {
  isOpen: boolean,
  close(): void
}

const ProfileMenuModal = ({
  isOpen = false,
  close
}: ProfileMenuModalProps) => {
  const containerRef = useRef(null)
  useOutsideClick(containerRef, () => { console.log(1); close() })

  return (
    <div
      className={cc({
        'flex justify-center items-center absolute top-0 right-0 z-20': true,
        'transition-all scale-100': isOpen,
        'overflow-hidden scale-0': !isOpen
      })}
    >
      <div
        ref={containerRef}
        className='relative flex bg-[#00000020] backdrop-blur-sm rounded-2xl px-4 py-2 pr-14'
      >
        <button
          className='whitespace-nowrap text-gray-200 px-3 rounded-md border border-sky-600 hover:bg-sky-600 transition-colors text-lg'
          onClick={() => signOut()}
        >
          Log Out
        </button>
        <button
          tabIndex={2}
          className="absolute top-2 right-2 w-7 aspect-square hover:bg-[#ffffff60] bg-[#ffffff40] text-black rounded-full grid place-items-center"
          onClick={(e) => {
            close()
          }}>
          x
        </button>
      </div>
    </div>
  )
}

export default ProfileMenuModal