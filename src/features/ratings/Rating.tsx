import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import Loader from '../../components/common/Loader'
import { trpc } from '../../utils/trpc'
import Star from '../../components/common/Star/Star'
import { Prisma } from '@prisma/client'


type RateComponent = {
  data: Prisma.DocumentationWithRatingGetPayload<object> | null,
  currentUserRating: Prisma.RatingGetPayload<object>[],
}

const Rating = ({
  data,
  currentUserRating: currentUserRatingInitialData
}: RateComponent) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [avg, setAvg] = useState<number>(data!.avg)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [currentUserRating, setCurrentUserRating] = useState(currentUserRatingInitialData)

  const { isLoading: isMutationLoading, mutate: rateDocumentationMutate } = trpc.documentation.rateDocumentation.useMutation()
  const { status } = useSession()

  const rateDocumentHandler = (amount: 1 | 2 | 3 | 4 | 5) => {
    return rateDocumentationMutate(
      {
        documentationId: data!.documentationId,
        value: amount
      },
      {
        onSuccess: (data) => {
          setAvg(data.updatedRatingSummary.avg)
          setCurrentUserRating(data.newRating)
          // do some message here
        },
        onError: async (e) => setErrorMessage(e.message)
      })
  }
  return (<div className='flex flex-col items-center'>
    <div className='flex'>
      {status === 'authenticated' &&
        <div className='min-w-[140px] flex justify-center'>
          {
            isMutationLoading ? <Loader /> : [1, 2, 3, 4, 5].map((item) => {
              const value = item as 1 | 2 | 3 | 4 | 5
              return <button
                key={value}
                disabled={!!currentUserRating.length}
                onMouseEnter={() => setHoverIndex(value)}
                onMouseLeave={() => setHoverIndex(null)}
                onClick={() => rateDocumentHandler(value)}
                className='px-1'
              >
                <Star
                  rating={currentUserRating[0]?.value}
                  value={value}
                  hoverIndex={hoverIndex} />
              </button>
            })}
        </div>
      }
      <div className='min-w-[70px] w-fit font-semibold'>
        {avg ? avg.toFixed(2) : 0}
      </div>
    </div>
    <div >{errorMessage}</div>
  </div >
  )
}

export default Rating