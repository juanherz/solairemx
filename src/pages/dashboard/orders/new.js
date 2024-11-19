// src/pages/dashboard/orders/new.js

import OrderForm from '../../../sections/@dashboard/orders/OrderForm';
import Layout from '../../../layouts';
import RoleBasedGuard from '../../../guards/RoleBasedGuard';

OrderCreate.getLayout = function getLayout(page) {
  return (
    <Layout>
      <RoleBasedGuard accessibleRoles={['admin', 'user']}>{page}</RoleBasedGuard>
    </Layout>
  );
};

export default function OrderCreate() {
  return <OrderForm isEdit={false} />;
}
