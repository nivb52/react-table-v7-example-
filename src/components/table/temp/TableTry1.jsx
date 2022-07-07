import React from 'react';
import useTableWarpper from './useTableWarpper';
import { GlobalFilter } from './globalFilter';

import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableData,
  Button,
} from '../ui';

function Table({
  data,
  columns,
  dispatch,
  classNames = '',
  styles = {},
  isLoading,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
    state,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setSortBy,
    allColumns,
  } = useTableWarpper(columns, data);

  React.useEffect(() => {
    dispatch('state change');
  }, [state]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading ...
      </div>
    );
  }

  return (
    <>
      {/* <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        setGlobalFilter={setGlobalFilter}
        globalFilter={state.globalFilter}
      /> */}
      <Table {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableHeader
                  {...column.getResizerProps()}
                  {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {column.isSorted ? (column.isSortedDesc ? ' ▼' : ' ▲') : ''}
                </TableHeader>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rows.map((row, idx) => {
            prepareRow(row);
            return (
              <TableRow
                {...row.getRowProps()}
                className={isEven(idx) ? 'bg-green-400 bg-opacity-30' : ''}>
                {row.cells.map((cell, idx) => (
                  <TableData {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </TableData>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
}

export default Table;
