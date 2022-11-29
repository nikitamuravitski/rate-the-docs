'use client'
import React, { useEffect } from 'react'
import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
} from '@tanstack/react-table'
import { Proposal } from '../../types/Proposal'
import { trpc } from '../../utils/trpc'
import Vote from './Vote'
import ApproveOrDecline from './ApproveOrDecline'

interface ProposalRow extends Proposal { id: string, votes: number }

const defaultData: ProposalRow[] = [
  {
    id: '',
    name: '',
    description: '',
    linkToDocs: '',
    npmPackageName: '',
    version: '',
    votes: 0,
  },
]

const columnHelper = createColumnHelper<ProposalRow>()

const columns = [
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
    cell: info => <a href={info.getValue()} className='text-purple-400'>here</a>,
  }),
  columnHelper.accessor('npmPackageName', {
    header: () => 'NPM name',
    cell: info => info.getValue(),
    enableSorting: true,
  }),
  columnHelper.accessor('version', {
    header: () => 'Version',
    cell: info => info.getValue(),
    enableSorting: true,
  }),
  columnHelper.accessor('votes', {
    header: () => 'Votes',
    cell: info => <Vote proposalId={info.row.original.id} initialValue={info.getValue()} />,
    enableSorting: true,
  }),

  columnHelper.display({
    id: 'approve',
    cell: props => <div className='flex justify-around'>
      <ApproveOrDecline proposalId={props.row.original.id} />
    </div>,
    header: () => 'Approve'
  })
]

const PendingProposals = () => {
  const [data, setData] = React.useState(() => [...defaultData])
  const { data: fetchedProposals, isFetched: isProposalsFetched, isLoading: isProposalsLoading } = trpc.proposals.getProposals.useQuery()
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })
  useEffect(() => {
    if (!isProposalsLoading && isProposalsFetched && fetchedProposals) {
      return setData(fetchedProposals)
    }
  }, [isProposalsLoading, isProposalsFetched])

  return (<div className='rounded-xl overflow-hidden self-start w-full max-w-7xl m-3 bg-[#00fffc0a]'>
    <div className='max-h-[70vh] overflow-auto p-3'>
      <table className=' text-slate-300 w-full '>
        <thead className='sticky top-0'>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className='bg-gradient-to-r from-[#00dade60] to-[#a855f760] backdrop-blur-sm '>
              {headerGroup.headers.map(header => (
                <th key={header.id} className={`${['description', 'name'].includes(header.id) ? 'text-left' : 'text-center'} first:rounded-l-lg last:rounded-r-lg backdrop-brightness-50 text-lg font-medium p-5`}>
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
                <td key={cell.id} className={`${['description', 'name'].includes(cell.column.id) ? '' : 'text-center'} p-5`}>
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
  )
}

export default PendingProposals