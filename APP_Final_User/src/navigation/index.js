import React from 'react';
import Routes from './routes';
import {AuthProvider} from '../context/auth';
import {EventProvider} from '../context/event';


export default function Providers() {
  return (
    <AuthProvider>
      <EventProvider>
        <Routes />
      </EventProvider>
    </AuthProvider>
  );
}
