import { PRODUCTS_END_POINT, DEFAULT_PAGE_SIZE } from '../../config';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { useGlobalFilter, useSortBy, useTable } from 'react-table';
import { GlobalFilter } from './globalFilter';
// import { mockProducts } from './mocks';
import { isEven, upperCaseFirst } from '../../utils';
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableData,
  Button,
} from './ui';

export function Products(props) {
  const [products, setProducts] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);

  const fetchData = async ({ state }) => {
    console.log({ state });
    const sortQuery = state.sortBy
      ? `&sort=${state.sortBy.desc ? 'desc' : 'asc'}`
      : '';
    const response = await axios.get(
      `${PRODUCTS_END_POINT}?limit=${DEFAULT_PAGE_SIZE}${sortQuery}`
    );
    return response?.data || [];
  };

  const data = useMemo(() => [...products], [products]);
  const columns = useMemo(
    () =>
      products[0]
        ? Object.keys(products[0]) // use the fields of the first object
            .filter((key) => key !== 'rating')
            .map((key) => {
              if (key === 'image')
                return {
                  Header: upperCaseFirst(key),
                  accessor: key,
                  Cell: ({ value }) => <img src={value} />,
                  maxWidth: 70,
                };

              return {
                Header: upperCaseFirst(key),
                accessor: key,
              };
            })
        : [],
    [products]
  );

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
      manualSortBy: true,
    },
    useGlobalFilter,
    tableHooks,
    useSortBy
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
