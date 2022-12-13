import React from 'react'
import { flexRender, Table } from '@tanstack/react-table'
import Loader from '../Loader'
import Link from 'next/link'

const Table = ({ table, isLoading }: { table: Table<any>, isLoading: boolean }) => {
  return (
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
            {isLoading
              ?
              <tr>
                <td colSpan={20} align='center' className='p-3'>
                  <Loader />
                </td>
              </tr>
              :
              <>
                {table.getRowModel().rows.length ?
                  table.getRowModel().rows.map(row => (
                    <tr key={row.id} className='border-t-[1px] first:border-0 border-t-slate-600 hover:backdrop-brightness-125'>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className={`${['description', 'name'].includes(cell.column.id) ? '' : 'text-center'} p-5`}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                  : <tr><td colSpan={20}>
                    <div className='flex flex-col gap-3 p-3 items-center text-slate-300'>
                      <p className='text-2xl font-semibold text-transparent drop-shadow-xl bg-clip-text bg-gradient-to-r  from-blue-400 to-purple-300 w-fit'>
                        Wow!
                      </p>
                      <p>Seems like there are no docs for this.</p>
                      <p>If you have time, please make a <Link href='/propose' className='text-purple-400' >proposal</Link></p>
                    </div>
                  </td>
                  </tr>
                }
              </>
            }

          </tbody>
        </table>
      </div>
    </div >
  )
}

export default Table
