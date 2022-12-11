import { useSession } from 'next-auth/react'
import React, { useState, useMemo, useEffect } from 'react'
import Loader from '../../components/common/Loader'
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
  const [isComponentLoaded, setIsComponentLoaded] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [avg, setAvg] = useState(initialData._avg)
  const [rates, setRates] = useState(initialData.data)
  const [currentUserRating, setCurrentUserRating] = useState<Rating | null>(null)
  const { data: session } = useSession()

  const { isLoading: isMutationLoading, mutate: rateDocumentationMutate } = trpc.documentation.rateDocumentation.useMutation()

  useEffect(() => {
    if (session?.user?.id && rates.length) {
      const userId = session.user.id
      const currentUserRating = rates.find(vote => vote.userId === userId)
      if (currentUserRating) setCurrentUserRating(currentUserRating)
    }
    setIsComponentLoaded(true)
  }, [rates, session])

  const rateDocumentHandler = (amount: 1 | 2 | 3 | 4 | 5) => {
    return rateDocumentationMutate(
      {
        documentationId,
        value: amount
      },
      {
        onSuccess: (data) => {
          const newRates = [...rates, data]
          setRates(newRates)
          const newAvg = newRates.reduce((acc, current) => acc += +current.value, 0) / newRates.length
          setAvg(newAvg)
          // do some message here
        },
        onError: async (e) => setErrorMessage(e.message)
      })
  }
  return (<div className='flex flex-col items-center'>
    {isMutationLoading
      ? <Loader />
      : <div className='flex gap-3'>
        {
          isComponentLoaded && (!!currentUserRating
            ?
            <div>{currentUserRating.value}</div>
            :
            <>
              <button onClick={() => rateDocumentHandler(1)}>1</button>
              <button onClick={() => rateDocumentHandler(2)}>2</button>
              <button onClick={() => rateDocumentHandler(3)}>3</button>
              <button onClick={() => rateDocumentHandler(4)}>4</button>
              <button onClick={() => rateDocumentHandler(5)}>5</button>
            </>)
        }
        <div className={
          `${!!avg && +avg! >= 3 && 'bg-green-700'}` + ' ' +
          `${!!avg && avg! < 3 && avg! >= 1.8 && 'bg-yellow-700'}` + ' ' +
          `${!!avg && avg! < 1.8 && avg! !== undefined && 'bg-red-900'}` + ' ' +
          `${!avg && 'bg-purple-800'}` + ' ' +
          'rounded-md min-w-[60px] w-fit'
        }>{avg || 0}</div>
      </div>}
    <div >{errorMessage}</div>
  </div >
  )
}

export default Rate