import Link from 'next/link'
import React from 'react'
import UserIcon from './UserIcon'

const Header = () => {
  return (
    <header
      className='p-3 flex justify-between max-w-7xl w-full'
    >
      <h1
        className='font-medium text-3xl text-slate-100'
      >
        Rate{' '}
        <span
          className="w-fit text-transparent drop-shadow-xl bg-clip-text bg-gradient-to-r from-slate-100 via-purple-400 to-pink-600 "
        >
          the docs_
        </span>
      </h1>
      <nav>
        <ul className='flex text-slate-200 gap-10 h-full items-center'>
          <li>
            <Link tabIndex={3} href="/">
              Home
            </Link>
          </li>
          <li>
            <Link tabIndex={3} href="/ratings">
              Ratings
            </Link>
          </li>
          <li>
            <Link tabIndex={3} href="/propose">
              Propose
            </Link>
          </li>
          <li>
            <Link tabIndex={3} href="/proposals">
              Proposals
            </Link>
          </li>
        </ul>
      </nav>
      <UserIcon />
    </header>
  )
}

export default Header