// src/sections/@dashboard/sales/list/SaleTableRow.js

import PropTypes from 'prop-types';
import { TableRow, TableCell, Typography, Button } from '@mui/material'; // Removed IconButton, added Button
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';

SaleTableRow.propTypes = {
  row: PropTypes.object,
  onViewRow: PropTypes.func,
};

export default function SaleTableRow({ row, onViewRow }) {
  const { saleNumber, customerName, saleDate, totalAmount, amountOwed, status, national, currency } = row;

  return (
    <TableRow hover>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {saleNumber}
        </Typography>
      </TableCell>

      <TableCell align="left">{customerName}</TableCell>

      <TableCell align="left">{new Date(saleDate).toLocaleDateString()}</TableCell>

      <TableCell align="left">
        {totalAmount} {currency}
      </TableCell>

      <TableCell align="center">
        {national ? (
          <Label color="success">Sí</Label>
        ) : (
          <Label color="warning">No</Label>
        )}
      </TableCell>

      <TableCell align="left">
        {amountOwed} {currency}
      </TableCell>

      <TableCell align="left">
        <Label
          variant="ghost"
          color={(status === 'Pagado' && 'success') || (status === 'Parcial' && 'warning') || 'error'}
          sx={{ textTransform: 'capitalize' }}
        >
          {status}
        </Label>
      </TableCell>

      <TableCell align="center">
        <Button
          variant="contained"
          size="small"
          onClick={onViewRow}
          startIcon={<Iconify icon="eva:credit-card-fill" />}
        >
          Registrar Pago
        </Button>
      </TableCell>
    </TableRow>
  );
}
