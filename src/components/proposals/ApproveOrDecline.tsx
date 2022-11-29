import React, { useState, useEffect } from 'react'
import { trpc } from '../../utils/trpc'

type ApproveOrDeclineType = {
  proposalId: string

}

const ApproveOrDecline = ({ proposalId, }: ApproveOrDeclineType) => {

  const approveMutation = trpc.proposals.approveProposal.useMutation()
  const declineMutation = trpc.proposals.declineProposal.useMutation()

  const onApproveHandler = () => approveMutation.mutate({ id: proposalId })
  const onDeclineHandler = () => declineMutation.mutate({ id: proposalId })

  return (
    <div className='flex gap-3 justify-center'>
      <button onClick={() => onApproveHandler()} className='grid place-items-center rounded-full aspect-square w-8 bg-green-600 '>{'+'}</button>
      <button onClick={() => onDeclineHandler()} className='grid place-items-center rounded-full aspect-square w-8 bg-red-600'>{'-'}</button>
    </div>
  )
}

export default ApproveOrDecline