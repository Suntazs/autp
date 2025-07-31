"use client";

import { useState } from "react";
import Navbar from "@/components/layout/navbar";
import BookMeeting from "@/components/layout/popups/book-meeting";

export default function ClientWrapper({ children }) {
  const [showBooking, setShowBooking] = useState(false);

  const handleOpenBooking = () => {
    setShowBooking(true);
  };

  const handleCloseBooking = () => {
    setShowBooking(false);
  };

  return (
    <>
      <Navbar onBookMeeting={handleOpenBooking} />
      {children}
      <BookMeeting isOpen={showBooking} onClose={handleCloseBooking} />
    </>
  );
} 