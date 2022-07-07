import React from 'react';
import {
  useGlobalFilter,
  useSortBy,
  useTable,
  useResizeColumns,
} from 'react-table';
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

function Table({ data, columns }) {
  const [products, setProducts] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);

  const tableHooks = (hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        id: 'Edit',
        Header: 'Edit',
        Cell: ({ row }) => (
          <Button
            className=" hover:bg-blue-200"
            onClick={() => alert('Editing Id: ' + row.values.id)}>
            ✎
          </Button>
        ),
      },
      {
        id: 'Delete',
        Header: 'Delete',
        Cell: ({ row }) => (
          <Button
            className="  hover:bg-red-200"
            onClick={() => alert('Deleting Id: ' + row.values.id)}>
            🗑
          </Button>
        ),
      },
    ]);
  };

  const tableInstance = useTable(
    {
      columns,
      data,
      manualSortBy: false,
    },
    useGlobalFilter,
    tableHooks,
    useSortBy,
    useResizeColumns
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    preGlobalFilteredRows,
    setGlobalFilter,
    state,
  } = tableInstance;

  React.useEffect(() => {
    setLoading(true);
    fetchData({ state })
      .then((response) => {
        setProducts(response);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [state.sortBy]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading ...
      </div>
    );
  }

  return (
    <>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        setGlobalFilter={setGlobalFilter}
        globalFilter={state.globalFilter}
      />
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
