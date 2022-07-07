import { PRODUCTS_END_POINT, DEFAULT_PAGE_SIZE } from '../../config';
import axios from 'axios';
import React from 'react';

import { GlobalFilter } from './globalFilter';
import { mockProducts, mockPoeple } from './mocks';
import { isEven, upperCaseFirst } from '../../utils';

import {
  TableHandler,
  useTableHandler,
  TableContext,
  THead,
  TBody,
} from '../table';

import { Table as TableUI, Button } from './ui';

const PAGE_CHANGED = 'PAGE_CHANGED';
const PAGE_SIZE_CHANGED = 'PAGE_SIZE_CHANGED';
const PAGE_SORT_CHANGED = 'PAGE_SORT_CHANGED';
const PAGE_FILTER_CHANGED = 'PAGE_FILTER_CHANGED';
const TOTAL_COUNT_CHANGED = 'TOTAL_COUNT_CHANGED';

export function UsersDataset() {
  const [users, setUsers] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);

  const fetchData = async ({ state }) => {
    console.log({ state });
    const sortQuery = state.sortBy
      ? `&sort=${state.sortBy.desc ? 'desc' : 'asc'}`
      : '';
    const response = { data: mockPoeple.slice(0, 50) };
    //   await axios.get(
    //   `${PRODUCTS_END_POINT}?limit=${DEFAULT_PAGE_SIZE}${sortQuery}`
    // );
    return response?.data || [];
  };

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
    setLoading(true);
    fetchData({ state: {} })
      .then((response) => {
        setUsers(response);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const reducer = (state, { type, payload }) => {
    console.log(`change of ${type} with payload:`);
    console.table(payload);
    switch (type) {
      case PAGE_CHANGED:
        return {
          ...state,
          queryPageIndex: payload,
        };
      case PAGE_SIZE_CHANGED:
        return {
          ...state,
          queryPageSize: payload,
        };
      case PAGE_SORT_CHANGED:
        return {
          ...state,
          queryPageSortBy: payload,
        };
      case PAGE_FILTER_CHANGED:
        return {
          ...state,
          queryPageFilter: payload,
        };
      case TOTAL_COUNT_CHANGED:
        return {
          ...state,
          totalCount: payload,
        };
      default:
        throw new Error(`Unhandled action type: ${type}`);
    }
  };
  const [actions, dispatch] = React.useReducer(reducer, {});

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading ...
      </div>
    );
  }

  return (
    <TableHandler useTableOptions={useTableOptions}>
      <UsersTable dispatch={dispatch} />
    </TableHandler>
  );
}

function UsersTable({ dispatch }) {
  const {
    getTableProps,
    canNextPage,
    nextPage,
    canPreviousPage,
    previousPage,
    state,
    gotoPage,
  } = useTableHandler();

  React.useEffect(() => {
    dispatch({ type: PAGE_SORT_CHANGED, payload: state.sortBy });
    gotoPage(0);
  }, [state.sortBy, gotoPage]);

  useEffect(() => {
    dispatch({ type: PAGE_CHANGED, payload: pageIndex });
  }, [pageIndex]);

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
      <div>
        <Button disabled={!canPreviousPage} onClick={() => previousPage()}>
          ⇽
        </Button>
        {Array.from({ length: canNextPage ? 10 : 0 }, (_, i) => (
          <Button key={i} onClick={() => nextPage()}>
            {i + 1}
          </Button>
        ))}
        <Button disabled={!canNextPage} onClick={() => nextPage()}>
          ⇾
        </Button>
      </div>
    </>
  );
}
