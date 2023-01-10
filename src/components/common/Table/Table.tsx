import React from 'react'
import { CoreRow, flexRender, Row, Table } from '@tanstack/react-table'
import Loader from '../Loader'
import Link from 'next/link'
import cc from 'classcat'

const Table = (
  { table, isLoading, isProposal = false, onRowClickHandler }
    :
    {
      table: Table<any>,
      isLoading: boolean,
      isProposal?: boolean,
      onRowClickHandler?(row: any): void
    }
) => {
  return (
    <div className='rounded-xl overflow-hidden shadow-2xl w-full max-w-7xl m-3 backdrop-blur-lg bg-[#063b2815]'>
      <div className='max-h-[70vh] overflow-auto p-3'>
        <table className=' text-slate-300 w-full'>
          <thead className='sticky top-0'>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className='bg-gradient-to-r from-[#9333ea50] to-[#0284c780]'>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className={`${['description', 'name'].includes(header.id) ? 'text-left' : 'text-center'} first:rounded-l-lg last:rounded-r-lg text-md text-slate-200 font-medium p-5`}>
                    {header.isPlaceholder
                      ? null
                      : <div
                        className={cc({
                          'cursor-pointer select-none whitespace-nowrap': header.column.getCanSort()
                        })}
                        onClick={header.column.getToggleSortingHandler()}
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
                    <tr
                      onClick={(e) => onRowClickHandler && onRowClickHandler(row.original)}
                      key={row.id}
                      className={
                        cc({
                          'border-t-[1px] first:border-0 border-t-slate-600 hover:bg-[#ffffff09]': true,
                          'cursor-pointer': !!onRowClickHandler
                        })

                      }
                    >
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className={`${['description', 'name'].includes(cell.column.id) ? '' : 'text-center'} p-5`}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                  : isProposal ? <tr>
                    <td colSpan={20}>
                      <div className='flex flex-col gap-3 p-3 items-center text-slate-300'>
                        No Proposals
                      </div>
                    </td>
                  </tr> : <tr><td colSpan={20}>
                    <div className='flex flex-col gap-3 p-3 items-center text-slate-300'>
                      <p className='text-2xl font-semibold text-transparent drop-shadow-xl bg-clip-text bg-gradient-to-r  from-blue-400 to-purple-300 w-fit'>
                        Wow!
                      </p>
                      <p>Seems like there are no results.</p>
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
