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
  Autocomplete
} from '@mui/material';
import axios from '../../../utils/axios';
import { PATH_DASHBOARD } from '../../../routes/paths';
import Iconify from '../../../components/Iconify'; // Import Iconify



export default function SaleForm({ isEdit, currentSale }) {
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [items, setItems] = useState(
    currentSale?.items || [{ product: null, description: '', quantity: 1, unitPrice: 0 }]
  );  
  const [saleNumber, setSaleNumber] = useState(currentSale?.saleNumber || '');
  const [currency, setCurrency] = useState(currentSale?.currency || 'MXN');
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(currentSale?.client || null);
  const [products, setProducts] = useState([]);


  useEffect(() => {
    // Fetch clients from the backend
    const fetchClients = async () => {
      try {
        const response = await axios.get('/api/clients');
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    // Fetch products from the backend
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
    saleNumber: saleNumber,
    saleDate: currentSale?.saleDate || '',
    saleType: currentSale?.saleType || 'Crédito', // Use 'Crédito' as default
    national: currentSale?.national !== undefined ? currentSale.national : true,
    currency: currency,
    comments: currentSale?.comments || '',
    location: currentSale?.location || '',
  };

  const { register, handleSubmit, watch, setValue } = useForm({ defaultValues });

  useEffect(() => {
    if (!isEdit) {
      const generatedSaleNumber = `VENTA-${Date.now()}`;
      setSaleNumber(generatedSaleNumber);
      setValue('saleNumber', generatedSaleNumber);
    }
  }, [isEdit, setValue]);

  const addItem = () => {
    setItems([...items, { product: null, description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      const newItems = items.filter((item, idx) => idx !== index);
      setItems(newItems);
    }
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
      data.client = selectedClient?._id; // Set the client ID
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
  
  const handleNationalChange = (event) => {
    setValue('national', event.target.checked);
    const selectedCurrency = event.target.checked ? 'MXN' : 'USD';
    setCurrency(selectedCurrency);
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
                <TextField {...params} label="Cliente" placeholder="Selecciona un cliente" fullWidth />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              onClick={() => push(PATH_DASHBOARD.clients.new)}
              sx={{ mt: 2 }}
            >
              Añadir Nuevo Cliente
            </Button>
          </Grid>
          {selectedClient && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Teléfono del Cliente"
                  value={selectedClient.phone || ''}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email del Cliente"
                  value={selectedClient.email || ''}
                  InputProps={{ readOnly: true }}
                  fullWidth
                />
              </Grid>
            </>
          )}
          <Grid item xs={12} md={6}>
            <TextField
              label="Número de Venta"
              value={saleNumber}
              InputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Fecha de Venta"
              type="date"
              {...register('saleDate')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              label="Tipo de Venta"
              {...register('saleType')}
              fullWidth
              defaultValue={defaultValues.saleType}
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
              label="Venta Nacional"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Moneda"
              value={currency}
              InputProps={{ readOnly: true }}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField label="Ubicación" {...register('location')} fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Comentarios" {...register('comments')} fullWidth multiline rows={3} />
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

        <Box sx={{ mt: 3, textAlign: 'right' }}>
          <LoadingButton type="submit" variant="contained">
            {isEdit ? 'Guardar Cambios' : 'Crear Venta'}
          </LoadingButton>
        </Box>
      </Card>
    </form>
  );
}
