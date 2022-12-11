'use client'
import React, { useMemo, useState } from 'react'
import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
} from '@tanstack/react-table'
import { DocumentatnioWithVotes } from '../../types/Documentation'
import { trpc } from '../../utils/trpc'
import Vote from './Vote'
import ApproveOrDecline from './ApproveOrDecline'
import LanguageIcon from '../../components/common/LanguageIcon'
import Link from 'next/link'

const columnHelper = createColumnHelper<DocumentatnioWithVotes>()

const PendingProposals = () => {
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 8
  })

  const {
    data: proposalsData,
    isFetched: isProposalsFetched,
    isLoading: isProposalsLoading,
    refetch: refetchTable,
  } = trpc.documentation.getPendingProposals.useQuery({ pageIndex, pageSize }, {
    keepPreviousData: true,
    initialData: {
      totalPages: 1,
      pendingProposals: []
    }
  })

  const columns = useMemo(() => [
    columnHelper.accessor('language', {
      cell: info => <LanguageIcon language={info.getValue()} />,
      header: () => ''
    }),
    columnHelper.accessor('name', {
      cell: info => info.getValue(),
      header: () => 'Name'
    }),
    columnHelper.accessor('description', {
      cell: info => info.getValue(),
      header: () => 'Description',
    }),
    columnHelper.accessor('linkToDocs', {
      header: () => 'Link to docs',
      cell: info => <Link
        target={'_blank'}
        href={info.getValue()}
        className='text-purple-400'
      >
        here
      </Link>,
    }),
    columnHelper.accessor('packageName', {
      header: () => 'NPM name',
      cell: info => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor('docVersion', {
      header: () => 'Docs Version',
      cell: info => info.getValue(),
      enableSorting: true,
    }),
    columnHelper.accessor('votes', {
      header: () => 'Votes',
      cell: info => <Vote refetchTable={refetchTable} proposalId={info.row.original.id} initialValue={info.getValue()} />,
      enableSorting: true,
    }),
    columnHelper.display({
      id: 'approve',
      cell: props => <div className='flex justify-around'>
        <ApproveOrDecline refetchTable={refetchTable} proposalId={props.row.original.id} />
      </div>,
      header: () => 'Approve'
    })
  ], [])

  const table = useReactTable({
    data: proposalsData?.pendingProposals ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: proposalsData?.totalPages ?? 1,
    state: {
      pagination: {
        pageSize,
        pageIndex
      }
    }
  })

  return (<div className='flex flex-col self-start gap-3 p-3 items-center w-full'>
    <div className='rounded-3xl overflow-hidden w-full max-w-7xl bg-[#00fffc0a]'>
      <div className='max-h-[60vh] overflow-auto p-3 '>
        <table className=' text-slate-300 w-full '>
          <thead className='sticky top-0'>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className='  backdrop-blur-sm'>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className={`${['description', 'name'].includes(header.id) ? 'text-left' : 'text-center'} bg-[#a855f760] first:rounded-l-2xl last:rounded-r-2xl backdrop-brightness-50 lg:text-lg font-medium p-2`}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isProposalsFetched ? table.getRowModel().rows.map(row => (
              <tr key={row.id} className='border-t-[1px] first:border-0 border-t-slate-600'>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className={`${['description', 'name'].includes(cell.column.id) ? '' : 'text-center'} p-3`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
              : <tr><td>Loading..</td></tr>
            }
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

export default PendingProposals