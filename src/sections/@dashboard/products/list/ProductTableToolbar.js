// src/sections/@dashboard/products/list/ProductTableToolbar.js

import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField } from '@mui/material';
import Iconify from '../../../../components/Iconify';

ProductTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function ProductTableToolbar({ filterName, onFilterName }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{ px: 2.5, py: 3 }}
    >
      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Buscar producto..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
