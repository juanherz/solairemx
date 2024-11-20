// src/sections/@dashboard/calendar/CalendarToolbar.js

import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Stack, Button, Tooltip, Typography, IconButton, ToggleButton } from '@mui/material';
import { format } from 'date-fns';
import esLocale from 'date-fns/locale/es';
import useResponsive from '../../../hooks/useResponsive';
import Iconify from '../../../components/Iconify';

const VIEW_OPTIONS = [
  { value: 'dayGridMonth', label: 'Mes', icon: 'ic:round-view-module' },
  { value: 'timeGridWeek', label: 'Semana', icon: 'ic:round-view-week' },
  { value: 'timeGridDay', label: 'Día', icon: 'ic:round-view-day' },
  { value: 'listWeek', label: 'Agenda', icon: 'ic:round-view-agenda' },
];

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  padding: theme.spacing(2.5),
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

CalendarToolbar.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  onToday: PropTypes.func,
  onNextDate: PropTypes.func,
  onPrevDate: PropTypes.func,
  onChangeView: PropTypes.func,
  view: PropTypes.oneOf(['dayGridMonth', 'timeGridWeek', 'timeGridDay', 'listWeek']),
};

export default function CalendarToolbar({ date, view, onToday, onNextDate, onPrevDate, onChangeView }) {
  const isDesktop = useResponsive('up', 'sm');

  return (
    <RootStyle>
      {isDesktop && (
        <Stack direction="row" spacing={0.5}>
          {VIEW_OPTIONS.map((viewOption) => (
            <Tooltip key={viewOption.value} title={viewOption.label}>
              <ToggleButton
                value={view}
                selected={viewOption.value === view}
                onChange={() => onChangeView(viewOption.value)}
                sx={{ width: 32, height: 32, padding: 0, border: 0 }}
              >
                <Iconify icon={viewOption.icon} width={20} height={20} />
              </ToggleButton>
            </Tooltip>
          ))}
        </Stack>
      )}

      <Stack direction="row" alignItems="center" spacing={2}>
        <IconButton onClick={onPrevDate}>
          <Iconify icon="eva:arrow-ios-back-fill" width={20} height={20} />
        </IconButton>

        <Typography variant="h5">{format(date, 'dd MMMM yyyy', { locale: esLocale })}</Typography>

        <IconButton onClick={onNextDate}>
          <Iconify icon="eva:arrow-ios-forward-fill" width={20} height={20} />
        </IconButton>
      </Stack>

      {isDesktop && (
        <Button size="small" color="error" variant="contained" onClick={onToday}>
          Hoy
        </Button>
      )}
    </RootStyle>
  );
}
