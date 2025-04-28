import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './layouts/Layout';
import Home from './pages/Home';
import Fields from './pages/Fields';
import BookingPage from './pages/Bookingpage';
import RedirectIfAuthenticated from './auth/RedirectIfAuthenticated';
import BookingHistory from './pages/BookingHistory'; 
import Payment from './features/booking/Payment';
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/fields" element={<Fields />} />
        <Route path="/booking/:fieldId" element={<BookingPage />} />
        <Route path="/booking-history" element={<BookingHistory />} /> 
        <Route path="/payment/:bookingId" element={<Payment />} />
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
    </Routes>
  );
}

export default App;
