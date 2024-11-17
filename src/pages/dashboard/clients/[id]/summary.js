// src/pages/dashboard/clients/[id]/summary.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Card,
  Typography,
  Button,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
} from '@mui/material';
import Layout from '../../../../layouts';
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import axios from '../../../../utils/axios';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import { useSnackbar } from 'notistack';
import RoleBasedGuard from '../../../../guards/RoleBasedGuard';

ClientSummary.getLayout = function getLayout(page) {
  return (
    <Layout>
      <RoleBasedGuard accessibleRoles={['admin', 'user']}>{page}</RoleBasedGuard>
    </Layout>
  );
};

export default function ClientSummary() {
  const { query, push } = useRouter();
  const { id } = query;
  const { enqueueSnackbar } = useSnackbar();

  const [client, setClient] = useState(null);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    if (id) {
      const fetchClient = async () => {
        try {
          const clientResponse = await axios.get(`/api/clients/${id}`);
          setClient(clientResponse.data);

          const salesResponse = await axios.get(`/api/sales/client/${id}`);
          setSales(salesResponse.data);
        } catch (error) {
          console.error('Failed to fetch client or sales:', error);
          enqueueSnackbar('Error al obtener los datos del cliente', { variant: 'error' });
        }
      };
      fetchClient();
    }
  }, [id]);

  if (!client) {
    return null;
  }

  // Calculate statistics
  const totalSales = sales.length;
  const totalAmount = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalPaid = sales.reduce((sum, sale) => sum + sale.amountPaid, 0);
  const totalOwed = sales.reduce((sum, sale) => sum + sale.amountOwed, 0);

  return (
    <Page title={`Cliente: ${client.name}`}>
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading={`Resumen de Cliente - ${client.name}`}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Clientes', href: PATH_DASHBOARD.clients.list },
            { name: client.name },
          ]}
          action={
            <Button variant="contained" onClick={() => push(PATH_DASHBOARD.sales.new)}>
              Nueva Venta
            </Button>
          }
        />

        <Card sx={{ p: 3 }}>
          <Typography variant="h6">Información del Cliente</Typography>
          <Typography>Nombre: {client.name}</Typography>
          <Typography>Compañía: {client.company}</Typography>
          <Typography>Email: {client.email}</Typography>
          <Typography>Teléfono: {client.phone}</Typography>
          <Typography>Dirección: {client.address}</Typography>
          <Typography>Notas: {client.notes}</Typography>

          <Typography variant="h6" sx={{ mt: 3 }}>
            Estadísticas
          </Typography>
          <Typography>Total de Ventas: {totalSales}</Typography>
          <Typography>Total Vendido: {totalAmount}</Typography>
          <Typography>Total Pagado: {totalPaid}</Typography>
          <Typography>Total Adeudado: {totalOwed}</Typography>

          <Typography variant="h6" sx={{ mt: 3 }}>
            Ventas
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Número de Venta</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Pagado</TableCell>
                  <TableCell>Adeudado</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale._id}>
                    <TableCell>{sale.saleNumber}</TableCell>
                    <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                    <TableCell>{sale.totalAmount}</TableCell>
                    <TableCell>{sale.amountPaid}</TableCell>
                    <TableCell>{sale.amountOwed}</TableCell>
                    <TableCell>{sale.status}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => push(`${PATH_DASHBOARD.sales.root}/${sale._id}`)}
                      >
                        Ver Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Placeholder for future button */}
          <Button variant="contained" sx={{ mt: 3 }}>
            Pendiente
          </Button>
        </Card>
      </Container>
    </Page>
  );
}
