import Sidebar from '../components/owner/Sidebar'
import Header from '../components/owner/Header'
import { Outlet } from 'react-router-dom'

export default function DashboardLayout() {
  return (
    <div className="flex w-full min-h-screen bg-gray-50 overflow-hidden"> 
      <Sidebar />
        <div className="flex-1 flex flex-col overflow-x-hidden">
          <Header />
          <main className="p-1 flex-1 overflow-x-visible">
            <Outlet />
          </main>
        </div>
    </div>
  );
}
