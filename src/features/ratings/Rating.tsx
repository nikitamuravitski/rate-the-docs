import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import Loader from '../../components/common/Loader'
import { trpc } from '../../utils/trpc'
import Star from '../../components/common/Star/Star'
import { Prisma } from '@prisma/client'


type RateComponent = {
  version: number | null,
  data: Prisma.RatingSummaryByVersionGetPayload<{ include: { ratings: true } }> | undefined,
  refetch(): void
}

const Rating = ({
  version,
  data,
  refetch
}: RateComponent) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const { isLoading: isMutationLoading, mutate: rateDocumentationMutate } = trpc.documentation.rateDocumentation.useMutation()
  const { status } = useSession()

  const rateDocumentHandler = (amount: 1 | 2 | 3 | 4 | 5) => {
    return rateDocumentationMutate(
      {
        documentationVersion: version!,
        documentationId: data!.documentationId,
        ratingSummaryByVersionId: data!.id,
        value: amount
      },
      {
        onSuccess: (data) => {
          setHoverIndex(null)
          refetch()
          // do some message here
        },
        onError: async (e) => setErrorMessage(e.message)
      })
  }

  useEffect(() => {

  }), [version]
  return (<div className='flex flex-col items-center'>
    <div className='flex'>
      {version !== null &&
        <div className='min-w-[140px] flex justify-center'>
          {
            isMutationLoading ? <Loader /> : [1, 2, 3, 4, 5].map((item) => {
              const value = item as 1 | 2 | 3 | 4 | 5
              return <button
                key={value}
                disabled={!!data?.ratings && !!data.ratings.length}
                onMouseEnter={() => setHoverIndex(value)}
                onMouseLeave={() => setHoverIndex(null)}
                onClick={() => rateDocumentHandler(value)}
                className='px-1'
              >
                <Star
                  rating={data?.ratings && data.ratings.length && data.ratings[0]?.value}
                  value={value}
                  hoverIndex={hoverIndex} />
              </button>
            })}
        </div>
      }
    </div>
    <div >{errorMessage}</div>
  </div >
  )
}

export default Rating