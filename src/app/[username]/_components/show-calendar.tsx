"use client";

import { Button } from "@/app/components/ui/button";
import { Calendar, MapPin, Ticket } from "lucide-react";

interface Event {
  id: string;
  title: string;
  venue: string;
  city: string;
  state?: string | null;
  date: Date;
  ticketUrl?: string | null;
}

interface ShowCalendarProps {
  events: Event[];
  isLight?: boolean;
}

export function ShowCalendar({ events, isLight = false }: ShowCalendarProps) {
  // Se não houver eventos, não renderiza nada
  if (!events || events.length === 0) {
    return null;
  }

  // Formatar data no formato "FRI, MAR 15"
  const formatDate = (date: Date) => {
    const eventDate = new Date(date);
    return eventDate
      .toLocaleDateString("pt-BR", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
      .toUpperCase();
  };

  return (
    <section className="my-12 text-center">
      <h1
        className="my-6 font-sans text-3xl font-bold tracking-tight text-balance"
        style={{ color: isLight ? "#000000" : "#ffffff" }}
      >
        Próximos shows
      </h1>
      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className={`
              rounded-xl p-5 transition-all hover:scale-[1.02] backdrop-blur-xl border shadow-xl
              ${
                isLight
                  ? "bg-black/5 border-black/10 hover:bg-black/10"
                  : "bg-white/10 border-white/20 hover:bg-white/15"
              }
            `}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2 text-left">
                <div
                  className="flex items-center gap-2 font-semibold"
                  style={{ color: isLight ? "#7c3aed" : "#a78bfa" }}
                >
                  <Calendar className="h-4 w-4" />
                  <span className="font-mono text-sm">
                    {formatDate(event.date)}
                  </span>
                </div>
                <h3
                  className="font-sans text-lg font-bold"
                  style={{ color: isLight ? "#000000" : "#ffffff" }}
                >
                  {event.title}
                </h3>
                <div
                  className="flex items-center gap-2"
                  style={{ color: isLight ? "#4b5563" : "#9ca3af" }}
                >
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">
                    {event.venue} - {event.city}
                    {event.state ? `, ${event.state}` : ""}
                  </span>
                </div>
              </div>
              {event.ticketUrl && (
                <Button
                  asChild
                  className={`
                    ${
                      isLight
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "bg-purple-500 text-white hover:bg-purple-600"
                    }
                  `}
                >
                  <a
                    href={event.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Ticket className="mr-2 h-4 w-4" />
                    Comprar ingressos
                  </a>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
