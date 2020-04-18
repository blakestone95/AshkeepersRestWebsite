import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import Home from 'home/Home';
import AnnouncementBoard from 'announcements/AnnouncementBoard';
import CreateAnnouncement from 'announcements/CreateAnnouncement';
import ViewAnnouncement from 'announcements/ViewAnnouncement';
import EventsBoard from 'events/EventsBoard';
import EventsCalendar from 'events/eventsCalendar';
import CreateEvent from 'events/CreateEvent';
import ViewEvent from 'events/ViewEvent';

export const PATHS = {
  Home: {
    path: '/home',
    component: Home,
    display: 'Home',
  },
  AnnouncementBoard: {
    path: '/announcements',
    component: AnnouncementBoard,
    display: 'Announcements Board',
  },
  CreateAnnouncement: {
    path: '/announcements/create',
    component: CreateAnnouncement,
    display: 'Create Announcement',
  },
  ViewAnnouncement: {
    path: '/announcements/view',
    component: ViewAnnouncement,
    display: 'View Announcement',
  },
  EventsBoard: {
    path: '/events',
    component: EventsBoard,
    display: 'Events Board',
  },
  EventsCalendar: {
    path: '/events/calendar',
    component: EventsCalendar,
    display: 'Events Calendar',
  },
  CreateEvent: {
    path: '/events/create',
    component: CreateEvent,
    display: 'Create Event',
  },
  ViewEvent: {
    path: '/events/view',
    params: '/:eventId',
    component: ViewEvent,
    display: 'View Event',
  },
};

const routes = Object.values(PATHS).map((pathObj) => (
  <Route
    exact
    path={pathObj.path + (pathObj.params ? pathObj.params : '')}
    component={pathObj.component}
    key={pathObj.display}
  />
));

function Routing() {
  return (
    <Switch>
      <Redirect exact from="/" to={PATHS.Home.path} />

      {routes}
    </Switch>
  );
}

export default Routing;
