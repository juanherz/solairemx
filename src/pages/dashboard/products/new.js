// src/pages/dashboard/products/new.js

import ProductForm from '../../../sections/@dashboard/products/ProductForm';
import Layout from '../../../layouts';
import RoleBasedGuard from '../../../guards/RoleBasedGuard';

ProductCreate.getLayout = function getLayout(page) {
  return (
    <Layout>
      <RoleBasedGuard accessibleRoles={['admin', 'user']}>{page}</RoleBasedGuard>
    </Layout>
  );
};

export default function ProductCreate() {
  return <ProductForm isEdit={false} />;
}
