// src/sections/@dashboard/orders/list/OrderTableRow.js

import PropTypes from 'prop-types';
import { TableRow, TableCell, Typography, Button } from '@mui/material';
import { format } from 'date-fns';
import Iconify from '../../../../components/Iconify';

OrderTableRow.propTypes = {
  row: PropTypes.object,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onViewRow: PropTypes.func,
};

export default function OrderTableRow({ row, onEditRow, onDeleteRow, onViewRow }) {
  const {
    deliveryDate,
    client,
    items,
    negotiatedPrice,
    currency,
    status,
  } = row;

  // Generate a comma-separated list of product names
  const productNames = items
    .map((item) => item.description || item.product?.name || 'N/A')
    .join(', ');

  // Calculate total quantity
  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <TableRow hover>
      <TableCell align="left">{format(new Date(deliveryDate), 'dd/MM/yyyy')}</TableCell>

      <TableCell align="left">{client.name}</TableCell>

      <TableCell align="left">{productNames}</TableCell>

      <TableCell align="right">{totalQuantity}</TableCell>

      <TableCell align="right">
        {negotiatedPrice.toFixed(2)} {currency}
      </TableCell>

      <TableCell align="left">{currency}</TableCell>

      <TableCell align="left">{status}</TableCell>

      <TableCell align="right">
        <Button
          size="small"
          color="inherit"
          onClick={onViewRow}
          startIcon={<Iconify icon="eva:eye-fill" />}
        >
          Ver
        </Button>
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
