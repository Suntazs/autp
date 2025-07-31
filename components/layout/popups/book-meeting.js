"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    };
  },
};

// TimeSlot component
const TimeSlot = ({ time, isSelected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(time)}
      className={`
        w-full p-3 text-sm rounded-lg border transition-all duration-200 text-left
        ${isSelected
          ? 'bg-[var(--primary-green)] text-black border-[var(--primary-green)]' 
          : 'bg-zinc-800 text-white border-zinc-600 hover:border-zinc-500 hover:bg-zinc-700 hover:shadow-md'
        }
      `}
    >
      {time}
    </button>
  );
};

export default function BookMeeting({ isOpen, onClose }) {
  const [[step, direction], setStep] = useState([0, 0]); // 0: calendar, 1: time, 2: details
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isClosing, setIsClosing] = useState(false);


  // Reset states when component opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep([0, 0]);
      setSelectedDate(null);
      setSelectedTime(null);
      setCurrentMonth(new Date());
      setIsClosing(false);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const paginate = (newDirection) => {
    setStep([step + newDirection, newDirection]);
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isPast = date < today;
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      
      days.push({
        date,
        day: date.getDate(),
        isCurrentMonth,
        isPast,
        isToday,
        isSelected
      });
    }
    
    return days;
  };

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const calendarDays = generateCalendarDays();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handleDateSelect = (day, index) => {
    if (day.isPast || !day.isCurrentMonth || day.isToday) return;
    setSelectedDate(day.date);
  };

  const handlePrevMonth = () => {
    const today = new Date();
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    
    if (prevMonth >= currentMonthStart) {
      setCurrentMonth(prevMonth);
      setSelectedDate(null);
    }
  };

  const handleNextMonth = () => {
    const today = new Date();
    const twoMonthsAhead = new Date(today.getFullYear(), today.getMonth() + 2, 1);
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    
    if (nextMonth <= twoMonthsAhead) {
      setCurrentMonth(nextMonth);
      setSelectedDate(null);
    }
  };
  
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => onClose(), 600);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isClosing) {
      handleClose();
    }
  };



  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ 
          duration: 0.4, 
          ease: [0.23, 1, 0.32, 1]
        }}
        className="fixed inset-0 bg-black/50 z-[110]"
        onClick={handleOverlayClick}
      />

      {/* Main Drawer Container */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isClosing ? 0 : 1 }}
        exit={{ scaleX: 0 }}
        transition={{ 
          duration: 0.8, 
          ease: [0.23, 1, 0.32, 1],
          type: "tween"
        }}
        className="fixed right-0 top-0 h-full bg-black shadow-2xl z-[111] overflow-hidden origin-right w-full sm:w-[500px]"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: isClosing ? 0 : 1, 
            y: isClosing ? -20 : 0 
          }}
          transition={{ 
            duration: isClosing ? 0.4 : 0.6, 
            ease: [0.23, 1, 0.32, 1],
            delay: isClosing ? 0 : 0.2 
          }}
          className="p-4 sm:p-6 border-b border-zinc-800"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Book a Meeting</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-zinc-800 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
  
        {/* Content Container */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isClosing ? 0 : 1 }}
          transition={{ 
            duration: isClosing ? 0.4 : 0.6, 
            ease: [0.23, 1, 0.32, 1],
            delay: isClosing ? 0.1 : 0.3 
          }}
          className="relative bg-black text-white overflow-hidden" 
          style={{ height: 'calc(100% - 97px)' }} // Adjust height to account for header
        >
          <AnimatePresence initial={false} custom={direction}>
            {step === 0 && (
              <motion.div
                key={0}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  type: "tween",
                  duration: 0.4,
                  ease: [0.23, 1, 0.32, 1]
                }}
                className="absolute inset-0 p-6"
              >
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={handlePrevMonth}
                    disabled={(() => {
                      const today = new Date();
                      const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                      const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
                      return prevMonth < currentMonthStart;
                    })()}
                    className={`p-2 rounded-full transition-colors ${
                      (() => {
                        const today = new Date();
                        const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                        const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
                        return prevMonth < currentMonthStart ? 'text-zinc-600 cursor-not-allowed' : 'hover:bg-zinc-800'
                      })()
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h3 className="text-xl font-semibold text-white">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h3>
                  <button
                    onClick={handleNextMonth}
                    disabled={(() => {
                      const today = new Date();
                      const twoMonthsAhead = new Date(today.getFullYear(), today.getMonth() + 2, 1);
                      const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
                      return nextMonth > twoMonthsAhead;
                    })()}
                    className={`p-2 rounded-full transition-colors ${
                      (() => {
                        const today = new Date();
                        const twoMonthsAhead = new Date(today.getFullYear(), today.getMonth() + 2, 1);
                        const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
                        return nextMonth > twoMonthsAhead ? 'text-zinc-600 cursor-not-allowed' : 'hover:bg-zinc-800'
                      })()
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="mb-6">
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-zinc-400">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  <div className="relative">
                    {/* Calendar Days Grid */}
                    <div className="grid grid-cols-7 gap-1 relative">
                      {calendarDays.map((day, index) => (
                        <div key={index} className="relative">
                          {/* Moving Selection Block for this cell */}
                          <motion.div
                            className="absolute inset-0 bg-[var(--primary-green)] rounded-lg pointer-events-none"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ 
                              scale: day.isSelected ? 1 : 0,
                              opacity: day.isSelected ? 1 : 0
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 25,
                              duration: 0.3
                            }}
                          />
                          
                          <button
                            onClick={() => handleDateSelect(day, index)}
                            disabled={day.isPast || !day.isCurrentMonth || day.isToday}
                            className={`
                              w-full p-2 text-sm rounded-lg transition-all duration-200 relative z-10
                              ${!day.isCurrentMonth ? 'text-zinc-600 cursor-not-allowed' : ''}
                              ${day.isPast || day.isToday ? 'text-zinc-600 cursor-not-allowed' : ''}
                              ${day.isSelected ? 'text-black font-semibold' : 'text-white'}
                              ${!day.isPast && day.isCurrentMonth && !day.isSelected && !day.isToday ? 'hover:bg-zinc-800' : ''}
                            `}
                          >
                            {day.day}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Choose Time Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => paginate(1)}
                    disabled={!selectedDate}
                    className={`
                      px-8 py-3 rounded-full font-medium transition-all duration-200
                      ${selectedDate 
                        ? 'bg-[var(--primary-green)] text-black hover:bg-[var(--primary-green)]/90' 
                        : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                      }
                    `}
                  >
                    Choose Time
                  </button>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key={1}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  type: "tween",
                  duration: 0.4,
                  ease: [0.23, 1, 0.32, 1]
                }}
                className="absolute inset-0 p-6"
              >
                {/* Selected Date */}
                <div className="mb-6 text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">Select Time</h3>
                  <p className="text-zinc-300">
                    {selectedDate?.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>

                {/* Time Slots */}
                <div 
                  className="flex flex-col gap-3 mb-6 max-h-[350px] overflow-y-auto pr-2 elegant-scrollbar"
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'var(--primary-green) rgba(63, 63, 70, 0.3)',
                  }}
                >
                  {timeSlots.map((time) => (
                    <TimeSlot
                      key={time}
                      time={time}
                      isSelected={selectedTime === time}
                      onSelect={handleTimeSelect}
                    />
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => paginate(-1)}
                    className="flex items-center justify-center w-12 h-12 bg-zinc-800 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={() => paginate(1)}
                    disabled={!selectedTime}
                    className={`
                      px-8 py-3 rounded-full font-medium transition-all duration-200
                      ${selectedTime 
                        ? 'bg-[var(--primary-green)] text-black hover:bg-[var(--primary-green)]/90' 
                        : 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                      }
                    `}
                  >
                    Book Meeting
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key={2}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  type: "tween",
                  duration: 0.4,
                  ease: [0.23, 1, 0.32, 1]
                }}
                className="absolute inset-0 p-6 overflow-y-auto"
              >
                {/* Meeting Details Header */}
                <div className="mb-4 text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">Meeting Details</h3>
                  <p className="text-zinc-300 text-sm">
                    {selectedDate?.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })} at {selectedTime}
                  </p>
                </div>

                {/* Contact Form */}
                <div className="space-y-3 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-3 py-2 bg-zinc-800 text-white rounded-lg outline-none focus:outline-none placeholder-zinc-400"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 bg-zinc-800 text-white rounded-lg outline-none focus:outline-none placeholder-zinc-400"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-zinc-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full px-3 py-2 bg-zinc-800 text-white rounded-lg outline-none focus:outline-none placeholder-zinc-400"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-1">
                      Message (Optional)
                    </label>
                    <textarea
                      id="message"
                      rows={2}
                      className="w-full px-3 py-2 bg-zinc-800 text-white rounded-lg outline-none focus:outline-none placeholder-zinc-400 resize-none"
                      placeholder="Tell us about your project or any specific requirements"
                    />
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => paginate(-1)}
                    className="flex items-center justify-center w-12 h-12 bg-zinc-800 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="white" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={() => {
                      console.log("Meeting confirmed!");
                      handleClose();
                    }}
                    className="px-8 py-3 bg-[var(--primary-green)] text-black rounded-full font-medium hover:bg-[var(--primary-green)]/90 transition-colors duration-200"
                  >
                    Book Meeting
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}
