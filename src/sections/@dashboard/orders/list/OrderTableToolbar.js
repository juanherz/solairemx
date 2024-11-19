// src/sections/@dashboard/orders/list/OrderTableToolbar.js

import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem } from '@mui/material';
import Iconify from '../../../../components/Iconify';

OrderTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  filterStatus: PropTypes.string,
  onFilterStatus: PropTypes.func,
};

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'Pendiente', label: 'Pendiente' },
  { value: 'Completado', label: 'Completado' },
  { value: 'Descartado', label: 'Descartado' },
];

export default function OrderTableToolbar({
  filterName,
  onFilterName,
  filterStatus,
  onFilterStatus,
}) {
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
        placeholder="Buscar pedido..."
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

      <TextField
        select
        label="Estado"
        value={filterStatus}
        onChange={onFilterStatus}
        sx={{ width: 200 }}
      >
        {STATUS_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}
