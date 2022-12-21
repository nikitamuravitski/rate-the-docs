import React, { useEffect, useMemo, useState } from 'react'
import cc from 'classcat'
import { trpc } from '../../utils/trpc'
import { Prisma } from '@prisma/client'
import LanguageIcon from '../../components/common/LanguageIcon'
import styles from './style.module.css'
import Rating from './Rating'
import Loader from '../../components/common/Loader'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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


  const chartData = useMemo(() => {
    const choosenData = selectedVersion ? queryData?.find(doc => doc.majorVersion === selectedVersion) : data?.ratingSummary
    return [
      {
        name: 'One',
        value: choosenData?.one
      },
      {
        name: 'Two',
        value: choosenData?.two
      },
      {
        name: 'Three',
        value: choosenData?.three
      },
      {
        name: 'Four',
        value: choosenData?.four
      },
      {
        name: 'Five',
        value: choosenData?.five
      }
    ]
  }, [data?.id, selectedVersion, queryData])

  return (
    <div
      className={cc({
        'rounded-xl overflow-hidden shadow-2xl w-full backdrop-blur-lg bg-[#063b2815] transition-all duration-500 text-white': true,
        'max-w-0 opacity-0 p-0 m-0': !data,
        'max-w-[400px] opacity-100 p-5 m-3': !!data
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
            selectedVersion !== null ?
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
              </div> :
              <div>
                Your average:{' '}
                {(data.ratings && data.ratings.length && data.ratings.reduce((acc, cur) => acc += cur.value, 0) / data.ratings.length).toFixed(2)}
              </div>
          }
          <div className='flex'>
            Average: {isFetching ? <Loader /> : selectedVersion !== null ? queryData?.find(item => item.majorVersion === selectedVersion)!.avg.toFixed(2) : data.ratingSummary?.avg.toFixed(2)}{' '}
          </div>
          <ResponsiveContainer width='100%' height={200} >
            <BarChart data={chartData} margin={{ left: 0 }} layout="vertical">
              <Tooltip
                labelFormatter={(label, payload) => ''}
                separator=''
                formatter={(value) => [value, '']}
                itemStyle={{ color: 'white' }}
                cursor={{ fill: '#ffffff10' }}
                contentStyle={{ background: 'transparent', border: 'none', }}
                wrapperStyle={{ backgroundColor: '#ffffff30', backdropFilter: 'blur(15px)', outline: 'none', borderRadius: 20, boxShadow: '0 5px 40px 5px #00000010' }}
              />
              <XAxis hide={true} tickLine={false} type='number' />
              <YAxis tickLine={false} dataKey="name" type='category' />
              <Bar dataKey="value" fill="rgb(1,105,161)" format={''} />
            </BarChart>
          </ResponsiveContainer>
          {/* <div>
            Comments:
            Show comment section here
          </div> */}
        </div>
      }
    </div>
  )
}

export default SidePanel