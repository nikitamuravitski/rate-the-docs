import React, { useMemo, useState } from 'react'
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  SortingState,
} from '@tanstack/react-table'
import { Language } from '../../types/Documentation'
import { trpc } from '../../utils/trpc'
import Rating from './Rating'
import LanguageIcon from '../../components/common/LanguageIcon'
import Table from '../../components/common/Table/Table'
import Pagination from '../../components/common/Table/Pagination'
import SearchBar from '../../components/common/SearchBar'
import { useDebounce } from '../../hooks/useDebounce'
import Link from 'next/link'
import type { Prisma } from '@prisma/client'

const columnHelper = createColumnHelper<Prisma.DocumentationGetPayload<{
  include: {
    ratingSummary: true,
    ratings: true
  }
}>>()

const Ratings = () => {
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 8
  })
  const [sorting, setSorting] = useState<SortingState>([
    { desc: true, id: 'name' }
  ])
  const [languageFilter, setLanguageFilter] = useState<Language | undefined>()
  const [searchFilter, setSearchFilter] = useState<string>('')
  const debouncedSearchFilter = useDebounce(searchFilter, 300)

  const documentation = trpc.documentation.getDocumentation.useQuery(
    {
      searchFilter: debouncedSearchFilter,
      direction: sorting[0]!.desc ? 'desc' : 'asc',
      field: sorting[0]!.id,
      pageIndex,
      pageSize,
      language: languageFilter
    })

  const columns = useMemo(() => [
    columnHelper.accessor('language', {
      header: () => '',
      cell: info => <LanguageIcon language={info.getValue()} />,
      enableSorting: false,
    }),
    columnHelper.accessor('name', {
      sortDescFirst: true,
      cell: info => info.getValue(),
      header: () => 'Name'
    }),
    columnHelper.accessor('description', {
      cell: info => <p className='text-gray-400'>{info.getValue()}</p>,
      header: () => 'Description',
      enableSorting: false,
    }),
    columnHelper.display({
      id: 'links',
      header: 'Links',
      cell: (info) => {
        return <div className='flex gap-3 justify-center'>
          <Link
            className='hover:scale-110 transition-transform'
            href={info.row.original.linkToDocs || '/'}
            target={'_blank'}
          >
            <svg className='fill-gray-400 hover:fill-white' stroke='white' fill='white' xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox='0 0 511 511' version="1.1" >
              <path d="M454.962,110.751c-0.018-0.185-0.05-0.365-0.081-0.545c-0.011-0.06-0.016-0.122-0.028-0.182   c-0.043-0.215-0.098-0.425-0.159-0.632c-0.007-0.025-0.012-0.052-0.02-0.077c-0.065-0.213-0.141-0.421-0.224-0.625   c-0.008-0.021-0.015-0.043-0.023-0.064c-0.081-0.195-0.173-0.384-0.269-0.57c-0.016-0.031-0.029-0.063-0.045-0.094   c-0.093-0.173-0.196-0.339-0.301-0.504c-0.027-0.042-0.049-0.086-0.077-0.127c-0.103-0.154-0.216-0.3-0.33-0.446   c-0.037-0.048-0.07-0.098-0.109-0.145c-0.142-0.173-0.294-0.338-0.451-0.498c-0.015-0.015-0.027-0.031-0.042-0.046l-104-104   c-0.018-0.018-0.038-0.033-0.057-0.051c-0.156-0.153-0.317-0.301-0.486-0.44c-0.055-0.045-0.113-0.083-0.169-0.126   c-0.138-0.107-0.275-0.214-0.42-0.311c-0.051-0.034-0.105-0.062-0.156-0.095c-0.156-0.099-0.312-0.197-0.475-0.284   c-0.036-0.019-0.074-0.035-0.111-0.053c-0.181-0.093-0.365-0.183-0.554-0.262c-0.024-0.01-0.049-0.017-0.074-0.027   c-0.202-0.081-0.406-0.157-0.616-0.221c-0.027-0.008-0.054-0.013-0.081-0.021c-0.206-0.06-0.415-0.115-0.628-0.158   c-0.063-0.013-0.128-0.018-0.192-0.029c-0.177-0.031-0.354-0.062-0.536-0.08C344.001,0.013,343.751,0,343.5,0h-248   C73.72,0,56,17.72,56,39.5v432c0,21.78,17.72,39.5,39.5,39.5h320c21.78,0,39.5-17.72,39.5-39.5v-360   C455,111.249,454.987,110.999,454.962,110.751z M351,25.606L429.394,104H375.5c-13.509,0-24.5-10.99-24.5-24.5V25.606z M415.5,496   h-320C81.991,496,71,485.01,71,471.5v-432C71,25.99,81.991,15,95.5,15H336v64.5c0,21.78,17.72,39.5,39.5,39.5H440v352.5   C440,485.01,429.009,496,415.5,496z" />
              <path d="M207.5,344h-88c-4.142,0-7.5,3.357-7.5,7.5s3.358,7.5,7.5,7.5h88c4.142,0,7.5-3.357,7.5-7.5S211.642,344,207.5,344z" />
              <path d="M391.5,296h-272c-4.142,0-7.5,3.357-7.5,7.5s3.358,7.5,7.5,7.5h272c4.142,0,7.5-3.357,7.5-7.5S395.642,296,391.5,296z" />
            </svg>
          </Link>
          {info.row.original.linkToRepo ?
            <Link
              className='hover:scale-110 transition-transform'
              href={info.row.original.linkToRepo || '/'}
              target={'_blank'}
            >
              <svg xmlns="http://www.w3.org/2000/svg"
                width="25px"
                height="25px"
                className='fill-yellow-800 hover:fill-orange-400'
                viewBox="0 0 92 92"
              >
                <defs>
                  <clipPath id="a">
                    <path d="M0 .113h91.887V92H0Zm0 0" />
                  </clipPath>
                </defs>
                <g clipPath="url(#a)">
                  <path style={{ stroke: 'none', fillRule: 'nonzero', fillOpacity: 1 }} d="M90.156 41.965 50.036 1.848a5.918 5.918 0 0 0-8.372 0l-8.328 8.332 10.566 10.566a7.03 7.03 0 0 1 7.23 1.684 7.034 7.034 0 0 1 1.669 7.277l10.187 10.184a7.028 7.028 0 0 1 7.278 1.672 7.04 7.04 0 0 1 0 9.957 7.05 7.05 0 0 1-9.965 0 7.044 7.044 0 0 1-1.528-7.66l-9.5-9.497V59.36a7.04 7.04 0 0 1 1.86 11.29 7.04 7.04 0 0 1-9.957 0 7.04 7.04 0 0 1 0-9.958 7.06 7.06 0 0 1 2.304-1.539V33.926a7.049 7.049 0 0 1-3.82-9.234L29.242 14.272 1.73 41.777a5.925 5.925 0 0 0 0 8.371L41.852 90.27a5.925 5.925 0 0 0 8.37 0l39.934-39.934a5.925 5.925 0 0 0 0-8.371" />
                </g>
              </svg>
            </Link>
            : null
          }
        </div>
      }
    }),
    columnHelper.accessor('ratingSummary', {
      header: () => 'Rating',
      cell: info => <Rating key={info.row.original.id} data={info.getValue()} currentUserRating={info.row.original.ratings} />,
    })
  ], [])

  const table = useReactTable({
    data: documentation.data?.documentation ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    pageCount: documentation.data?.totalPages ?? 0,
    manualSorting: true,
    state: {
      sorting,
      pagination: {
        pageSize,
        pageIndex
      }
    }
  })

  return (<div className='flex flex-col w-full p-3 gap-3 items-center self-start '>
    <SearchBar
      onSearch={(value) => setSearchFilter(value)}
      search={searchFilter}
      onChooseLanguage={(lang) => setLanguageFilter(lang)}
      currentLanguage={languageFilter}
    />
    <Table isLoading={documentation.isLoading} table={table} />
    <Pagination table={table} pageIndex={pageIndex} pageSize={pageSize} setPagination={setPagination} />
  </div>
  )
}

export default Ratings