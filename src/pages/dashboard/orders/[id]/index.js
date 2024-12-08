// src/pages/dashboard/orders/[id]/index.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Card,
  Container,
  Typography,
  Button,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { format } from 'date-fns';
import Layout from '../../../../layouts';
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import axios from '../../../../utils/axios';
import RoleBasedGuard from '../../../../guards/RoleBasedGuard';

OrderDetails.getLayout = function getLayout(page) {
  return (
    <Layout>
      <RoleBasedGuard accessibleRoles={['admin', 'user']}>{page}</RoleBasedGuard>
    </Layout>
  );
};

export default function OrderDetails() {
  const { query, push } = useRouter();
  const { id } = query;

  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchOrder = async () => {
        try {
          const response = await axios.get(`/api/orders/${id}`);
          setOrder(response.data);
        } catch (error) {
          console.error('Failed to fetch order:', error);
        }
      };
      fetchOrder();
    }
  }, [id]);

  const handleFulfillOrder = async () => {
    try {
      // Navigate to the sale form with order data
      push({
        pathname: PATH_DASHBOARD.sales.new,
        query: { orderId: order._id },
      });
    } catch (error) {
      console.error('Failed to fulfill order:', error);
    }
  };

  if (!order) {
    return null;
  }

  return (
    <Page title={`Pedido: ${order._id}`}>
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading={`Detalles del Pedido`}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Pedidos', href: PATH_DASHBOARD.orders.list },
            { name: order._id },
          ]}
          action={
            order.status !== 'Completado' && (
              <Button variant="contained" onClick={handleFulfillOrder}>
                Cumplir Pedido
              </Button>
            )
          }
        />

        <Card sx={{ p: 3 }}>
          <Typography variant="h6">Información del Pedido</Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography>
                <strong>Cliente:</strong> {order.client.name}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>
                <strong>Fecha de Entrega:</strong>{' '}
                {new Date(order.deliveryDate).toISOString().split('T')[0]}
              </Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 3 }}>
            Productos
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Producto</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio Unitario</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.unitPrice}</TableCell>
                  <TableCell>{item.quantity * item.unitPrice}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography>
                <strong>Prioridad:</strong> {order.priority}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>
                <strong>Estado:</strong> {order.status}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>
                <strong>Ubicación:</strong> {order.location}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
            <Typography>
                <strong>Nivel de Cumplimiento:</strong> {order.fulfillmentStatus}
            </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography>
                <strong>Comentarios:</strong> {order.comments}
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </Page>
  );
}
