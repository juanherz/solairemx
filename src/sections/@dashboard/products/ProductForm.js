// src/sections/@dashboard/products/ProductForm.js

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

export default function ProductForm({ isEdit, currentProduct }) {
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = {
    name: currentProduct?.name || '',
    characteristics: currentProduct?.characteristics || '',
    unit: currentProduct?.unit || '',
  };

  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await axios.put(`/api/products/${currentProduct._id}`, data);
        enqueueSnackbar('Producto actualizado exitosamente', { variant: 'success' });
      } else {
        await axios.post('/api/products', data);
        enqueueSnackbar('Producto creado exitosamente', { variant: 'success' });
      }
      push(PATH_DASHBOARD.products.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error al guardar el producto', { variant: 'error' });
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
              label="Unidad"
              {...register('unit')}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Características"
              {...register('characteristics')}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <LoadingButton type="submit" variant="contained">
            {isEdit ? 'Guardar Cambios' : 'Crear Producto'}
          </LoadingButton>
        </Box>
      </Card>
    </form>
  );
}
