// src/sections/@dashboard/calendar/CalendarForm.js

import PropTypes from 'prop-types';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Stack,
  Button,
  Tooltip,
  TextField,
  IconButton,
  DialogActions,
  Autocomplete,
  MenuItem,
} from '@mui/material';
import { LoadingButton, MobileDateTimePicker } from '@mui/lab';
import { useDispatch } from '../../../redux/store';
import { createEvent, updateEvent, deleteEvent } from '../../../redux/slices/calendar';
import Iconify from '../../../components/Iconify';
import { ColorSinglePicker } from '../../../components/color-utils';
import { FormProvider, RHFTextField, RHFSwitch } from '../../../components/hook-form';
import axios from '../../../utils/axios';
import { useEffect, useState } from 'react';

const COLOR_OPTIONS = [
  '#00AB55',
  '#1890FF',
  '#54D62C',
  '#FFC107',
  '#FF4842',
  '#04297A',
  '#7A0C2E',
];

// Hard-coded categories
const CATEGORY_OPTIONS = ['Trabajo', 'Personal', 'Urgente', 'Otro'];

CalendarForm.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  onCancel: PropTypes.func,
};

export default function CalendarForm({ event, range, onCancel }) {
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const isCreating = !event || Object.keys(event).length === 0;

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('El título es requerido'),
    description: Yup.string().max(5000),
    start: Yup.date().required('La fecha de inicio es requerida'),
    end: Yup.date().required('La fecha de fin es requerida'),
    users: Yup.array(),
    category: Yup.string().oneOf(CATEGORY_OPTIONS),
  });

  const [userOptions, setUserOptions] = useState([]);
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: {
      title: '',
      description: '',
      textColor: '#1890FF',
      allDay: false,
      start: new Date(),
      end: new Date(),
      users: [],
    },
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/account/users');
        setUserOptions(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (userOptions.length > 0) {
      const defaultValues = getInitialValues(event, range, userOptions);
      reset(defaultValues);
      setIsFormInitialized(true);
    }
  }, [userOptions, event, range, reset]);

  const getInitialValues = (event, range, userOptions = []) => {
    const _event = {
      title: '',
      description: '',
      textColor: '#1890FF',
      allDay: false,
      start: range ? new Date(range.start) : new Date(),
      end: range ? new Date(range.end) : new Date(),
      users: [],
      category: 'Trabajo', 
    };

    if (event) {
      const users = event.users || [];
      let formattedUsers = [];

      if (userOptions.length > 0) {
        formattedUsers = users
          .map((user) =>
            typeof user === 'object' ? user : userOptions.find((u) => u._id === user)
          )
          .filter(Boolean);
      }

      return {
        ..._event,
        ...event,
        users: formattedUsers,
        category: event.category || 'Trabajo',
      };
    }

    return _event;
  };

  const onSubmit = async (data) => {
    try {
      const newEvent = {
        title: data.title,
        description: data.description,
        textColor: data.textColor,
        allDay: data.allDay,
        start: data.start,
        end: data.end,
        users: data.users.map((user) => user._id),
        category: data.category,
      };
      if (event.id || event._id) {
        dispatch(updateEvent(event.id || event._id, newEvent));
        enqueueSnackbar('¡Evento actualizado!');
      } else {
        dispatch(createEvent(newEvent));
        enqueueSnackbar('¡Evento creado!');
      }
      reset();
      onCancel();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!event.id && !event._id) return;
    try {
      onCancel();
      dispatch(deleteEvent(event.id || event._id));
      enqueueSnackbar('¡Evento eliminado!');
    } catch (error) {
      console.error(error);
    }
  };

  const values = watch();

  const isDateError = isBefore(new Date(values.end), new Date(values.start));

  if (!isFormInitialized) {
    return null; // Or a loading indicator
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ p: 3 }}>
        <RHFTextField name="title" label="Título" />

        <RHFTextField name="description" label="Descripción" multiline rows={4} />

        <RHFSwitch name="allDay" label="Todo el día" />

        <Controller
          name="start"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              label="Fecha de inicio"
              inputFormat="dd/MM/yyyy hh:mm a"
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          )}
        />

        <Controller
          name="end"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              label="Fecha de fin"
              inputFormat="dd/MM/yyyy hh:mm a"
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!isDateError}
                  helperText={isDateError && 'La fecha de fin debe ser posterior a la fecha de inicio'}
                />
              )}
            />
          )}
        />
        {/* Users Field */}
        <Controller
          name="users"
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              multiple
              options={userOptions}
              getOptionLabel={(option) => option.displayName || option.email}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              onChange={(event, newValue) => {
                field.onChange(newValue);
              }}
              renderInput={(params) => <TextField {...params} label="Usuarios asignados" />}
            />
          )}
        />
        {/* Category Field */}
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Categoría"
              fullWidth
            >
              {CATEGORY_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="textColor"
          control={control}
          render={({ field }) => (
            <ColorSinglePicker value={field.value} onChange={field.onChange} colors={COLOR_OPTIONS} />
          )}
        />
      </Stack>

      <DialogActions>
        {!isCreating && (
          <Tooltip title="Eliminar Evento">
            <IconButton onClick={handleDelete}>
              <Iconify icon="eva:trash-2-outline" width={20} height={20} />
            </IconButton>
          </Tooltip>
        )}
        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancelar
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {isCreating ? 'Agregar' : 'Guardar'}
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
