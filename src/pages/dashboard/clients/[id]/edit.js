// src/pages/dashboard/clients/[id]/edit.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ClientForm from '../../../../sections/@dashboard/clients/ClientForm';
import Layout from '../../../../layouts';
import RoleBasedGuard from '../../../../guards/RoleBasedGuard';
import axios from '../../../../utils/axios';

ClientEdit.getLayout = function getLayout(page) {
  return (
    <Layout>
      <RoleBasedGuard accessibleRoles={['admin', 'user']}>{page}</RoleBasedGuard>
    </Layout>
  );
};

export default function ClientEdit() {
  const { query } = useRouter();
  const { id } = query;

  const [currentClient, setCurrentClient] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchClient = async () => {
        try {
          const response = await axios.get(`/api/clients/${id}`);
          setCurrentClient(response.data);
        } catch (error) {
          console.error('Failed to fetch client:', error);
        }
      };
      fetchClient();
    }
  }, [id]);

  if (!currentClient) {
    return null;
  }

  return <ClientForm isEdit={true} currentClient={currentClient} />;
}
