import { PRODUCTS_END_POINT, DEFAULT_PAGE_SIZE } from '../../config';
import axios from 'axios';
import React from 'react';

import { GlobalFilter } from './globalFilter';
import { mockProducts } from './mocks';
import { isEven, upperCaseFirst } from '../../utils';

import {
  TableHandler,
  useTableHandler,
  TableContext,
  THead,
  TBody,
} from '../table';

import { Table as TableUI } from './ui';

export function Products(children) {
  const [products, setProducts] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);

  const fetchData = async ({ state }) => {
    console.log({ state });
    const sortQuery = state.sortBy
      ? `&sort=${state.sortBy.desc ? 'desc' : 'asc'}`
      : '';
    const response = { data: mockProducts };
    //   await axios.get(
    //   `${PRODUCTS_END_POINT}?limit=${DEFAULT_PAGE_SIZE}${sortQuery}`
    // );
    return response?.data || [];
  };

  const data = React.useMemo(() => [...products], [products]);
  const columns = React.useMemo(
    () =>
      products[0]
        ? Object.keys(products[0]) // use the fields of the first object
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
    [products]
  );

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400,
    }),
    []
  );
  const useTableOptions = {
    columns,
    data,
    manualSortBy: false,
    defaultColumn,
  };

  React.useEffect(() => {
    setLoading(true);
    fetchData({ state: {} })
      .then((response) => {
        setProducts(response);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
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
      <ProductsTable />
    </TableHandler>
  );
}

function ProductsTable(props) {
  const { getTableProps } = useTableHandler();

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
    </>
  );
}
