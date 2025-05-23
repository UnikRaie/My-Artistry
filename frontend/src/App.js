import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';

import { ThemeProvider } from './components/theme-provider';
import ThemeToggle from './components/theme-toggle';

import Home from './components/frontend/home';
import Login from './components/login';
import Register from './components/register';
import ArtistProfile from './components/frontend/artistprofile';
import ArtistSetting from './components/frontend/artistsetting';
import HirerProfile from './components/frontend/hirerprofile';
import SettingHirer from './components/frontend/hirersetting';
import FindArtist from './components/frontend/FindArtist';
import ViewProfile from './components/frontend/ViewProfile';
import BookingForm from './components/frontend/bookingform';
import MyBooking from './components/frontend/mybooking';
import ForgetPasswordForm from './components/frontend/forget-password-form';
import ResetPasswordForm from './components/frontend/reset-password-form';
import Payment from './components/frontend/payment';
import ChatApp from './components/chat/ChatApp';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-shadcn-theme">
      <div className="App min-h-screen relative">
        
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forget-password" element={<ForgetPasswordForm />} />
            <Route path="/reset-password" element={<ResetPasswordForm />} />
            <Route path="/artist-profile" element={<ArtistProfile />} />
            <Route path="/artist-setting" element={<ArtistSetting />} />
            <Route path="/hirer-profile" element={<HirerProfile />} />
            <Route path="/hirer-setting" element={<SettingHirer />} />
            <Route path="/find-artist" element={<FindArtist />} />
            <Route path="/view-profile" element={<ViewProfile />} />
            <Route path="/booking-form" element={<BookingForm />} />
            <Route path="/my-booking" element={<MyBooking />} />
            <Route path="/payment" element={<Payment/>} />
            <Route path="/chat" element={<ChatApp/>} />
          </Routes>
        </Router>

        <ToastContainer />

        {/* Floating theme toggle button */}
        <div className="fixed bottom-20 left-4 z-50">
          <ThemeToggle />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
