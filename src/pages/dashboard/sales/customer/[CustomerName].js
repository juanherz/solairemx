// src/pages/dashboard/sales/customer/[customerName].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Card, Typography } from '@mui/material';
import Layout from '../../../../layouts';
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import axios from '../../../../utils/axios';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import RoleBasedGuard from '../../../../guards/RoleBasedGuard';

CustomerSales.getLayout = function getLayout(page) {
  return (
    <Layout>
      <RoleBasedGuard accessibleRoles={['admin', 'user']}>{page}</RoleBasedGuard>
    </Layout>
  );
};

export default function CustomerSales() {
  const { query } = useRouter();
  const { customerName } = query;

  const [sales, setSales] = useState([]);

  useEffect(() => {
    if (customerName) {
      const fetchSales = async () => {
        try {
          const response = await axios.get(`/api/sales/customer/${customerName}`);
          setSales(response.data);
        } catch (error) {
          console.error('Failed to fetch sales:', error);
        }
      };
      fetchSales();
    }
  }, [customerName]);

  return (
    <Page title={`Ventas de Cliente: ${customerName}`}>
      <Container maxWidth="lg">
        <HeaderBreadcrumbs
          heading={`Ventas de ${customerName}`}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Ventas', href: PATH_DASHBOARD.sales.list },
            { name: customerName },
          ]}
        />

        <Card sx={{ p: 3 }}>
          {sales.map((sale) => (
            <Typography key={sale._id}>
              Número de Venta: {sale.saleNumber} - Total: {sale.totalAmount} - Adeudado: {sale.amountOwed}
            </Typography>
          ))}
        </Card>
      </Container>
    </Page>
  );
}
