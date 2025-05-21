import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './layouts/Layout';
import Home from './pages/Home';
// import Fields from './pages/Fields';
import BookingPage from './pages/Bookingpage';
import RedirectIfAuthenticated from './components/auth/RedirectIfAuthenticated';
import BookingHistory from './pages/BookingHistory'; 
import Payment from './features/booking/Payment';
import FieldDetailClientPage from './pages/FieldDetailClientPage';
import BookingDetailPage from './components/booking/BookingDetailPage';
import RequireOwnerAccess from './components/auth/RequireOwnerAccess';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard_owner/DashboardHome';
import BookingManagement from './features/owner/BookingManagement';
import NotFound from './components/404-page/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/san/:fieldSlug" element={<FieldDetailClientPage />} />
      <Route path="/booking/:fieldId" element={<BookingPage />} />
      <Route path="/payment/:bookingId" element={<Payment />} />
      <Route path="/booking-detail/:bookingId" element={<BookingDetailPage />} />
      
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        {/* <Route path="/fields" element={<Fields />} /> */}
        <Route path="/booking-history" element={<BookingHistory />} /> 

        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfAuthenticated>
              <Register />
            </RedirectIfAuthenticated>
          }
        />
      </Route>

      <Route path="/san/:slug/owner" element={
        <RequireOwnerAccess>
          <DashboardLayout />
        </RequireOwnerAccess>  
        
        }>
        <Route index element={<DashboardHome />} />
        <Route path="bookings" element={<BookingManagement />} />
        {/* <Route path="fields" element={<ManageFields />} />
        <Route path="notifications" element={<Notifications />} /> */} 
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
