import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../hooks/useAuth';

const MainLayout = ({ children }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header />

      {/* Main Content with Sidebar */}
      <div className="flex flex-1">
        {/* Admin Sidebar */}
        {isAdmin && <AdminSidebar />}

        {/* Main Content */}
        <main className={`flex-1 w-full ${isAdmin ? 'lg:ml-0' : ''}`}>
          <div className={`${isAdmin ? 'px-4 md:px-8 py-8 md:py-12' : 'container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12'}`}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
