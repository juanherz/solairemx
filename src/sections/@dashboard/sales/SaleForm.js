// src/sections/@dashboard/sales/SaleForm.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  TextField,
  Button,
  IconButton,
  Typography,
  FormControlLabel,
  Switch,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import axios from '../../../utils/axios';
import { PATH_DASHBOARD } from '../../../routes/paths';
import Iconify from '../../../components/Iconify';

export default function SaleForm({ isEdit, currentSale }) {
  const { push, query } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [items, setItems] = useState(
    currentSale?.items || [{ product: null, description: '', quantity: 1, unitPrice: 0 }]
  );
  const [saleNumber, setSaleNumber] = useState(currentSale?.saleNumber || '');
  const [currency, setCurrency] = useState(currentSale?.currency || 'MXN');
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(currentSale?.client || null);
  const [products, setProducts] = useState([]);
  const [orderData, setOrderData] = useState(null);

  const defaultValues = {
    saleNumber: saleNumber,
    saleDate: currentSale?.saleDate || new Date().toISOString().split('T')[0],
    saleType: currentSale?.saleType || 'Crédito',
    national: currentSale?.national !== undefined ? currentSale.national : true,
    currency: currency,
    comments: currentSale?.comments || '',
    location: currentSale?.location || '',
  };

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({ defaultValues });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch clients and products
        const [clientsResponse, productsResponse] = await Promise.all([
          axios.get('/api/clients'),
          axios.get('/api/products'),
        ]);
        const fetchedClients = clientsResponse.data;
        const fetchedProducts = productsResponse.data;
        setClients(fetchedClients);
        setProducts(fetchedProducts);

        if (query.orderId) {
          const orderResponse = await axios.get(`/api/orders/${query.orderId}`);
          const order = orderResponse.data;

          setSelectedClient(order.client);

          // Map order items to sale items
          const saleItems = order.items.map((item) => {
            // Find matching product from fetched products
            const product = fetchedProducts.find((p) => p._id === item.product._id);
            return {
              product: product || item.product,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            };
          });
          setItems(saleItems);

          setCurrency(order.currency);
          setValue('saleType', 'Crédito'); // Set default or based on your preference
          setValue('location', order.location);
          setValue('comments', order.comments);
          setOrderData({ _id: order._id }); // Ensure _id is included
        }

        if (!isEdit) {
          const generatedSaleNumber = `VENTA-${Date.now()}`;
          setSaleNumber(generatedSaleNumber);
          setValue('saleNumber', generatedSaleNumber);
        }
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    };

    fetchInitialData();
  }, [isEdit, setValue, query.orderId]);

  const addItem = () => {
    setItems([...items, { product: null, description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((item, idx) => idx !== index);
    setItems(newItems);
  };

  const handleNationalChange = (event) => {
    setValue('national', event.target.checked);
    const selectedCurrency = event.target.checked ? 'MXN' : 'USD';
    setCurrency(selectedCurrency);
  };

  const onSubmit = async (data) => {
    try {
      data.items = items.map((item) => ({
        product: item.product?._id || null,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      }));
      data.saleNumber = saleNumber;
      data.currency = currency;
      data.client = selectedClient?._id;
      if (orderData) {
        data.order = orderData._id; // Include the order ID to link the sale
      }
      if (isEdit) {
        await axios.put(`/api/sales/${currentSale._id}`, data);
        enqueueSnackbar('Venta actualizada exitosamente', { variant: 'success' });
      } else {
        await axios.post('/api/sales', data);
        enqueueSnackbar('Venta creada exitosamente', { variant: 'success' });
      }
      push(PATH_DASHBOARD.sales.list);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error al guardar la venta', { variant: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        {/* Client Selection */}
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
              helperText={errors.client ? 'El cliente es requerido' : ''}
            />
          )}
        />

        {/* Sale Details */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Número de Venta"
              {...register('saleNumber', { required: 'El número de venta es requerido' })}
              error={Boolean(errors.saleNumber)}
              helperText={errors.saleNumber?.message}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Fecha de Venta"
              type="date"
              {...register('saleDate', { required: 'La fecha de venta es requerida' })}
              InputLabelProps={{ shrink: true }}
              error={Boolean(errors.saleDate)}
              helperText={errors.saleDate?.message}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Tipo de Venta"
              {...register('saleType', { required: 'El tipo de venta es requerido' })}
              error={Boolean(errors.saleType)}
              helperText={errors.saleType?.message}
              fullWidth
            >
              <MenuItem value="Contado">Contado</MenuItem>
              <MenuItem value="Crédito">Crédito</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={watch('national')}
                  onChange={handleNationalChange}
                />
              }
              label="Nacional"
            />
          </Grid>
        </Grid>

        {/* Products */}
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
                onClick={() => removeItem(index)}
                disabled={items.length <= 1}
              >
                <Iconify icon="eva:trash-2-outline" />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Button variant="outlined" sx={{ mt: 2 }} onClick={addItem}>
          Añadir Producto
        </Button>

        {/* Additional Details */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Ubicación"
              {...register('location')}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
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
            {isEdit ? 'Guardar Cambios' : 'Crear Venta'}
          </LoadingButton>
        </Box>
      </Card>
    </form>
  );
}
