import React from 'react';
import Layout from '../../components/layout';
import UserDashboardComponent from '../../components/user/UserDashboardComponent';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
  return (
    <Layout>
      <div className='flex flex-col md:flex-row min-h-[89vh] w-full items-start md:items-stretch justify-center p-4 md:p-6 lg:p-12 gap-y-4 md:gap-y-0 md:gap-x-4'>
        {/* Sidebar Section */}
        <div className="w-full md:w-[35%] lg:w-[30%] p-4 rounded-lg bg-gray-100">
          <UserDashboardComponent />
        </div>
        {/* Content Section */}
        <div className='w-full md:w-[65%] lg:w-[70%] p-4 rounded-lg'>
          <Outlet />
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
