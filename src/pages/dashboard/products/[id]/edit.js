// src/pages/dashboard/products/[id]/edit.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProductForm from '../../../../sections/@dashboard/products/ProductForm';
import Layout from '../../../../layouts';
import RoleBasedGuard from '../../../../guards/RoleBasedGuard';
import axios from '../../../../utils/axios';

ProductEdit.getLayout = function getLayout(page) {
  return (
    <Layout>
      <RoleBasedGuard accessibleRoles={['admin', 'user']}>{page}</RoleBasedGuard>
    </Layout>
  );
};

export default function ProductEdit() {
  const { query } = useRouter();
  const { id } = query;

  const [currentProduct, setCurrentProduct] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`/api/products/${id}`);
          setCurrentProduct(response.data);
        } catch (error) {
          console.error('Failed to fetch product:', error);
        }
      };
      fetchProduct();
    }
  }, [id]);

  if (!currentProduct) {
    return null;
  }

  return <ProductForm isEdit={true} currentProduct={currentProduct} />;
}
