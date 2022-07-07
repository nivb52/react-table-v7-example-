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
  THead,
  TBody,
} from '../table';

import { Table as TableUI, Button } from './ui';

// REDUCER TYPES
const PAGE_CHANGED = 'PAGE_CHANGED';
const PAGE_SORT_CHANGED = 'PAGE_SORT_CHANGED';
const PAGE_FILTER_CHANGED = 'PAGE_FILTER_CHANGED';
const TOTAL_COUNT_CHANGED = 'TOTAL_COUNT_CHANGED';

const initialState = {
  queryPageIndex: 0,
  queryPageSize: 10,
  totalCount: 0,
  queryPageFilter: '',
  queryPageSortBy: [],
};

export function UsersDataset() {
  const [users, setUsers] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);

  const fetchData = React.useCallback(async ({ state }) => {
    console.log('fetching ... ');
    console.log({ state });

    // const sortQuery = state.sortBy
    //   ? `&sort=${state.sortBy.desc ? 'desc' : 'asc'}`
    //   : '';
    const start = (state.queryPageIndex || 0) * state.queryPageSize;
    const end = (state.queryPageIndex || 0) * state.queryPageSize + 10;
    console.log({ start, end });
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

  const reducer = (state, action) => {
    console.table(action.payload);
    switch (action.type) {
      case PAGE_CHANGED:
        return {
          ...state,
          queryPageIndex: action.payload,
        };
      case PAGE_SORT_CHANGED:
        return {
          ...state,
          queryPageSortBy: action.payload,
        };
      case PAGE_FILTER_CHANGED:
        return {
          ...state,
          queryPageFilter: action.payload,
        };
      case TOTAL_COUNT_CHANGED:
        return {
          ...state,
          totalCount: action.payload,
        };
      case 'JUST_A_DEBUG_CHANGE':
        return state;
      default:
        throw new Error(`Unhandled action type: ${action.type}`);
    }
  };
  const [
    {
      queryPageIndex,
      queryPageSize = DEFAULT_PAGE_SIZE,
      totalCount,
      queryPageFilter,
      queryPageSortBy,
    },
    dispatch,
  ] = React.useReducer(reducer, initialState);

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
    fetchDataWrapper({
      queryPageIndex,
      queryPageSize,
      totalCount,
      queryPageFilter,
      queryPageSortBy,
    });
  }, [queryPageIndex, totalCount]);

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
  const { getTableProps, nextPage, previousPage, pageIndex, state, gotoPage } =
    useTableHandler();

  const canNextPage = React.useCallback(
    (pageIndex) =>
      pageIndex < Math.ceil(state.totalCount / state.queryPageSize) - 1,
    [state.totalCount, state.queryPageSize]
  );
  const canPreviousPage = React.useCallback(
    (pageIndex) => pageIndex > 0,
    [state.totalCount, state.queryPageSize]
  );

  React.useEffect(() => {
    dispatch({ type: PAGE_SORT_CHANGED, payload: state.sortBy });
    gotoPage(0);
  }, [state.sortBy, gotoPage]);

  // React.useEffect(() => {
  //   console.log(PAGE_CHANGED, 'in React USE EFFECT');
  //   dispatch({ type: PAGE_CHANGED, payload: state.pageIndex });
  // }, [state.pageIndex]);

  //
  const gotoPageWrapper = React.useCallback(
    (pageIndex) => {
      dispatch({ type: PAGE_CHANGED, payload: pageIndex });
      gotoPage(pageIndex);
    },
    [gotoPage]
  );

  const nextPageWrapper = () => {
    const { pageIndex } = state;
    console.log('nextPageWrapper', pageIndex);
    // console.table(state);
    // if (!canNextPage(pageIndex)) return;
    gotoPageWrapper(pageIndex + 1);
  };

  const previousPageWrapper = () => {
    const { pageIndex } = state;
    console.log('previousPageWrapper', pageIndex);
    // console.table(state);
    // if (!canPreviousPage(pageIndex)) return;
    gotoPageWrapper(pageIndex - 1);
  };

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
        <Button
          // disabled={!canPreviousPage}
          onClick={() => previousPageWrapper()}>
          ⇽
        </Button>
        {Array.from({ length: PAGES_COUNT }, (_, i) => (
          <Button key={i} onClick={() => gotoPageWrapper(i)}>
            {i + 1}
          </Button>
        ))}
        <Button
          // disabled={!canNextPage}
          onClick={() => nextPageWrapper()}>
          ⇾
        </Button>
      </div>
    </>
  );
}
