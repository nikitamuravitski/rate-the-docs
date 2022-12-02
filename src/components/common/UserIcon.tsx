import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

const UserIcon = () => {
  const { data, status } = useSession()
  return (
    <div
      className='text-white aspect-square h-10 rounded-full overflow-hidden grid place-items-center'
      onClick={() => {
        if (status === 'authenticated') return signOut()
        signIn()
      }}
    >
      {!data && <button>Login</button>}
      {data?.user?.image && <img alt='avatar' src={data?.user?.image} />}
    </div>
  )
}

export default UserIcon