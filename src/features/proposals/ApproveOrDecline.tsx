import { Prisma } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import React, { useCallback } from 'react'
import { toast, ToastContentProps } from 'react-toastify'
import { trpc } from '../../utils/trpc'

type ApproveOrDeclineType = {
  proposalId: string
  refetchTable: any
}

const ApproveOrDecline = ({ proposalId, refetchTable }: ApproveOrDeclineType) => {

  const approveMutation = trpc.documentation.approveProposal.useMutation()
  const declineMutation = trpc.documentation.declineProposal.useMutation()

  const toaster = useCallback(
    (promise: any) => {
      toast.promise(
        promise,
        {
          pending: 'Saving',
          success: {
            render(props: ToastContentProps<Prisma.DocumentationGetPayload<{}>>) {
              refetchTable()
              return props.data!.status === 'accepted' ? `${props.data?.name}: Accepted` : `${props.data?.name}: Declined`
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

  const onApproveHandler = useCallback(() => {
    toaster(
      approveMutation.mutateAsync({ id: proposalId })
    )
  }, [])

  const onDeclineHandler = useCallback(() => {
    toaster(
      declineMutation.mutateAsync({ id: proposalId })
    )
  }, [])

  return (
    <div className='flex gap-3 justify-center'>
      <button onClick={() => onApproveHandler()} className='grid place-items-center rounded-full aspect-square w-8 bg-green-600 '>{'+'}</button>
      <button onClick={() => onDeclineHandler()} className='grid place-items-center rounded-full aspect-square w-8 bg-red-600'>{'-'}</button>
    </div>
  )
}

export default ApproveOrDecline