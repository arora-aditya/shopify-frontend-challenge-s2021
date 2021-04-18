import React from 'react';
import '@shopify/polaris/dist/styles.css';
import {
  Card,
  Icon,
  TextField,
} from '@shopify/polaris';
import {SearchMinor} from '@shopify/polaris-icons';

interface SearchBarProps {
  searchValue?: string,
  onSearchValueChange: (searchValue: string) => void,
}

export default function SearchBar({searchValue="", onSearchValueChange}: SearchBarProps) {
  return (
    <Card sectioned>
      <TextField
        label="Movie title"
        placeholder="Search your movie here"
        onChange={onSearchValueChange}
        value={searchValue}
        prefix={
          <Icon source={SearchMinor} color="inkLighter" />
        }
      />
    </Card>
  );
}