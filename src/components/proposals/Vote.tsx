import React, { useEffect, useState } from 'react'
import { trpc } from '../../utils/trpc'

type VoteComponent = ({
  proposalId: string,
  initialValue: number
})

const Vote = ({ proposalId, initialValue }: VoteComponent) => {
  const [value, setValue] = useState(initialValue)

  const mutation = trpc.proposals.voteForProposal.useMutation()

  const onVoteHandler = (amount: 1 | -1) => mutation.mutate({
    id: proposalId,
    newVotesAmount: value + amount,
  }, {
    onSuccess: data => setValue(data.votes)
  })

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <div className='flex gap-3 justify-center'>
      <button onClick={() => onVoteHandler(-1)}>{'<'}</button>
      <div className={`${value >= 0 ? 'bg-purple-600' : 'bg-red-600'} aspect-square min-w-[30px] grid place-items-center rounded-full `}>{value}</div>
      <button onClick={() => onVoteHandler(1)}>{'>'}</button>
    </div>
  )
}

export default Vote