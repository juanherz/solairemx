// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// layouts
import Layout from '../../../layouts';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import UserNewEditForm from '../../../sections/@dashboard/user/UserNewEditForm';
// guards
import RoleBasedGuard from '../../../guards/RoleBasedGuard';

// ----------------------------------------------------------------------

UserCreate.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function UserCreate() {
  const { themeStretch } = useSettings();

  return (
    <RoleBasedGuard accessibleRoles={['admin']}>
      <Page title="Usuarios: Crear nuevo usuario">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Crear un nuevo usuario"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              { name: 'Usuarios', href: PATH_DASHBOARD.user.list },
              { name: 'Nuevo Usuario' },
            ]}
          />
          <UserNewEditForm />
        </Container>
      </Page>
    </RoleBasedGuard>
  );
}
