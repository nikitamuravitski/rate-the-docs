import React, { useCallback, useState } from 'react'
import { useSession } from 'next-auth/react'
import AuthLoginModal from '../../features/auth/LoginModal'
import ProfileMenuModal from './ProfileMenuModal'

const UserIcon = () => {
  const { data, status } = useSession()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isProfileMenuModal, setIsProfileMenuModalOpen] = useState(false)

  return (
    <div
      className='text-white aspect-square h-10 grid place-items-center relative'
    >
      <AuthLoginModal close={() => setIsAuthModalOpen(false)} isOpen={isAuthModalOpen && status === 'unauthenticated'} />
      <ProfileMenuModal close={() => setIsProfileMenuModalOpen(false)} isOpen={isProfileMenuModal && status === 'authenticated'} />
      {status === 'unauthenticated' && <button tabIndex={1} onFocus={() => setIsAuthModalOpen(true)} onClick={() => setIsAuthModalOpen(true)}>Login</button>}
      {status === 'authenticated' && data?.user?.image && <img onClick={() => setIsProfileMenuModalOpen(true)} className='rounded-full cursor-pointer' alt='avatar' src={data?.user?.image} />}
    </div>
  )
}

export default UserIcon