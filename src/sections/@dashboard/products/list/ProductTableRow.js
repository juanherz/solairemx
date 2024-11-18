// src/sections/@dashboard/products/list/ProductTableRow.js

import PropTypes from 'prop-types';
import { TableRow, TableCell, Typography, Button } from '@mui/material';
import Iconify from '../../../../components/Iconify';

ProductTableRow.propTypes = {
  row: PropTypes.object,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function ProductTableRow({ row, onEditRow, onDeleteRow }) {
  const { name, characteristics, unit } = row;

  return (
    <TableRow hover>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell align="left">{characteristics}</TableCell>

      <TableCell align="left">{unit}</TableCell>

      <TableCell align="right">
        <Button
          size="small"
          color="inherit"
          onClick={onEditRow}
          startIcon={<Iconify icon="eva:edit-fill" />}
        >
          Editar
        </Button>
        <Button
          size="small"
          color="error"
          onClick={onDeleteRow}
          startIcon={<Iconify icon="eva:trash-2-outline" />}
        >
          Eliminar
        </Button>
      </TableCell>
    </TableRow>
  );
}
