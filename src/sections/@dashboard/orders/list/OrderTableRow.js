// src/sections/@dashboard/orders/list/OrderTableRow.js

import PropTypes from 'prop-types';
import { TableRow, TableCell, Typography, Button } from '@mui/material';
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { format } from 'date-fns';

OrderTableRow.propTypes = {
  row: PropTypes.object.isRequired,
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
    fulfillmentStatus,
  } = row;

  // Generate a comma-separated list of product names
  const productNames = items
    .map((item) => item.description || item.product?.name || 'N/A')
    .join(', ');

  // Determine color for status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente':
        return 'warning';
      case 'Completado':
        return 'success';
      case 'Descartado':
        return 'error';
      default:
        return 'default';
    }
  };

  // Determine color for fulfillmentStatus
  const getFulfillmentStatusColor = (status) => {
    switch (status) {
      case 'Completo':
        return 'success';
      case 'Parcial':
        return 'warning';
      case 'No Cumplido':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <TableRow hover>
      <TableCell align="left">{format(new Date(deliveryDate), 'dd/MM/yyyy')}</TableCell>

      <TableCell align="left">{client.name}</TableCell>

      <TableCell align="left">{productNames}</TableCell>

      <TableCell align="right">
        {negotiatedPrice ? negotiatedPrice.toFixed(2) : '0.00'} {currency}
      </TableCell>

      <TableCell align="left">{currency}</TableCell>

      <TableCell align="left">
        <Label color={getStatusColor(status)} sx={{ textTransform: 'capitalize' }}>
          {status}
        </Label>
      </TableCell>

      <TableCell align="left">
        <Label color={getFulfillmentStatusColor(fulfillmentStatus)} sx={{ textTransform: 'capitalize' }}>
          {fulfillmentStatus || 'No Cumplido'}
        </Label>
      </TableCell>

      <TableCell align="right">
        <Button
          size="small"
          color="inherit"
          onClick={onViewRow}
          startIcon={<Iconify icon="eva:eye-fill" />}
        >
          Ver
        </Button>
        {status !== 'Completado' && (
          <Button
            size="small"
            color="inherit"
            onClick={onEditRow}
            startIcon={<Iconify icon="eva:edit-fill" />}
          >
            Editar
          </Button>
        )}
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
