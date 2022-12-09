import React, { useMemo, useState } from 'react'
import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  SortingState,
} from '@tanstack/react-table'
import { DocumentationWithRatings } from '../../types/Documentation'
import { trpc } from '../../utils/trpc'
import Rate from './Rate'
import LanguageIcon from '../../components/common/LanguageIcon'

const columnHelper = createColumnHelper<DocumentationWithRatings>()

const Ratings = () => {
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 8
  })
  const [sorting, setSorting] = useState<SortingState>([
    { desc: true, id: 'name' }
  ])

  const documentation = trpc.documentation.getDocumentation.useQuery(
    {
      direction: sorting[0]!.desc ? 'desc' : 'asc',
      field: sorting[0]!.id,
      pageIndex,
      pageSize
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
    <div className='rounded-xl overflow-hidden  w-full max-w-7xl m-3 bg-[#00fffc0a]'>
      <div className='max-h-[70vh] overflow-auto p-3'>
        <table className=' text-slate-300 w-full '>
          <thead className='sticky top-0'>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className='bg-gradient-to-r from-[#00dade60] to-[#a855f760] backdrop-blur-sm '>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className={`${['description', 'name'].includes(header.id) ? 'text-left' : 'text-center'} first:rounded-l-lg last:rounded-r-lg backdrop-brightness-50 text-lg font-medium p-5`}>
                    {header.isPlaceholder
                      ? null
                      : <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string]}
                      </div>
                    }
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className='border-t-[1px] first:border-0 border-t-slate-600'>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className={`${['description', 'name'].includes(cell.column.id) ? '' : 'text-center'} p-5`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            )
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* pagination */}

    <div className='text-white flex gap-3'>
      <span>Total pages: {table.getPageCount()}</span>
      <span>Page: {pageIndex + 1}</span>
      Show: <select
        className='bg-slate-600'
        value={pageSize}
        onChange={e => {
          setPagination({
            pageIndex,
            pageSize: +e.target.value
          })
        }}
      >
        {
          [8, 20, 30, 40, 50].map(value => <option key={value} value={value}>{value}</option>)
        }
      </select>
      <button
        disabled={!table.getCanPreviousPage()}
        onClick={() => setPagination({
          pageSize,
          pageIndex: pageIndex - 1,
        })}>
        {'<'}
      </button>
      <button
        disabled={!table.getCanNextPage()}
        onClick={() => setPagination({
          pageSize,
          pageIndex: pageIndex + 1,
        })}>
        {'>'}
      </button>
    </div>
  </div>
  )
}

export default Ratings