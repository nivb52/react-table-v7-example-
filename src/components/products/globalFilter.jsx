import React, { useState } from 'react';
import { useAsyncDebounce } from 'react-table';
import { SearchContainer, SearchText, Input } from './ui';

export function GlobalFilter({ globalFilter, setGlobalFilter }) {
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 300);

  return (
    <SearchContainer>
      <SearchText></SearchText>
      <Input
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`search...`}
      />
    </SearchContainer>
  );
}
