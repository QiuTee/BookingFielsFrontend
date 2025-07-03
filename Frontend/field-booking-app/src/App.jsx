import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './layouts/Layout';
import Home from './pages/Home';
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
import CourtSchedule from './features/owner/CourtSchedule';
import LoginOwner from './features/auth/owner/LoginOwner';
import CourtSelection from './features/owner/CourtSelection';
import Fields from './pages/Fields';
import PosSystem from './pages/pos/PosSystem';


function App() {
  return (
    <Routes>
      <Route path="/fields" element={<Fields />} />
      <Route path="/san/:fieldSlug" element={<FieldDetailClientPage />} />
      <Route path="/san/:fieldSlug/booking/:fieldId" element={<BookingPage />} />
      <Route path="/san/:fieldSlug/payment/:bookingId" element={<Payment />} />
      <Route path="/booking-detail/:bookingId" element={<BookingDetailPage />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/booking-history" element={<BookingHistory />} />

        <Route
          path="/login"
          element={
            <RedirectIfAuthenticated redirectTo="/">
              <Login />
            </RedirectIfAuthenticated>
          }
        />
        <Route
          path="/register"
          element={
            <RedirectIfAuthenticated redirectTo="/">
              <Register />
            </RedirectIfAuthenticated>
          }
        />
      </Route>
      <Route 
        path="/login-owner"
        element={
          <RedirectIfAuthenticated redirectTo="/owner/court-selection">
            <LoginOwner />
          </RedirectIfAuthenticated>
        }
      />
      <Route 
        path="/owner/court-selection"
        element={
          <RequireOwnerAccess>
            <CourtSelection />
          </RequireOwnerAccess>
        }
      />
      <Route 
        path="/san/:slug/owner"
        element={
          <RequireOwnerAccess>
            <DashboardLayout />
          </RequireOwnerAccess>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="bookings" element={<BookingManagement />} />
        <Route path="schedule" element={<CourtSchedule />} />
      </Route>
      <Route path="*" element={<NotFound />} />
      <Route path='/pos' element={<PosSystem/>} />
    </Routes>
  );
}

export default App;
