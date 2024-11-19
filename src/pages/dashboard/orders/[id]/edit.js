// src/pages/dashboard/orders/[id]/edit.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import OrderForm from '../../../../sections/@dashboard/orders/OrderForm';
import Layout from '../../../../layouts';
import RoleBasedGuard from '../../../../guards/RoleBasedGuard';
import axios from '../../../../utils/axios';

OrderEdit.getLayout = function getLayout(page) {
  return (
    <Layout>
      <RoleBasedGuard accessibleRoles={['admin', 'user']}>{page}</RoleBasedGuard>
    </Layout>
  );
};

export default function OrderEdit() {
  const { query } = useRouter();
  const { id } = query;

  const [currentOrder, setCurrentOrder] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchOrder = async () => {
        try {
          const response = await axios.get(`/api/orders/${id}`);
          setCurrentOrder(response.data);
        } catch (error) {
          console.error('Failed to fetch order:', error);
        }
      };
      fetchOrder();
    }
  }, [id]);

  if (!currentOrder) {
    return null;
  }

  return <OrderForm isEdit={true} currentOrder={currentOrder} />;
}
