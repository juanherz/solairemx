// src/pages/dashboard/sales/[id]/index.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Card,
  Typography,
  Grid,
  TextField,
  Box,
  Button,
} from '@mui/material';
import Layout from '../../../../layouts';
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import axios from '../../../../utils/axios';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { LoadingButton } from '@mui/lab';
import RoleBasedGuard from '../../../../guards/RoleBasedGuard';
import Iconify from '../../../../components/Iconify'; // Import Iconify
import { useSnackbar } from 'notistack';

SaleDetails.getLayout = function getLayout(page) {
  return (
    <Layout>
      <RoleBasedGuard accessibleRoles={['admin', 'user']}>{page}</RoleBasedGuard>
    </Layout>
  );
};

export default function SaleDetails() {
  const { query } = useRouter();
  const { id } = query;
  const { enqueueSnackbar } = useSnackbar();

  const [sale, setSale] = useState(null);
  const [payment, setPayment] = useState({ date: '', amount: 0, comments: '' });

  useEffect(() => {
    if (id) {
      const fetchSale = async () => {
        try {
          const response = await axios.get(`/api/sales/${id}`);
          setSale(response.data);
        } catch (error) {
          console.error('Failed to fetch sale:', error);
        }
      };
      fetchSale();
    }
  }, [id]);

  const handlePaymentSubmit = async () => {
    try {
      await axios.post(`/api/sales/${id}/payments`, payment);
      const response = await axios.get(`/api/sales/${id}`);
      setSale(response.data);
      setPayment({ date: '', amount: 0, comments: '' });
      enqueueSnackbar('Pago registrado exitosamente', { variant: 'success' });
    } catch (error) {
      console.error('Failed to record payment:', error);
      const errorMsg = error.response?.data?.msg || 'Error al registrar el pago';
      enqueueSnackbar(errorMsg, { variant: 'error' });
    }
  };

  const handleDeletePayment = async (paymentId) => {
    try {
      await axios.delete(`/api/sales/${id}/payments/${paymentId}`);
      const response = await axios.get(`/api/sales/${id}`);
      setSale(response.data);
      enqueueSnackbar('Pago eliminado exitosamente', { variant: 'success' });
    } catch (error) {
      console.error('Failed to delete payment:', error);
      const errorMsg = error.response?.data?.msg || 'Error al eliminar el pago';
      enqueueSnackbar(errorMsg, { variant: 'error' });
    }
  };

  if (!sale) {
    return null;
  }

  return (
    <Page title={`Venta: ${sale.saleNumber}`}>
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading={`Detalles de Venta - ${sale.saleNumber}`}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Ventas', href: PATH_DASHBOARD.sales.list },
            { name: sale.saleNumber },
          ]}
        />

        <Card sx={{ p: 3 }}>
          <Typography variant="h6">Información de la Venta</Typography>
          <Typography>Cliente: {sale.client?.name}</Typography>
          <Typography>Teléfono: {sale.client?.phone}</Typography>
          <Typography>Email: {sale.client?.email}</Typography>
          <Typography>Fecha de Venta: {new Date(sale.saleDate).toLocaleDateString()}</Typography>
          <Typography>Tipo de Venta: {sale.saleType}</Typography>
          <Typography>Moneda: {sale.currency}</Typography>
          <Typography>Ubicación: {sale.location}</Typography>
          <Typography>Comentarios: {sale.comments}</Typography>

          <Typography variant="h6" sx={{ mt: 3 }}>
            Productos
          </Typography>
          {sale.items.map((item, index) => (
            <Typography key={index}>
              {item.description} - Cantidad: {item.quantity} - Precio Unitario: {item.unitPrice} - Total: {item.quantity * item.unitPrice}
            </Typography>
          ))}

        <Typography variant="h6" sx={{ mt: 3 }}>
            Pagos Realizados
          </Typography>
          {sale.payments.map((payment) => (
            <Box key={payment._id} display="flex" alignItems="center" sx={{ mb: 1 }}>
              <Typography>
                Fecha: {new Date(payment.date).toLocaleDateString()} - Monto: {payment.amount} - Comentarios: {payment.comments}
              </Typography>
              <Button
                aria-label="delete"
                onClick={() => handleDeletePayment(payment._id)}
                color="error"
                sx={{ minWidth: 'auto', padding: 0, marginLeft: 1 }}
              >
                <Iconify icon="eva:trash-2-outline" />
              </Button>
            </Box>
          ))}


          <Typography variant="h6" sx={{ mt: 3 }}>
            Resumen
          </Typography>
          <Typography>Total Vendido: {sale.totalAmount} {sale.currency}</Typography>
          <Typography>Monto Pagado: {sale.amountPaid} {sale.currency}</Typography>
          <Typography>Monto Adeudado: {sale.amountOwed} {sale.currency}</Typography>
          <Typography>Estado: {sale.status}</Typography>

          {sale.amountOwed > 0 && (
            <>
              <Typography variant="h6" sx={{ mt: 3 }}>
                Registrar Pago
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Fecha de Pago"
                    type="date"
                    value={payment.date}
                    onChange={(e) => setPayment({ ...payment, date: e.target.value })}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label={`Monto (${sale.currency})`}
                    type="number"
                    value={payment.amount}
                    onChange={(e) => setPayment({ ...payment, amount: Number(e.target.value) })}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Comentarios"
                    value={payment.comments}
                    onChange={(e) => setPayment({ ...payment, comments: e.target.value })}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2 }}>
                <LoadingButton variant="contained" onClick={handlePaymentSubmit}>
                  Registrar Pago
                </LoadingButton>
              </Box>
            </>
          )}
        </Card>
      </Container>
    </Page>
  );
}
