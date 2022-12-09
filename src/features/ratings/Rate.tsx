import { useSession } from 'next-auth/react'
import React, { useState, useMemo, useEffect } from 'react'
import { Rating } from '../../types/Documentation'
import { trpc } from '../../utils/trpc'

type RateComponent = {
  initialData: {
    _avg: number | null | undefined,
    data: Rating[]
  },
  documentationId: string
}

const Rate = ({
  initialData,
  documentationId
}: RateComponent) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [rates, setRates] = useState(initialData.data)
  const [currentUserRating, setCurrentUserRating] = useState<Rating | null>(null)

  const { data: session } = useSession()

  const rateDocumentMutation = trpc.documentation.rateDocumentation.useMutation()

  useEffect(() => {
    if (session?.user?.id && rates.length) {
      const userId = session.user.id
      const currentUserRating = rates.find(vote => vote.userId === userId)
      if (currentUserRating) setCurrentUserRating(currentUserRating)
    }
  }, [rates, session])

  const rateDocumentHandler = (amount: 1 | 2 | 3 | 4 | 5) => {
    return rateDocumentMutation.mutate(
      {
        documentationId,
        value: amount
      },
      {
        onSuccess: (data) => { setRates((old) => [...old, data]) },
        onError: async (e) => setErrorMessage(e.message)
      })
  }
  return (<div className='flex flex-col items-center'>
    <div className='flex gap-3'>
      {currentUserRating ? <div>{currentUserRating.value}</div> : <>
        <button onClick={() => rateDocumentHandler(1)}>1</button>
        <button onClick={() => rateDocumentHandler(2)}>2</button>
        <button onClick={() => rateDocumentHandler(3)}>3</button>
        <button onClick={() => rateDocumentHandler(4)}>4</button>
        <button onClick={() => rateDocumentHandler(5)}>5</button>
      </>
      }
      <div className='rounded-md bg-green-700 text-white px-3'>{initialData._avg || 0}</div>
    </div>
    <div >{errorMessage}</div>
  </div>
  )
}

export default Rate