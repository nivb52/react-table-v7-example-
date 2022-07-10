import {
  PRODUCTS_END_POINT,
  PAGES_COUNT,
  DEFAULT_PAGE_SIZE,
} from '../../config';
import axios from 'axios';
import React from 'react';

import { GlobalFilter } from './globalFilter';
import { mockPoeple } from './mocks';
import { isEven, upperCaseFirst } from '../../utils';

import {
  TableHandler,
  useTableHandler,
  TableContext,
  TPagination,
  THead,
  TBody,
} from '../table';

import { Table as TableUI, Button } from './ui';

export function UsersDataset() {
  const [users, setUsers] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);

  const fetchData = React.useCallback(async ({ state }) => {
    console.log('fetching ... ');
    console.log({ state });

    // const sortQuery = state.sortBy
    //   ? `&sort=${state.sortBy.desc ? 'desc' : 'asc'}`
    //   : '';
    const start = 0; //(state.queryPageIndex || 0) * state.queryPageSize;
    const end = 10; // (state.queryPageIndex || 0) * state.queryPageSize + 10;
    // console.log({ start, end });
    const response = {
      data: mockPoeple.slice(start, end),
    };
    //   await axios.get(
    //   `${PRODUCTS_END_POINT}?limit=${DEFAULT_PAGE_SIZE}${sortQuery}`
    // );
    return response?.data || [];
  }, []);

  const fetchDataWrapper = React.useCallback(
    (state = {}) => {
      setLoading(true);
      fetchData({ state })
        .then((response) => {
          setUsers(response);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [setUsers, setLoading]
  );

  const data = React.useMemo(() => [...users], [users]);
  const columns = React.useMemo(
    () =>
      users[0]
        ? Object.keys(users[0]) // use the fields of the first object
            .filter((key) => key !== 'rating')
            .map((key) => {
              if (key === 'image')
                return {
                  Header: upperCaseFirst(key),
                  accessor: key,
                  Cell: ({ value }) => <img width="80px" src={value} />,
                  maxWidth: 70,
                };

              return {
                Header: upperCaseFirst(key),
                accessor: key,
              };
            })
        : [],
    [users]
  );

  const useTableOptions = {
    columns,
    data,
    manualSortBy: false,
  };

  React.useEffect(() => {
    fetchDataWrapper();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading ...
      </div>
    );
  }

  return (
    <TableHandler useTableOptions={useTableOptions}>
      <UsersTable />
    </TableHandler>
  );
}

function UsersTable({ dispatch }) {
  const { getTableProps, reducerState } = useTableHandler();
  console.log('UsersTable', reducerState);

  return (
    <>
      {/* <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        setGlobalFilter={setGlobalFilter}
        globalFilter={state.globalFilter}
      /> */}
      <TableUI {...getTableProps()}>
        <THead></THead>
        <TBody></TBody>
      </TableUI>
      <TPagination />
    </>
  );
}
