import React, { useEffect, useState } from 'react'
import cc from 'classcat'
import { trpc } from '../../utils/trpc'
import { Prisma } from '@prisma/client'
import LanguageIcon from '../../components/common/LanguageIcon'
import styles from './style.module.css'
import Rating from './Rating'
import Loader from '../../components/common/Loader'

const SidePanel = ({
  data,
  refetchDocumentation
}: {
  data: Prisma.DocumentationGetPayload<{ include: { ratingSummary: true, ratings: true } }> | null,
  refetchDocumentation(): void
}) => {

  const [isFirstDataFetch, setIsFirtsDataFetch] = useState(true)
  const [selectedVersion, setSelectedVersion] = useState<null | number>(null)

  const { data: queryData, refetch: refetchRatings, isFetching } = trpc.documentation.getDocumentationRatings.useQuery(
    { id: data?.id },
    {
      enabled: !!data
    })

  useEffect(() => {
    setIsFirtsDataFetch(true)
    setSelectedVersion(null)
  }, [data?.id])

  useEffect(() => {
    if (isFirstDataFetch && queryData && queryData[0]) {
      setIsFirtsDataFetch(false)
      setSelectedVersion(queryData[0].majorVersion)
    }
  }, [queryData, selectedVersion])



  return (
    <div
      className={cc({
        'rounded-xl overflow-hidden shadow-2xl w-full max-w-7xl m-3 backdrop-blur-lg p-5 bg-[#063b2815] transition-all duration-500 text-white': true,
        'max-w-0 opacity-0': !data,
        'max-w-[400px] opacity-100': !!data
      })}
    >
      {data &&
        <div className='flex flex-col gap-3'>
          <div className='flex items-center gap-4'>
            <LanguageIcon language={data.language} />
            <h2 className='text-lg text-purple-100'>{data.name}</h2>
          </div>
          <ul className={styles['versionList']}>
            <li
              className={
                cc({
                  'bg-sky-700': selectedVersion === null
                })
              }
              onClick={() => setSelectedVersion(null)}>All</li>
            {
              queryData &&
              queryData.length &&
              queryData.map(version => {
                return <li
                  className={cc({
                    'bg-sky-700': version.majorVersion === selectedVersion
                  })}
                  key={version.id}
                  onClick={() => setSelectedVersion(version.majorVersion)}
                >
                  {`v${version.majorVersion}`}
                </li>
              })}
          </ul>
          {
            selectedVersion !== null &&
            <div className='flex gap-4'>
              Your rating:
              <Rating
                refetch={async () => {
                  await refetchRatings()
                  refetchDocumentation()
                }}
                version={selectedVersion}
                data={queryData?.find(item => item.majorVersion === selectedVersion)}
              />
            </div>
          }
          <div className='flex'>
            Average: {isFetching ? <Loader /> : selectedVersion !== null ? queryData?.find(item => item.majorVersion === selectedVersion)!.avg.toFixed(2) : data.ratingSummary?.avg.toFixed(2)}{' '}
          </div>
          <p>Show detailed graph here</p>
          <div>
            Comments:
            Show comment section here
          </div>
        </div>
      }
    </div>
  )
}

export default SidePanel