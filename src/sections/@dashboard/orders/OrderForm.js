// src/sections/@dashboard/orders/OrderForm.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Card,
  Grid,
  TextField,
  Button,
  Box,
  MenuItem,
  Autocomplete,
  Typography,
  IconButton,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { PATH_DASHBOARD } from '../../../routes/paths';
import axios from '../../../utils/axios';
import Iconify from '../../../components/Iconify';

export default function OrderForm({ isEdit, currentOrder }) {
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(currentOrder?.client || null);
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState(
    currentOrder?.items || [{ product: null, description: '', quantity: 1, unitPrice: 0 }]
  );

  useEffect(() => {
    // Fetch clients
    const fetchClients = async () => {
      try {
        const response = await axios.get('/api/clients');
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };
    fetchClients();

    // Fetch products
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const defaultValues = {
    deliveryDate: currentOrder?.deliveryDate || '',
    location: currentOrder?.location || '',
    comments: currentOrder?.comments || '',
    priority: currentOrder?.priority || 'Media',
    currency: currentOrder?.currency || 'MXN',
  };

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({ defaultValues });

  const onSubmit = async (data) => {
    try {
      data.items = items.map((item) => ({
        product: item.product?._id || null,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));
      data.client = selectedClient?._id;

      if (isEdit) {
        await axios.put(`/api/orders/${currentOrder._id}`, data);
        enqueueSnackbar('Pedido actualizado exitosamente', { variant: 'success' });
      } else {
        await axios.post('/api/orders', data);
        enqueueSnackbar('Pedido creado exitosamente', { variant: 'success' });
      }
      push(PATH_DASHBOARD.orders.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error al guardar el pedido', { variant: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={clients}
              getOptionLabel={(option) => option.name}
              value={selectedClient}
              onChange={(event, newValue) => {
                setSelectedClient(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Cliente"
                  placeholder="Selecciona un cliente"
                  fullWidth
                  error={Boolean(errors.client)}
                  helperText={errors.client?.message}
                />
              )}
            />
          </Grid>
        </Grid>

        <Typography variant="h6" sx={{ mt: 3 }}>
          Productos
        </Typography>

        {items.map((item, index) => (
          <Grid container spacing={2} key={index} sx={{ mt: 1 }}>
            <Grid item xs={12} md={5}>
              <Autocomplete
                options={products}
                getOptionLabel={(option) => option.name}
                value={item.product}
                onChange={(event, newValue) => {
                  const newItems = [...items];
                  newItems[index].product = newValue;
                  newItems[index].description = newValue ? newValue.name : '';
                  setItems(newItems);
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Producto" placeholder="Selecciona un producto" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                label="Cantidad"
                type="number"
                value={item.quantity}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index].quantity = Number(e.target.value);
                  setItems(newItems);
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                label="Precio Unitario"
                type="number"
                value={item.unitPrice}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index].unitPrice = Number(e.target.value);
                  setItems(newItems);
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                label="Total"
                value={item.quantity * item.unitPrice}
                InputProps={{ readOnly: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <IconButton
                onClick={() => {
                  const newItems = items.filter((_, idx) => idx !== index);
                  setItems(newItems);
                }}
                disabled={items.length <= 1}
              >
                <Iconify icon="eva:trash-2-outline" />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() =>
            setItems([...items, { product: null, description: '', quantity: 1, unitPrice: 0 }])
          }
        >
          Añadir Producto
        </Button>

        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Fecha de Entrega"
              type="date"
              {...register('deliveryDate', { required: 'La fecha de entrega es requerida' })}
              InputLabelProps={{ shrink: true }}
              error={Boolean(errors.deliveryDate)}
              helperText={errors.deliveryDate?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Moneda"
              {...register('currency', { required: 'La moneda es requerida' })}
              error={Boolean(errors.currency)}
              helperText={errors.currency?.message}
              fullWidth
            >
              <MenuItem value="MXN">MXN</MenuItem>
              <MenuItem value="USD">USD</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Prioridad"
              {...register('priority')}
              fullWidth
            >
              <MenuItem value="Alta">Alta</MenuItem>
              <MenuItem value="Media">Media</MenuItem>
              <MenuItem value="Baja">Baja</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Ubicación"
              {...register('location')}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Comentarios"
              {...register('comments')}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <LoadingButton type="submit" variant="contained">
            {isEdit ? 'Guardar Cambios' : 'Crear Pedido'}
          </LoadingButton>
        </Box>
      </Card>
    </form>
  );
}
