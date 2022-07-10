import './table.css';

import * as React from 'react';
import {
  useGlobalFilter,
  useSortBy,
  useTable,
  useBlockLayout,
  useResizeColumns,
  usePagination,
} from 'react-table';

import {
  Table as TableUI,
  TableHead as TableHeadUI,
  TableRow as TableRowUI,
  TableHeader as TableHeaderUI,
  TableBody as TableBodyUI,
  TableData as TableDataUI,
  Button,
} from './ui';
import { isEven, upperCaseFirst } from '../../utils';

const TableContext = React.createContext();
TableContext.displayName = 'TableContext';

const DEFAULT_PAGE_SIZE = 10;
const PAGES_COUNT = 10;

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
const defaultReducer = (state, action) => {
  console.log('defaultReducer', state, action);
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
    case '_DEBUG':
      return state;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const defaultTableHooks = (hooks) => {
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

function TableHandler({
  tableInstanceProp,
  children,
  tableHooks = defaultTableHooks,
  useTableOptions,
  reducer: propReducer = defaultReducer,
}) {
  const tableInstance =
    // tableInstanceProp ||
    useTable(
      useTableOptions,
      useGlobalFilter,
      tableHooks,
      useSortBy,
      useBlockLayout,
      useResizeColumns,
      usePagination
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
  } = tableInstance;

  const [reducerState, dispatch] = React.useReducer(propReducer, initialState);

  const reducerDispatch = React.useCallback(
    (action) => {
      dispatch(action);
    },
    [dispatch]
  );

  return (
    <TableContext.Provider
      value={{
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
        reducerDispatch,
        reducerState,
      }}>
      {children}
    </TableContext.Provider>
  );
}

function useTableHandler() {
  const context = React.useContext(TableContext);
  if (context === undefined) {
    throw new Error('useTable must be used within a <TableHandler />');
  }
  return context;
}

const defaultRenderColumnTHead = (column) => {
  return (
    <TableHeaderUI {...column.getHeaderProps(column.getSortByToggleProps())}>
      {column.render('Header')}
      {column.isSorted ? (column.isSortedDesc ? ' ▼' : ' ▲') : ''}
      <div
        {...column.getResizerProps()}
        className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
      />
    </TableHeaderUI>
  );
};

function THead({ renderColumn = defaultRenderColumnTHead }) {
  const { headerGroups } = useTableHandler();
  return (
    <TableHeadUI>
      {headerGroups.map((headerGroup, indexKey) => (
        <TableRowUI key={indexKey} {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(renderColumn)}
        </TableRowUI>
      ))}
    </TableHeadUI>
  );
}

const defaultRenderColumnTBody = (prepareRow, row, idx) => {
  prepareRow(row);
  return (
    <TableRowUI
      {...row.getRowProps()}
      className={isEven(idx) ? 'bg-green-400 bg-opacity-30' : ''}>
      {row.cells.map((cell, idx) => (
        <TableDataUI {...cell.getCellProps()}>
          {cell.render('Cell')}
        </TableDataUI>
      ))}
    </TableRowUI>
  );
};

function TBody({ renderColumn = defaultRenderColumnTBody }) {
  const { page, getTableBodyProps, prepareRow } = useTableHandler();
  const rendreCell = renderColumn.bind(this, prepareRow);
  return (
    <TableBodyUI {...getTableBodyProps()}>
      {page && page.length > 0 ? (
        page.map(rendreCell)
      ) : (
        <div>No Data Found</div>
      )}
    </TableBodyUI>
  );
}

function TPagination({ children }) {
  const { reducerDispatch: dispatch, state, gotoPage } = useTableHandler();

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
  );
}

// function TableSometing({ ...props }) {
//   const {  } = useTable();
//   return <Button onClick={someOnClick} {...props} />;
// }

// function AbstractTable() {
//   return (
//     <div>
//       <TableHandler>
//         <TableUI {...getTableProps()}>
//           <THead></THead>
//           <TBody></TBody>
//         </TableUI>
//          <TableSometing/>
//       </TableHandler>
//     </div>
//   );
// }

// export default AbstractTable;
export {
  TableHandler,
  useTableHandler,
  TableContext,
  THead,
  TBody,
  TPagination,
};
