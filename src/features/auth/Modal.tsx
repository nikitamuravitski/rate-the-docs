import { useQuery } from "@tanstack/react-query"
import { signIn, getProviders, useSession, signOut } from "next-auth/react"
import React, { useRef, useState } from "react"
import { useOutsideClick } from "../../hooks/useOutsideClick"
import cc from 'classcat'
import TopLeftPolygon from '../../assets/svg/polygonTriangles/1.svg'
import BottomRightPolygon from '../../assets/svg/polygonTriangles/2.svg'
import TopRightPolygon from '../../assets/svg/polygonTriangles/3.svg'

const Modal = ({ isOpen = false, close }: { isOpen: boolean, close(): void }) => {
  const { data: session } = useSession()

  const containerRef = useRef(null)
  useOutsideClick(containerRef, () => close())

  const { data: providers } = useQuery([], {
    queryFn: () => getProviders()
  })

  return <div
    className={cc({
      'flex justify-center items-center fixed top-0 bottom-0 right-0 left-0 z-20': true,
      'transition-colors bg-[#00000050]': isOpen,
      'overflow-hidden scale-0': !isOpen
    })
    }
  >
    <div className="min-w-[270px] max-w-[700px] w-full h-fit relative grid place-items-center p-3">
      <div className="absolute -top-24 -left-24">
        <TopLeftPolygon />
      </div>
      <div className="absolute -top-20 -right-16 scale-125">
        <TopRightPolygon />
      </div>
      <div className="absolute -bottom-40 -right-32 scale-75">
        <BottomRightPolygon />
      </div>
      <div ref={containerRef} className=" w-full min-h-[300px] flex flex-col items-center justify-start p-10 z-20 rounded-2xl bg-[#ffffff20] border border-[#ffffff40] backdrop-blur-lg shadow-lg">
        <h3 className="text-2xl mb-5">Login</h3>
        <button
          tabIndex={2}
          className="absolute top-2 right-2 w-7 aspect-square hover:bg-[#ffffff60] bg-[#ffffff40] rounded-full grid place-items-center"
          onClick={(e) => {
            close()
          }}>
          x
        </button>
        {session?.user?.id
          ?
          <button
            className='whitespace-nowrap p-3 rounded-md bg-sky-500 text-xl text-white'
            onClick={() => signOut()}
          >
            Logout
          </button>
          :
          providers && Object.values(providers)
            .map((provider, i) => <button
              tabIndex={isOpen ? 2 : -1}
              key={provider.id}
              className='whitespace-nowrap p-3 rounded-md border-white border text-xl text-white'
              onClick={(e) => {
                signIn(provider.id)
              }
              }
            >
              Sign in with {provider.name}
            </button>)
        }
      </div>
    </div>
  </div>
}

export default Modal