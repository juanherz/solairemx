// src/pages/dashboard/calendar.js

import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useRef, useEffect } from 'react';
import { Card, Button, Container, DialogTitle } from '@mui/material';
import { useDispatch, useSelector } from '../../redux/store';
import {
  getEvents,
  openModal,
  closeModal,
  updateEvent,
  selectEvent,
  selectRange,
  unselectEvent,
} from '../../redux/slices/calendar';
import { PATH_DASHBOARD } from '../../routes/paths';
import useSettings from '../../hooks/useSettings';
import useResponsive from '../../hooks/useResponsive';
import Layout from '../../layouts';
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import { DialogAnimate } from '../../components/animate';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import {
  CalendarForm,
  CalendarStyle,
  CalendarToolbar,
  CalendarEventDialog,
} from '../../sections/@dashboard/calendar';

Calendar.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

const selectedEventSelector = (state) => {
  const { events, selectedEventId } = state.calendar;
  if (selectedEventId) {
    return events.find((_event) => _event.id === selectedEventId);
  }
  return null;
};

export default function Calendar() {
  const { themeStretch } = useSettings();

  const dispatch = useDispatch();

  const isDesktop = useResponsive('up', 'sm');

  const calendarRef = useRef(null);

  const [date, setDate] = useState(new Date());

  const [view, setView] = useState(isDesktop ? 'timeGridWeek' : 'timeGridDay');

  const selectedEvent = useSelector(selectedEventSelector);

  const { events, isOpenModal, selectedRange } = useSelector((state) => state.calendar);

  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);

  useEffect(() => {
    dispatch(getEvents());
  }, [dispatch]);

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = isDesktop ? 'timeGridWeek' : 'timeGridDay';
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [isDesktop]);

  const handleClickToday = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleChangeView = (newView) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const handleSelectRange = (arg) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.unselect();
    }
    dispatch(selectRange(arg.start, arg.end));
    dispatch(openModal());
  };

  const handleSelectEvent = (arg) => {
    dispatch(selectEvent(arg.event.id));
    setIsEventDetailsOpen(true);
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  const handleCloseEventDetails = () => {
    dispatch(unselectEvent());
    setIsEventDetailsOpen(false);
  };

  const handleEventResize = async ({ event }) => {
    try {
      dispatch(
        updateEvent(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleEventDrop = async ({ event }) => {
    try {
      dispatch(
        updateEvent(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Page title="Calendario">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Calendario"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Calendario' }]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon={'eva:plus-fill'} width={20} height={20} />}
              onClick={() => {
                dispatch(selectEvent(null));
                dispatch(openModal());
              }}
            >
              Nuevo evento
            </Button>
          }
        />

        <Card>
          <CalendarStyle>
            <CalendarToolbar
              date={date}
              view={view}
              onNextDate={handleClickDateNext}
              onPrevDate={handleClickDatePrev}
              onToday={handleClickToday}
              onChangeView={handleChangeView}
            />
            <FullCalendar
              weekends
              editable
              droppable
              selectable
              events={events}
              eventContent={renderEventContent}
              ref={calendarRef}
              rerenderDelay={10}
              initialDate={date}
              initialView={view}
              dayMaxEventRows={3}
              eventDisplay="block"
              headerToolbar={false}
              allDayMaintainDuration
              eventResizableFromStart
              select={handleSelectRange}
              eventDrop={handleEventDrop}
              eventClick={handleSelectEvent}
              eventResize={handleEventResize}
              height={isDesktop ? 720 : 'auto'}
              plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
              locale="es" // Set Spanish locale
            />
          </CalendarStyle>
        </Card>

        {/* Event Details Dialog */}
        {selectedEvent && (
          <DialogAnimate open={isEventDetailsOpen} onClose={handleCloseEventDetails}>
            <CalendarEventDialog event={selectedEvent} onEdit={() => {
              dispatch(openModal());
              setIsEventDetailsOpen(false);
            }} onCancel={handleCloseEventDetails} />
          </DialogAnimate>
        )}

        {/* Add/Edit Event Dialog */}
        {isOpenModal && (
          <DialogAnimate open={isOpenModal} onClose={handleCloseModal}>
            <DialogTitle>{selectedEvent ? 'Editar Evento' : 'Agregar Evento'}</DialogTitle>
            <CalendarForm event={selectedEvent || {}} range={selectedRange} onCancel={handleCloseModal} />
          </DialogAnimate>
        )}
      </Container>
    </Page>
  );
}

function renderEventContent(eventInfo) {
  return (
    <div>
      <strong>{eventInfo.timeText}</strong>
      <i>{eventInfo.event.title}</i>
    </div>
  );
}
