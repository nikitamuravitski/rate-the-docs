import { PaginationState, Table } from '@tanstack/react-table'
import React from 'react'

const Pagination = ({
  table,
  setPagination,
  pageSize,
  pageIndex,
}: {
  pageSize: number,
  pageIndex: number
  table: Table<any>,
  setPagination(value: PaginationState): void
}) => {
  return <div className='text-white flex gap-3'>
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
}

export default Pagination