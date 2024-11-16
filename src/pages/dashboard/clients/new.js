// src/pages/dashboard/clients/new.js

import ClientForm from '../../../sections/@dashboard/clients/ClientForm';
import Layout from '../../../layouts';
import RoleBasedGuard from '../../../guards/RoleBasedGuard';

ClientCreate.getLayout = function getLayout(page) {
  return (
    <Layout>
      <RoleBasedGuard accessibleRoles={['admin', 'user']}>{page}</RoleBasedGuard>
    </Layout>
  );
};

export default function ClientCreate() {
  return <ClientForm isEdit={false} />;
}
