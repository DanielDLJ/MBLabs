import React from 'react';
import Routes from './routes';
import { AuthProvider } from '../context/auth';
//Por enquanto so tem um
//So adicionar aqui 
//caso precise de mais
export default function Providers() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
