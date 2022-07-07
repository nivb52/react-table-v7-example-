import * as React from 'react';
import {
  useGlobalFilter,
  useSortBy,
  useTable,
  useBlockLayout,
  useResizeColumns,
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
}) {
  const tableInstance =
    // tableInstanceProp ||
    useTable(
      useTableOptions,
      useGlobalFilter,
      tableHooks,
      useSortBy,
      useBlockLayout,
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

function THead({ children }) {
  const { headerGroups } = useTableHandler();
  return (
    <TableHeadUI>
      {headerGroups.map((headerGroup) => (
        <TableRowUI {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column) => (
            <TableHeaderUI
              {...column.getHeaderProps(column.getSortByToggleProps())}>
              {column.render('Header')}
              {column.isSorted ? (column.isSortedDesc ? ' ▼' : ' ▲') : ''}
              <div
                {...column.getResizerProps()}
                className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
              />
            </TableHeaderUI>
          ))}
        </TableRowUI>
      ))}
    </TableHeadUI>
  );
}

function TBody({ children }) {
  const { rows, getTableBodyProps, prepareRow } = useTableHandler();
  return (
    <TableBodyUI {...getTableBodyProps()}>
      {rows.map((row, idx) => {
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
      })}
    </TableBodyUI>
  );
}

// function TableSometing({ ...props }) {
//   const {  } = useTable();
//   return <Button onClick={toggle} {...props} />;
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
export { TableHandler, useTableHandler, TableContext, THead, TBody };
