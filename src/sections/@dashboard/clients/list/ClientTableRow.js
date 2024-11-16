// src/sections/@dashboard/clients/list/ClientTableRow.js

import PropTypes from 'prop-types';
import { TableRow, TableCell, Typography, Button } from '@mui/material';
import Iconify from '../../../../components/Iconify';

ClientTableRow.propTypes = {
  row: PropTypes.object,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function ClientTableRow({ row, onEditRow, onDeleteRow }) {
  const { name, company, email, phone } = row;

  return (
    <TableRow hover>
      <TableCell align="left">
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell align="left">{company}</TableCell>

      <TableCell align="left">{email}</TableCell>

      <TableCell align="left">{phone}</TableCell>

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
