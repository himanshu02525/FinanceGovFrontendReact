import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { Outlet, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  return (
    <div className={`layout ${!sidebarOpen ? 'sidebar-collapsed' : ''}`}>
      <Header />
      <div className={`layout-body ${!sidebarOpen ? 'sidebar-collapsed' : ''}`}>
        <Sidebar onToggle={setSidebarOpen} initialState={sidebarOpen} />
        <main className="main-content">
          <Outlet /> {/* CRITICAL: Use Outlet for nested routes */}
        </main>
      </div>
      {!isHomePage && <Footer />}
    </div>
  );
};

export default Layout;