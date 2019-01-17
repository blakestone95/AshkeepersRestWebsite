import Home from 'Home';
import AnnouncementBoard from 'announcements/AnnouncementBoard';
import CreateAnnouncement from 'announcements/CreateAnnouncement';
import ViewAnnouncement from 'announcements/ViewAnnouncement';
import EventsBoard from 'events/EventsBoard';
import EventsCalendar from 'events/EventsCalendar';
import CreateEvent from 'events/CreateEvent';
import ViewEvent from 'events/ViewEvent';

export const PATHS = {
  Home: {
    path: '/Home',
    component: Home,
    display: 'Home',
  },
  AnnouncementBoard: {
    path: '/Announcements',
    component: AnnouncementBoard,
    display: 'Announcements Board',
  },
  CreateAnnouncement: {
    path: '/Announcements/Create',
    component: CreateAnnouncement,
    display: 'Create Announcement',
  },
  ViewAnnouncement: {
    path: '/Announcements/View',
    component: ViewAnnouncement,
    display: 'View Announcement',
  },
  EventsBoard: {
    path: '/Events',
    component: EventsBoard,
    display: 'Events Board',
  },
  EventsCalendar: {
    path: '/Events/Calendar',
    component: EventsCalendar,
    display: 'Events Calendar',
  },
  CreateEvent: {
    path: '/Events/Create',
    component: CreateEvent,
    display: 'Create Event',
  },
  ViewEvent: {
    path: '/Events/View',
    params: '/:eventId',
    component: ViewEvent,
    display: 'View Event',
  },
};
