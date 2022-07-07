import tw from 'twin.macro';

export const Table = tw.table`
  table-fixed
  text-base
  text-gray-900
`;

export const TableHead = tw.thead`
  p-2
`;

export const TableRow = tw.tr`
border
border-green-500
`;

export const TableHeader = tw.th`
border
border-green-500
p-2
`;

export const TableBody = tw.tbody`

`;

export const TableData = tw.td`
border
border-green-500
p-5
`;

export const Button = tw.button`
  pl-4
  pr-4
  pt-2
  pb-2
  text-black
  rounded-md
  transition-colors
`;

export const SearchContainer = tw.div`
  mb-6
  mt-6
  flex
  items-center
`;

export const SearchText = tw.h2`
  text-xl
text-gray-600
  mr-6
`;

export const Input = tw.input`
  h-8
  border-2
  border-solid
  border-green-500
  outline-none
  p-4
  rounded-lg
`;
