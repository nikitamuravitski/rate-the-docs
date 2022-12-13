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
      cell: info => info.getValue(),
      header: () => 'Description',
      enableSorting: false,
    }),
    columnHelper.accessor('docVersion', {
      cell: info => info.getValue(),
      header: () => 'Doc version',
      enableSorting: false,
    }),
    columnHelper.accessor('linkToDocs', {
      cell: info => <Link
        target={'_blank'}
        href={info.getValue()}
        className='text-purple-400'
      >
        here
      </Link>,
      header: () => 'Link',
      enableSorting: false,
    }),
    columnHelper.accessor('ratingSummary', {
      header: () => 'Rating',
      cell: info => <Rating key={info.row.original.id} data={info.getValue()} currentUserRating={info.row.original.ratings} />,
    })
  ], [])

  const table = useReactTable({
    data: documentation.data?.documentation!,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    pageCount: documentation.data?.totalPages ?? 1,
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