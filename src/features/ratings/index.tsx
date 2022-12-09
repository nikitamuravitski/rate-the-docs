import React, { useMemo, useState } from 'react'
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  SortingState,
} from '@tanstack/react-table'
import { DocumentationWithRatings, Language } from '../../types/Documentation'
import { trpc } from '../../utils/trpc'
import Rate from './Rate'
import LanguageIcon from '../../components/common/LanguageIcon'
import Table from '../../components/common/Table/Table'
import Pagination from '../../components/common/Table/Pagination'
import SearchBar from '../../components/common/SearchBar'
import { useDebounce } from '../../hooks/useDebounce'

const columnHelper = createColumnHelper<DocumentationWithRatings>()

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
    },
    {
      keepPreviousData: true,
      initialData: {
        totalPages: 1,
        documentation: []
      },
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
    columnHelper.accessor('ratings', {
      header: () => 'Rating',
      cell: info => <Rate key={info.row.original.id} documentationId={info.row.original.id} initialData={info.getValue()} />,
    })
  ], [])

  const table = useReactTable({
    data: documentation.data?.documentation || [],
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
    <Table table={table} />
    <Pagination table={table} pageIndex={pageIndex} pageSize={pageSize} setPagination={setPagination} />
  </div>
  )
}

export default Ratings