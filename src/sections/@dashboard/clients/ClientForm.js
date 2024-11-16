// src/sections/@dashboard/clients/ClientForm.js

import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Card,
  Grid,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { PATH_DASHBOARD } from '../../../routes/paths';
import axios from '../../../utils/axios';

export default function ClientForm({ isEdit, currentClient }) {
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    name: currentClient?.name || '',
    email: currentClient?.email || '',
    phone: currentClient?.phone || '',
    company: currentClient?.company || '',
    address: currentClient?.address || '',
    notes: currentClient?.notes || '',
  };

  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await axios.put(`/api/clients/${currentClient._id}`, data);
        enqueueSnackbar('Cliente actualizado exitosamente', { variant: 'success' });
      } else {
        await axios.post('/api/clients', data);
        enqueueSnackbar('Cliente creado exitosamente', { variant: 'success' });
      }
      push(PATH_DASHBOARD.clients.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error al guardar el cliente', { variant: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Nombre"
              {...register('name', { required: 'El nombre es requerido' })}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              {...register('email')}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Teléfono"
              {...register('phone')}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Compañía"
              {...register('company')}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Dirección"
              {...register('address')}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Notas"
              {...register('notes')}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <LoadingButton type="submit" variant="contained">
            {isEdit ? 'Guardar Cambios' : 'Crear Cliente'}
          </LoadingButton>
        </Box>
      </Card>
    </form>
  );
}
