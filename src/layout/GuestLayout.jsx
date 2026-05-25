import React, { useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import './Layout.css';

import { Outlet } from 'react-router-dom';

const GuestLayout = () => {
  return (
    <div className="layout-container my-md-5">
      <Header/>
      <main>
        <Outlet />
        </main>
    </div>
  );
};

export default GuestLayout;