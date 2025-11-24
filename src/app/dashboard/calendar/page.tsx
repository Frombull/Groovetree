"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import UserMenu from "@/app/components/UserMenu";
import { FaHeart, FaExternalLinkAlt } from "react-icons/fa";
import { MdCalendarMonth } from "react-icons/md";
import { BsEyeFill } from "react-icons/bs";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
  startOfWeek,
  endOfWeek,
  isToday,
  isPast,
} from "date-fns";
import { enUS } from "date-fns/locale";

interface Artist {
  id: string;
  slug: string;
  title: string;
  avatarUrl: string | null;
  name: string;
}

interface Event {
  id: string;
  title: string;
  venue: string;
  city: string;
  state: string | null;
  date: string;
  ticketUrl: string | null;
  artist: Artist;
}

export default function CalendarPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user]);

  const loadEvents = async () => {
    try {
      setIsLoadingEvents(true);
      const response = await fetch("/api/favorites/calendar");

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
      } else {
        console.error("Erro ao carregar eventos");
      }
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  // Obter todos os dias do mês atual
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

  // Agrupar eventos por data
  const eventsByDate = events.reduce((acc, event) => {
    const dateKey = format(new Date(event.date), "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  // Obter eventos da data selecionada
  const selectedDateEvents = selectedDate
    ? eventsByDate[format(selectedDate, "yyyy-MM-dd")] || []
    : [];

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    if (eventsByDate[dateKey]) {
      setSelectedDate(date);
    }
  };

  const handleNextEvent = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Encontrar o próximo evento futuro
    const futureEvents = events
      .map((event) => new Date(event.date))
      .filter((date) => date >= today)
      .sort((a, b) => a.getTime() - b.getTime());

    if (futureEvents.length > 0) {
      const nextEventDate = futureEvents[0];
      setCurrentMonth(nextEventDate);
      setSelectedDate(nextEventDate);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 relative overflow-x-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-800 px-6 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white bg-clip-text cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap font-[family-name:var(--font-logo)] flex items-center translate-y-0.5">
                Groovetree
              </h1>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/favorites"
              className="flex items-center gap-2 px-4 py-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
              title="Favorite Artists"
            >
              <FaHeart className="w-5 h-5" />
              <span className="hidden md:inline">Favorites</span>
            </Link>

            <Link
              href="/dashboard/calendar"
              className="flex items-center gap-2 px-4 py-2 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 rounded-lg transition-colors"
              title="Shows Calendar"
            >
              <MdCalendarMonth className="w-5 h-5" />
              <span className="hidden md:inline">Calendar</span>
            </Link>

            <Link
              href="/dashboard/edit"
              className="flex items-center gap-2 px-4 py-2 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
            >
              <BsEyeFill className="w-5 h-5" />
              <span className="hidden md:inline">Dashboard</span>
            </Link>

            {user && (
              <div className="scale-90">
                <UserMenu user={user} />
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Shows Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {events.length} {events.length === 1 ? "show" : "shows"} from your
            favorite artists
          </p>
        </div>

        {/* Loading State */}
        {isLoadingEvents ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : events.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <MdCalendarMonth className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No shows found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You haven't favorited any artists yet or your favorite artists
                don't have any shows scheduled.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <FaExternalLinkAlt className="w-4 h-4" />
                Explore Artists
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar View */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={handlePreviousMonth}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5 8.25 12l7.5-7.5"
                      />
                    </svg>
                  </button>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                    {format(currentMonth, "MMMM yyyy", { locale: enUS })}
                  </h2>

                  <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>
                </div>

                {/* Week Days Header */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 py-2"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {dateRange.map((date, index) => {
                    const dateKey = format(date, "yyyy-MM-dd");
                    const dayEvents = eventsByDate[dateKey] || [];
                    const isCurrentMonth = isSameMonth(date, currentMonth);
                    const isSelected =
                      selectedDate && isSameDay(date, selectedDate);
                    const isTodayDate = isToday(date);
                    const isPastDate = isPast(date) && !isTodayDate;

                    return (
                      <button
                        key={index}
                        onClick={() => handleDateClick(date)}
                        disabled={dayEvents.length === 0}
                        className={`
                          relative min-h-[80px] p-2 rounded-lg transition-all
                          ${
                            !isCurrentMonth
                              ? "text-gray-400 dark:text-gray-600 bg-transparent"
                              : "text-gray-900 dark:text-gray-100"
                          }
                          ${isTodayDate ? "ring-2 ring-purple-500" : ""}
                          ${
                            isSelected
                              ? "bg-purple-600 text-white"
                              : dayEvents.length > 0
                              ? "bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-800/40 cursor-pointer"
                              : "bg-transparent cursor-default"
                          }
                          ${
                            isPastDate && dayEvents.length > 0
                              ? "opacity-50"
                              : ""
                          }
                        `}
                      >
                        <div className="text-sm font-medium mb-1">
                          {format(date, "d")}
                        </div>
                        {dayEvents.length > 0 && (
                          <div className="space-y-1">
                            {dayEvents.slice(0, 2).map((event, idx) => (
                              <div
                                key={idx}
                                className={`text-xs px-1 py-0.5 rounded truncate ${
                                  isSelected
                                    ? "bg-purple-700 text-white"
                                    : "bg-purple-500 dark:bg-purple-600 text-white"
                                }`}
                                title={event.title}
                              >
                                {event.artist.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div
                                className={`text-xs ${
                                  isSelected
                                    ? "text-purple-100"
                                    : "text-gray-600 dark:text-gray-400"
                                }`}
                              >
                                +{dayEvents.length - 2} mais
                              </div>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 items-center justify-between">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-purple-500 dark:bg-purple-600"></div>
                      <span>With shows</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded ring-2 ring-purple-500"></div>
                      <span>Today</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-purple-600 dark:bg-purple-700"></div>
                      <span>Selected</span>
                    </div>
                  </div>
                  {events.length > 0 && (
                    <button
                      onClick={handleNextEvent}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-sm text-sm font-medium"
                    >
                      <span>Next Event</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m8.25 4.5 7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Event Details Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm p-6 sticky top-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {selectedDate
                    ? format(selectedDate, "MMMM dd", { locale: enUS })
                    : "Select a date"}
                </h3>

                {selectedDate && selectedDateEvents.length > 0 ? (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                    {selectedDateEvents.map((event) => {
                      const eventDate = new Date(event.date);
                      const isEventPast =
                        isPast(eventDate) && !isToday(eventDate);

                      return (
                        <div
                          key={event.id}
                          className={`p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 ${
                            isEventPast ? "opacity-60" : ""
                          }`}
                        >
                          <Link
                            href={`/${event.artist.slug}`}
                            className="flex items-center gap-3 mb-3 group"
                          >
                            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-purple-500/20">
                              {event.artist.avatarUrl ? (
                                <img
                                  src={event.artist.avatarUrl}
                                  alt={event.artist.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                                  {event.artist.title.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <span className="text-sm text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors font-medium">
                              {event.artist.title}
                            </span>
                          </Link>

                          <h4 className="text-gray-900 dark:text-white font-semibold mb-2">
                            {event.title}
                          </h4>

                          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-start gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                                />
                              </svg>
                              <span>
                                {event.venue}
                                <br />
                                {event.city}
                                {event.state && `, ${event.state}`}
                              </span>
                            </div>
                          </div>

                          {event.ticketUrl && !isEventPast && (
                            <a
                              href={event.ticketUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-colors w-full justify-center"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
                                />
                              </svg>
                              Buy Tickets
                            </a>
                          )}

                          {isEventPast && (
                            <span className="inline-block mt-3 px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                              Past event
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : selectedDate ? (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    No shows on this date.
                  </p>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Click on a date with shows to see details.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.7);
        }
      `}</style>
    </div>
  );
}
