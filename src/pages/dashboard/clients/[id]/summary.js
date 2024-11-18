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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  const [sortOrder, setSortOrder] = useState('desc'); // Default to descending order

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

  // Get the list of currencies used in the sales
  const currencies = [...new Set(sales.map((sale) => sale.currency))];

  const statsByCurrency = {};

  currencies.forEach((currency) => {
    const salesInCurrency = sales.filter((sale) => sale.currency === currency);
    const totalSales = salesInCurrency.length;
    const totalAmount = salesInCurrency.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalPaid = salesInCurrency.reduce((sum, sale) => sum + sale.amountPaid, 0);
    const totalOwed = salesInCurrency.reduce((sum, sale) => sum + sale.amountOwed, 0);

    statsByCurrency[currency] = {
      totalSales,
      totalAmount,
      totalPaid,
      totalOwed,
    };
  });

  // Sort sales based on saleDate
  const sortedSales = [...sales].sort((a, b) => {
    const dateA = new Date(a.saleDate);
    const dateB = new Date(b.saleDate);
    if (sortOrder === 'asc') {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });

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

          {currencies.map((currency) => (
            <div key={currency} style={{ marginBottom: '16px' }}>
              <Typography variant="subtitle1">Moneda: {currency}</Typography>
              <Typography>Total de Ventas: {statsByCurrency[currency].totalSales}</Typography>
              <Typography>
                Total Vendido: {statsByCurrency[currency].totalAmount} {currency}
              </Typography>
              <Typography>
                Total Pagado: {statsByCurrency[currency].totalPaid} {currency}
              </Typography>
              <Typography>
                Total Adeudado: {statsByCurrency[currency].totalOwed} {currency}
              </Typography>
            </div>
          ))}

          <Typography variant="h6" sx={{ mt: 3 }}>
            Ventas
          </Typography>

          <FormControl sx={{ mb: 2, minWidth: 160 }}>
            <InputLabel id="sort-order-label">Ordenar por Fecha</InputLabel>
            <Select
              labelId="sort-order-label"
              value={sortOrder}
              label="Ordenar por Fecha"
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <MenuItem value="asc">Ascendente</MenuItem>
              <MenuItem value="desc">Descendente</MenuItem>
            </Select>
          </FormControl>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Número de Venta</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Pagado</TableCell>
                  <TableCell>Adeudado</TableCell>
                  <TableCell>Moneda</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedSales.map((sale) => (
                  <TableRow key={sale._id}>
                    <TableCell>{sale.saleNumber}</TableCell>
                    <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                    <TableCell>{sale.totalAmount}</TableCell>
                    <TableCell>{sale.amountPaid}</TableCell>
                    <TableCell>{sale.amountOwed}</TableCell>
                    <TableCell>{sale.currency}</TableCell>
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
