// change-password.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Container, Stack, Card, Typography, InputAdornment, IconButton, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormProvider, RHFTextField } from '../../../../components/hook-form';
import Layout from '../../../../layouts';
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import Iconify from '../../../../components/Iconify';
import axios from '../../../../utils/axios';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import RoleBasedGuard from '../../../../guards/RoleBasedGuard';

const ChangePasswordSchema = Yup.object().shape({
  newPassword: Yup.string().required('New password is required'),
});

ChangePassword.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default function ChangePassword() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { id } = router.query;

  const [showPassword, setShowPassword] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  const defaultValues = {
    newPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePasswordSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/account/user/${id}`);
        setUserName(response.data.displayName);
        setLoading(false);
      } catch (error) {
        console.error(error);
        enqueueSnackbar('Failed to load user data', { variant: 'error' });
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, enqueueSnackbar]);

  const onSubmit = async (data) => {
    try {
      await axios.put(`/api/account/change-password/${id}`, { password: data.newPassword });
      enqueueSnackbar('Password updated successfully!', { variant: 'success' });
      reset();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to update password', { variant: 'error' });
      setError('afterSubmit', { ...error, message: error.message });
    }
  };

  return (
    <RoleBasedGuard accessibleRoles={['admin']}>
      <Page title="User: Change Password">
        <Container maxWidth="sm">
          <HeaderBreadcrumbs
            heading={`Change Password for ${userName}`}
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              { name: 'User', href: PATH_DASHBOARD.user.list },
              { name: 'Change Password' },
            ]}
          />

          <Card sx={{ p: 3 }}>
            {loading ? (
              <Typography variant="h6" align="center">
                Loading...
              </Typography>
            ) : (
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                  {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

                  <RHFTextField
                    name="newPassword"
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    Change Password
                  </LoadingButton>
                </Stack>
              </FormProvider>
            )}
          </Card>
        </Container>
      </Page>
    </RoleBasedGuard>
  );
}
