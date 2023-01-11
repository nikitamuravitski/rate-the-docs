import React, { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import AuthModal from '../../features/auth/Modal'

const UserIcon = () => {
  const { data, status } = useSession()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  return (
    <div
      className='text-white aspect-square h-10 grid place-items-center relative'
    >
      <AuthModal close={() => setIsAuthModalOpen(false)} isOpen={isAuthModalOpen} />
      {status === 'unauthenticated' && <button tabIndex={1} onFocus={() => setIsAuthModalOpen(true)} onClick={() => setIsAuthModalOpen(true)}>Login</button>}
      {status === 'authenticated' && data?.user?.image && <img onClick={() => setIsAuthModalOpen(true)} className='rounded-full cursor-pointer' alt='avatar' src={data?.user?.image} />}
    </div>
  )
}

export default UserIcon