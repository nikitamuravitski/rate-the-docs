import { useSession } from 'next-auth/react'
import React, { useEffect, useState, useMemo } from 'react'
import { Vote } from '../../types/Documentation'
import { trpc } from '../../utils/trpc'

type VoteComponent = ({
  proposalId: string,
  initialValue: Vote[],
  refetchTable(): void
})

const Vote = ({ proposalId, initialValue }: VoteComponent) => {
  const [votes, setVotes] = useState<Vote[]>(initialValue)
  const [isCurrentUserVoted, setIsCurrentUserVoted] = useState(false)

  const { data: session } = useSession()

  const totalVotes = useMemo(() => {
    if (votes.length) {
      return votes.reduce((acc, current) => acc += current.value, 0)
    }
    return 0
  }, [votes])

  useEffect(() => {
    if (session?.user?.id && votes.length) {
      const userId = session.user.id
      const currentUserVote = votes.find(vote => vote.userId === userId)
      if (currentUserVote) setIsCurrentUserVoted(true)
    }
  }, [votes, session])

  const mutation = trpc.documentation.voteForProposal.useMutation()

  const onVoteHandler = (amount: 1 | -1) => mutation.mutate({
    documentationId: proposalId,
    value: amount,
  }, {
    onSuccess: (data) => { setVotes((old) => [...old, data]) },
    onError: e => console.log(e.message)
  })

  return (
    <div className='flex gap-3 justify-center'>
      {!isCurrentUserVoted && <button onClick={() => onVoteHandler(-1)}>{'<'}</button>}
      <div>{totalVotes}</div>
      {!isCurrentUserVoted && <button onClick={() => onVoteHandler(1)}>{'>'}</button>}
    </div>
  )
}

export default Vote