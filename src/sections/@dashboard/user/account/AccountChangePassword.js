import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFTextField } from '../../../../components/hook-form';

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Antigua contraseña requerida'),
    newPassword: Yup.string().min(6, 'Contraseña necesita al menos 6 caracteres').required('Nueva contraseña requerida'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Contraseñas deben coincidir'),
  });

  const defaultValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar('¡Actualización exitosa!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">
          <RHFTextField name="oldPassword" type="password" label="Antigua Contraseña" />

          <RHFTextField name="newPassword" type="password" label="Nueva Contraseña" />

          <RHFTextField name="confirmNewPassword" type="password" label="Confirmar nueva contraseña" />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Guardar cambios
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  );
}
