import React from 'react'
import {
  useReactTable,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
} from '@tanstack/react-table'
import { Documentation } from '../../types/Documentation'

const defaultData: Documentation[] = [
  {
    name: 'React',
    description: 'JavaScript library for rendering components',
    currentVersion: '18.0.1',
    rating: 4.11
  },
  {
    name: 'Material UI',
    description: 'Components library for React',
    currentVersion: '4.1.2',
    rating: 3.11
  },
  {
    name: 'Styled-Components',
    description: 'JSS library for creating styles using JavaScript',
    currentVersion: '3.1.2',
    rating: 4.02
  },
  {
    name: 'Tailwind CSS',
    description: 'Class based style system',
    currentVersion: '2',
    rating: 4.71
  },
  {
    name: 'React',
    description: 'JavaScript library for rendering components',
    currentVersion: '18.0.1',
    rating: 4.11
  },
  {
    name: 'Material UI',
    description: 'Components library for React',
    currentVersion: '4.1.2',
    rating: 3.11
  },
  {
    name: 'Styled-Components',
    description: 'JSS library for creating styles using JavaScript',
    currentVersion: '3.1.2',
    rating: 4.02
  },
  {
    name: 'Tailwind CSS',
    description: 'Class based style system',
    currentVersion: '2',
    rating: 4.71
  },
  {
    name: 'React',
    description: 'JavaScript library for rendering components',
    currentVersion: '18.0.1',
    rating: 4.11
  },
  {
    name: 'Material UI',
    description: 'Components library for React',
    currentVersion: '4.1.2',
    rating: 3.11
  },
  {
    name: 'Styled-Components',
    description: 'JSS library for creating styles using JavaScript',
    currentVersion: '3.1.2',
    rating: 4.02
  },
  {
    name: 'Tailwind CSS',
    description: 'Class based style system',
    currentVersion: '2',
    rating: 4.71
  },
]

const columnHelper = createColumnHelper<Documentation>()

const columns = [
  columnHelper.accessor('name', {
    cell: info => info.getValue(),
    header: () => 'Name'
  }),
  columnHelper.accessor('description', {
    cell: info => info.getValue(),
    header: () => 'Description',
  }),
  columnHelper.accessor('currentVersion', {
    header: () => 'Current Version',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('rating', {
    header: () => 'Rating',
    cell: info => info.getValue(),
    enableSorting: true,
  })
]

const index = () => {
  const [data, setData] = React.useState(() => [...defaultData])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })
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
  )
}

export default index