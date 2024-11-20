// src/sections/@dashboard/calendar/CalendarEventDialog.js

import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { useState } from 'react';
import { useDispatch } from '../../../redux/store';
import { deleteEvent } from '../../../redux/slices/calendar';
import {
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
} from '@mui/material';
import Iconify from '../../../components/Iconify';
import { useSnackbar } from 'notistack';

CalendarEventDialog.propTypes = {
  event: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default function CalendarEventDialog({ event, onCancel, onEdit }) {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  // State to manage the confirmation dialog
  const [openConfirm, setOpenConfirm] = useState(false);

  // Open the confirmation dialog
  const handleClickDelete = () => {
    setOpenConfirm(true);
  };

  // Close the confirmation dialog
  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  // Delete the event after confirmation
  const handleDelete = async () => {
    try {
      await dispatch(deleteEvent(event.id));
      enqueueSnackbar('¡Evento eliminado!');
      onCancel();
      setOpenConfirm(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <DialogTitle>{event.title}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography variant="subtitle2">Descripción</Typography>
          <Typography variant="body2">{event.description || 'Sin descripción'}</Typography>

          <Typography variant="subtitle2">Fecha y hora</Typography>
          <Typography variant="body2">
            {event.allDay
              ? 'Todo el día'
              : `${format(new Date(event.start), 'dd/MM/yyyy hh:mm a')} - ${format(
                  new Date(event.end),
                  'dd/MM/yyyy hh:mm a'
                )}`}
          </Typography>

          <Typography variant="subtitle2">Usuarios asignados</Typography>
          {event.users && event.users.length > 0 ? (
            <Box component="ul" sx={{ pl: 2 }}>
              {event.users.map((user) => (
                <li key={user._id}>
                  <Typography variant="body2">{user.displayName || user.email}</Typography>
                </li>
              ))}
            </Box>
          ) : (
            <Typography variant="body2">No hay usuarios asignados</Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Tooltip title="Eliminar Evento">
          <IconButton onClick={handleClickDelete}>
            <Iconify icon="eva:trash-2-outline" width={20} height={20} />
          </IconButton>
        </Tooltip>
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cerrar
        </Button>
        <Button variant="contained" onClick={onEdit}>
          Editar
        </Button>
      </DialogActions>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"¿Estás seguro que deseas eliminar este evento?"}</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
