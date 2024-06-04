import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Container, Alert, AlertTitle } from '@mui/material';
// next
import { useRouter } from 'next/router';
// components
import LoadingScreen from '../components/LoadingScreen';
// hooks
import useAuth from '../hooks/useAuth';
import Login from '../pages/auth/login';

// ----------------------------------------------------------------------

RoleBasedGuard.propTypes = {
  accessibleRoles: PropTypes.array, // Example ['admin', 'leader']
  children: PropTypes.node,
};

// const useCurrentRole = () => {
//   // Logic here to get current user role
//   const role = 'admin';
//   return role;
// };

export default function RoleBasedGuard({ accessibleRoles, children }) {
  const { isAuthenticated, isInitialized, user } = useAuth();
  const { pathname, push } = useRouter();
  const [requestedLocation, setRequestedLocation] = useState(null);

  useEffect(() => {
    if (requestedLocation && pathname !== requestedLocation) {
      setRequestedLocation(null);
      push(requestedLocation);
    }
  }, [pathname, push, requestedLocation]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Login />;
  }

  const currentRole = user?.role || 'guest';

  if (!accessibleRoles.includes(currentRole)) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Permission Denied</AlertTitle>
          You do not have permission to access this page
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}
