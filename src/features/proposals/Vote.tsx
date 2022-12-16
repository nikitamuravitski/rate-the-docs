import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { toast, ToastContentProps } from 'react-toastify'
import { trpc } from '../../utils/trpc'
import cc from 'classcat'

type VoteComponent = ({
  currentUserVote: Prisma.VoteGetPayload<{}>[],
  initialData: Prisma.DocumentationWithVotesGetPayload<{}> | null,
  refetchTable(): void
})

const Vote = ({ currentUserVote: currentUserVoteInitialData, initialData }: VoteComponent) => {

  const [total, setTotal] = useState<number | undefined>(initialData?.total)
  const [currentUserVote, setCurrentUserVote] = useState(currentUserVoteInitialData)

  const { data: session } = useSession()

  const mutation = trpc.documentation.voteForProposal.useMutation()

  const toaster = useCallback(
    (promise: any) => {
      toast.promise(
        promise,
        {
          pending: 'Saving',
          success: {
            render(props: ToastContentProps<Prisma.DocumentationWithVotesGetPayload<{ include: { votes: true } }>>) {
              setTotal(props.data!.total)
              setCurrentUserVote(props.data!.votes)
              return props.data!.votes[0]!.value === 1 ? 'Upvoted' : 'Downvoted'
            }
          },
          error: {
            render(props: ToastContentProps<TRPCError>) {
              if (props.data?.message) {
                return <div>{props.data?.message}</div>
              }
            }
          }
        })
    },
    [],
  )

  const onVoteHandler = (amount: 1 | -1) => {
    toaster(
      mutation.mutateAsync({
        documentationId: initialData!.documentationId,
        value: amount,
      })
    )
  }

  return (
    <div className='flex gap-3 justify-center items-center'>
      <button
        disabled={currentUserVote && !!currentUserVote.length}
        className='font-bold text-xl text-red-400'
        onClick={() => onVoteHandler(-1)}
      >
        <svg
          className={
            cc({
              '-rotate-90': true,
              'fill-rose-400 opacity-40 hover:opacity-100 hover:fill-red-500':
                !currentUserVote ||
                (!!currentUserVote && !currentUserVote.length) ||
                (!!currentUserVote && !!currentUserVote.length && currentUserVote[0]?.value !== -1),
              'fill-red-400': !!currentUserVote && !!currentUserVote.length && currentUserVote[0]?.value === -1,
            })
          }
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="geometricPrecision"
          textRendering="geometricPrecision"
          imageRendering="optimizeQuality"
          fillRule="evenodd"
          clipRule="evenodd"
          viewBox="0 0 512 463.95"
          width='20'
          height='20'
        >
          <path
            fillRule="nonzero"
            d="M512 332.66H268.5v92.31c-.68 15.47-5.77 26.46-15.43 32.82-25.79 17.2-52.31-5.26-69.24-22.6L14.33 261.6c-19.11-17.28-19.11-41.93 0-59.21L188.71 24.42c16.06-16.39 40.56-34.09 64.36-18.21 9.66 6.35 14.75 17.34 15.43 32.81v92.31H512v201.33z" />
        </svg>
      </button>
      <div className='text-xl bg-[#ffffff20] px-3 rounded-md'>{total}</div>
      <button
        disabled={currentUserVote && !!currentUserVote.length}
        className='font-bold text-xl text-green-400'
        onClick={() => onVoteHandler(1)}
      >
        <svg
          className={
            cc({
              'rotate-90': true,
              'fill-green-600 opacity-40 hover:opacity-100 hover:fill-green-500':
                !currentUserVote ||
                (!!currentUserVote && !currentUserVote.length) ||
                (!!currentUserVote && !!currentUserVote.length && currentUserVote[0]?.value !== 1),
              'fill-green-400': !!currentUserVote && !!currentUserVote.length && currentUserVote[0]?.value === 1,
            })
          }
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="geometricPrecision"
          textRendering="geometricPrecision"
          imageRendering="optimizeQuality"
          fillRule="evenodd"
          clipRule="evenodd"
          viewBox="0 0 512 463.95"
          width='20'
          height='20'
        >
          <path
            fillRule="nonzero"
            d="M512 332.66H268.5v92.31c-.68 15.47-5.77 26.46-15.43 32.82-25.79 17.2-52.31-5.26-69.24-22.6L14.33 261.6c-19.11-17.28-19.11-41.93 0-59.21L188.71 24.42c16.06-16.39 40.56-34.09 64.36-18.21 9.66 6.35 14.75 17.34 15.43 32.81v92.31H512v201.33z" />
        </svg>
      </button>
    </div >
  )
}

export default Vote