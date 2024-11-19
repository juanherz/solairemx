// src/pages/dashboard/sales/new.js

import SaleForm from '../../../sections/@dashboard/sales/SaleForm';
import Layout from '../../../layouts';
import RoleBasedGuard from '../../../guards/RoleBasedGuard';
import { useRouter } from 'next/router';

SaleCreate.getLayout = function getLayout(page) {
  return (
    <Layout>
      <RoleBasedGuard accessibleRoles={['admin', 'user']}>{page}</RoleBasedGuard>
    </Layout>
  );
};

export default function SaleCreate() {
  const { query } = useRouter();

  return <SaleForm isEdit={false} />;
}
