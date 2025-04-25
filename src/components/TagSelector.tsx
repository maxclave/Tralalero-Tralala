import React from 'react';
import { Chip, Autocomplete, TextField } from '@mui/material';
import { Tag } from '../types';

interface TagSelectorProps {
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
}

const availableTags: Tag[] = [
  { id: '1', name: 'Urgent', color: '#ff4d4f' },
  { id: '2', name: 'Important', color: '#faad14' },
  { id: '3', name: 'Later', color: '#1890ff' },
];

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onChange }) => {
  return (
    <Autocomplete
      multiple
      options={availableTags}
      getOptionLabel={(option) => option.name}
      value={selectedTags}
      onChange={(event, newValue) => onChange(newValue)}
      renderInput={(params) => <TextField {...params} label="Tags" />}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            label={option.name}
            style={{ backgroundColor: option.color, color: 'white' }}
            {...getTagProps({ index })}
          />
        ))
      }
    />
  );
};

export default TagSelector;