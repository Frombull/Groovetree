"use client";

import { Card } from "@/app/components/ui/card";
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
}

export function ShowCalendar({ events }: ShowCalendarProps) {
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
      <h1 className="my-6 font-sans text-3xl font-bold tracking-tight text-white text-balance">
        Próximos shows
      </h1>
      <div className="space-y-3">
        {events.map((event) => (
          <Card
            key={event.id}
            className="border-2 bg-card p-5 transition-colors hover:border-primary"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 text-primary">
                  <Calendar className="h-4 w-4" />
                  <span className="font-mono text-sm font-semibold">
                    {formatDate(event.date)}
                  </span>
                </div>
                <h3 className="font-sans text-lg font-bold text-card-foreground">
                  {event.title}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground">
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
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
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
          </Card>
        ))}
      </div>
    </section>
  );
}
